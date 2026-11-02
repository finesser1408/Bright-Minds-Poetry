from django.conf import settings
from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase, override_settings
from django.urls import reverse
from urllib.parse import parse_qs, urlparse
from rest_framework.test import APIClient
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Poem

User = get_user_model()


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend", FRONTEND_URL="https://poetry.example.test")
class ProductionSecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.author = User.objects.create_user(username="author", email="author@example.test", password="Strong-poem-password-42")
        self.other_user = User.objects.create_user(username="reader", email="reader@example.test", password="Strong-reader-password-42")
        from allauth.account.models import EmailAddress
        EmailAddress.objects.create(user=self.author, email=self.author.email, primary=True, verified=True)
        EmailAddress.objects.create(user=self.other_user, email=self.other_user.email, primary=True, verified=True)
        self.poem = Poem.objects.create(title="First poem", content="A quiet line", author=self.author.username)

    def test_poem_list_is_public_and_includes_other_authors(self):
        response = self.client.get("/api/poems/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([item["author"] for item in response.data], ["author"])

    def test_poem_creation_requires_login_and_uses_authenticated_author(self):
        response = self.client.post("/api/poems/", {"title": "No author", "content": "A poem"}, format="json")
        self.assertEqual(response.status_code, 401)

        self.client.force_authenticate(self.author)
        response = self.client.post("/api/poems/", {"title": "Safe author", "author": "forged", "content": "A poem"}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["author"], self.author.username)

    def test_author_cannot_edit_another_users_poem(self):
        self.client.force_authenticate(self.other_user)
        response = self.client.patch(f"/api/poems/{self.poem.id}/", {"title": "Hijacked"}, format="json")
        self.assertEqual(response.status_code, 403)
        self.poem.refresh_from_db()
        self.assertEqual(self.poem.title, "First poem")

    def test_password_reset_is_generic_and_revokes_refresh_tokens(self):
        response = self.client.post("/api/auth/forgot-password/", {"email": self.author.email}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("If an account matches", response.data["detail"])
        self.assertEqual(len(mail.outbox), 1)
        reset_mail = mail.outbox[0]
        self.assertEqual(reset_mail.to, [self.author.email])
        self.assertIn("https://poetry.example.test/reset-password?uid=", reset_mail.body)

        refresh = RefreshToken.for_user(self.author)
        uid = __import__("django.utils.http", fromlist=["urlsafe_base64_encode"]).urlsafe_base64_encode(
            __import__("django.utils.encoding", fromlist=["force_bytes"]).force_bytes(self.author.pk)
        )
        from django.contrib.auth.tokens import default_token_generator
        response = self.client.post("/api/auth/reset-password/", {
            "uid": uid,
            "token": default_token_generator.make_token(self.author),
            "new_password1": "Another-strong-password-42",
            "new_password2": "Another-strong-password-42",
        }, format="json")
        self.assertEqual(response.status_code, 200)
        self.author.refresh_from_db()
        self.assertTrue(self.author.check_password("Another-strong-password-42"))
        with self.assertRaises(TokenError):
            RefreshToken(str(refresh))

    def test_registration_sends_frontend_verification_link_and_blocks_login_until_verified(self):
        response = self.client.post("/api/auth/registration/", {
            "username": "newpoet",
            "email": "newpoet@example.test",
            "password1": "Strong-new-password-84",
            "password2": "Strong-new-password-84",
            "first_name": "New",
            "last_name": "Poet",
        }, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(mail.outbox), 1)
        verification_mail = mail.outbox[0]
        self.assertEqual(verification_mail.to, ["newpoet@example.test"])
        link = next(line.strip() for line in verification_mail.body.splitlines() if "verify-email" in line)
        self.assertTrue(link.startswith("https://poetry.example.test/verify-email?key="))
        key = parse_qs(urlparse(link).query)["key"][0]

        user = User.objects.get(username="newpoet")
        self.assertFalse(user.emailaddress_set.filter(verified=True).exists())
        login = self.client.post(
            "/api/auth/login/",
            {"username": "newpoet", "password": "Strong-new-password-84"},
            format="json",
        )
        self.assertIn(login.status_code, (400, 401))

        verify = self.client.post("/api/auth/registration/verify-email/", {"key": key}, format="json")
        self.assertEqual(verify.status_code, 200)
        user.refresh_from_db()
        self.assertTrue(user.emailaddress_set.filter(verified=True).exists())

        login = self.client.post(
            "/api/auth/login/",
            {"username": "newpoet", "password": "Strong-new-password-84"},
            format="json",
        )
        self.assertEqual(login.status_code, 200)
        who = self.client.get("/api/auth/user/")
        self.assertEqual(who.status_code, 200)
        self.assertEqual(who.data["username"], "newpoet")

    def test_contact_form_email_is_sent_to_owner_with_visitor_reply_to(self):
        response = self.client.post("/api/messages/", {
            "name": "Visitor",
            "email": "visitor@example.test",
            "subject": "Booking question",
            "content": "How do I book a session?",
        }, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(mail.outbox), 1)
        contact_mail = mail.outbox[0]
        self.assertEqual(contact_mail.to, [settings.CONTACT_RECIPIENT_EMAIL])
        self.assertEqual(contact_mail.reply_to, ["visitor@example.test"])
        self.assertIn("Booking question", contact_mail.subject)
        self.assertIn("How do I book a session?", contact_mail.body)

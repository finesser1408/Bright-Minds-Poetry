from allauth.account.adapter import DefaultAccountAdapter


class VerifiedEmailAccountAdapter(DefaultAccountAdapter):
    def clean_password(self, password, user=None):
        from django.contrib.auth.password_validation import validate_password
        validate_password(password, user)
        return super().clean_password(password, user)

    def send_confirmation_mail(self, request, emailconfirmation, signup):
        from django.conf import settings
        from django.core.mail import send_mail
        from urllib.parse import urlencode

        link = f"{settings.FRONTEND_URL.rstrip('/')}/verify-email?{urlencode({'key': emailconfirmation.key})}"
        send_mail(
            "Verify your Bright Minds Poetry email address",
            f"Use this link to verify your email address and activate your account:\n\n{link}\n",
            settings.DEFAULT_FROM_EMAIL,
            [emailconfirmation.email_address.email],
            fail_silently=False,
        )

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.core.exceptions import ValidationError

User = get_user_model()
GENERIC_RESET_RESPONSE = {"detail": "If an account matches that email, recovery instructions will be sent."}


@method_decorator(ensure_csrf_cookie, name="dispatch")
class RegistrationView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "auth"

    def post(self, request):
        return Response({"detail": "Registration is handled by the secure dj-rest-auth registration endpoint."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@method_decorator(ensure_csrf_cookie, name="dispatch")
class VerifyEmailView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "auth"

    def post(self, request):
        return Response({"detail": "Email verification is handled by the secure dj-rest-auth endpoint."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@method_decorator(ensure_csrf_cookie, name="dispatch")
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "auth"

    def post(self, request):
        try:
            email = str(request.data.get("email", "")).strip().lower()
        except Exception:
            email = ""
        user = User.objects.filter(email__iexact=email, is_active=True).first()
        if user and user.emailaddress_set.filter(email__iexact=user.email, verified=True).exists():
            try:
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                token = default_token_generator.make_token(user)
                from urllib.parse import urlencode
                link = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password?{urlencode({'uid': uid, 'token': token})}"
                sent = send_mail(
                    "Reset your Bright Minds Poetry password",
                    f"Use this link to choose a new password. It expires automatically:\n\n{link}\n",
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
                if sent != 1:
                    return Response({"detail": "We could not send recovery email. Please try again later."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            except Exception:
                return Response(
                    {"detail": "We could not send recovery email. Please try again later."},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )
        return Response(GENERIC_RESET_RESPONSE)


@method_decorator(ensure_csrf_cookie, name="dispatch")
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "auth"

    def post(self, request):
        uid = str(request.data.get("uid", ""))
        token = str(request.data.get("token", ""))
        password = request.data.get("new_password1", "")
        confirmation = request.data.get("new_password2", "")
        if not isinstance(password, str) or not password or password != confirmation:
            return Response({"detail": "Enter matching new passwords."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if not user or not user.emailaddress_set.filter(email__iexact=user.email, verified=True).exists() or not default_token_generator.check_token(user, token):
            return Response({"detail": "This password reset link is invalid or expired."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            validate_password(password, user)
        except ValidationError as error:
            return Response({"new_password1": list(error.messages)}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(password)
        user.save(update_fields=["password"])
        for outstanding in OutstandingToken.objects.filter(user=user):
            BlacklistedToken.objects.get_or_create(token=outstanding)
        return Response({"detail": "Password updated. You can now sign in."})

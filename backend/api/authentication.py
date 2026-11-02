from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.core.exceptions import PermissionDenied

UserModel = get_user_model()

class UsernameOrEmailBackend(ModelBackend):
    """
    Custom authentication backend that allows users to log in with either username or email.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        identifier = username or kwargs.get('identifier') or kwargs.get('email')
        if not identifier or password is None:
            return None
        try:
            user = UserModel.objects.get(username__iexact=identifier)
        except UserModel.DoesNotExist:
            try:
                user = UserModel.objects.get(email__iexact=identifier)
            except UserModel.DoesNotExist:
                UserModel().set_password(password)
                return None
        if user.check_password(password) and self.user_can_authenticate(user):
            addresses = user.emailaddress_set.all()
            if addresses and not addresses.filter(verified=True).exists():
                # Raise instead of returning None so Django aborts the backend
                # chain and ModelBackend cannot bypass mandatory verification.
                raise PermissionDenied("Verify your email address before signing in.")
            return user
        return None

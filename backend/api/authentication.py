from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

UserModel = get_user_model()

class UsernameOrEmailBackend(ModelBackend):
    """
    Custom authentication backend that allows users to log in with either username or email.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get('identifier') or kwargs.get('email')
        user = None
        if username is not None:
            # Try to fetch by username
            try:
                user = UserModel.objects.get(username=username)
            except UserModel.DoesNotExist:
                # Try to fetch by email
                try:
                    user = UserModel.objects.get(email=username)
                except UserModel.DoesNotExist:
                    return None
            if user and user.check_password(password):
                return user
        return None

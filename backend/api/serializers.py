from rest_framework import serializers
from .models import Poem, Like, Comment, Message, UserProfile, GalleryItem
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

class SecureRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password1 = serializers.CharField(write_only=True, trim_whitespace=False)
    password2 = serializers.CharField(write_only=True, trim_whitespace=False)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)

    def validate_username(self, value):
        value = value.strip()
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("That username is unavailable.")
        return value

    def validate_email(self, value):
        normalized = value.strip().lower()
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return normalized

    def validate_password1(self, value):
        try:
            validate_password(value, User(username=self.initial_data.get("username", ""), email=self.initial_data.get("email", "")))
        except ValidationError as error:
            raise serializers.ValidationError(list(error.messages))
        return value

    def validate(self, attrs):
        if attrs["password1"] != attrs["password2"]:
            raise serializers.ValidationError({"password2": "The passwords do not match."})
        return attrs

    def get_cleaned_data(self):
        return {
            "username": self.validated_data["username"],
            "email": self.validated_data["email"],
            "password1": self.validated_data["password1"],
            "first_name": self.validated_data.get("first_name", ""),
            "last_name": self.validated_data.get("last_name", ""),
        }

    def save(self, request):
        from allauth.account.adapter import get_adapter
        from allauth.account.utils import setup_user_email

        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        setup_user_email(request, user, [])
        return user


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'poem', 'user', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'poem', 'user', 'content', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def validate_content(self, value):
        value = value.strip()
        if not value or len(value) > 5000:
            raise serializers.ValidationError("Comments must contain 1 to 5,000 characters.")
        return value

class PoemSerializer(serializers.ModelSerializer):
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    author = serializers.CharField(read_only=True)
    comments_list = CommentSerializer(source='comments', many=True, read_only=True)
    date = serializers.DateTimeField(source='created_at', format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Poem
        fields = ['id', 'title', 'author', 'content', 'media_type', 'media_file', 'created_at', 'date', 'likes_count', 'comments_list']
        read_only_fields = ['id', 'author', 'created_at', 'date', 'likes_count', 'comments_list']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'name', 'email', 'subject', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_name(self, value):
        value = value.strip()
        if not value or len(value) > 100:
            raise serializers.ValidationError("Enter a name of at most 100 characters.")
        return value

    def validate_subject(self, value):
        value = value.strip()
        if not value or len(value) > 200:
            raise serializers.ValidationError("Enter a subject of at most 200 characters.")
        return value

    def validate_content(self, value):
        value = value.strip()
        if not value or len(value) > 10000:
            raise serializers.ValidationError("Enter a message of at most 10,000 characters.")
        return value

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = UserProfile
        fields = [
            'id', 'username', 'avatar', 'bio', 'location', 'favorite_genre', 'writing_since', 'website',
            'twitter', 'instagram', 'linkedin'
        ]

class GalleryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryItem
        fields = [
            'id', 'title', 'description', 'item_type', 'media_type', 'media_file',
            'thumbnail', 'content', 'author', 'published_date', 'created_at', 
            'updated_at', 'publisher', 'publication_date', 'isbn', 'poem'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        
        # Include the full URL for media files
        if instance.media_file:
            representation['media_file'] = request.build_absolute_uri(instance.media_file.url) if request else instance.media_file.url
            
        # Include the full URL for thumbnail if it exists
        if instance.thumbnail:
            representation['thumbnail'] = request.build_absolute_uri(instance.thumbnail.url) if request else instance.thumbnail.url
        
        # Include poem details if it's a poem
        if instance.poem:
            representation['poem_details'] = PoemSerializer(instance.poem).data
            
        return representation

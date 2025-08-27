from rest_framework import serializers
from .models import Poem, Like, Comment, Message, UserProfile, GalleryItem
from django.contrib.auth.models import User

class PoemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poem
        fields = '__all__'

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

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

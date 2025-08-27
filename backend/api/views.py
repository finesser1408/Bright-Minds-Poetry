from rest_framework import viewsets, views, status
from rest_framework.response import Response
from django.db.models import Count
from django.core.mail import send_mail
from django.conf import settings
from .models import Poem, Like, Comment, Message, UserProfile, GalleryItem
from .serializers import (
    PoemSerializer, LikeSerializer, CommentSerializer, 
    MessageSerializer, UserProfileSerializer, GalleryItemSerializer
)
from django.contrib.auth.models import User

class PoemViewSet(viewsets.ModelViewSet):
    queryset = Poem.objects.all()
    serializer_class = PoemSerializer

class CommunityHighlightsView(views.APIView):
    def get(self, request):
        # Top 3 most liked poems
        top_liked = Poem.objects.annotate(num_likes=Count('likes')).order_by('-num_likes')[:3]
        # Top 3 most commented poems
        top_commented = Poem.objects.annotate(num_comments=Count('comments')).order_by('-num_comments')[:3]
        # Most recent poem
        most_recent = Poem.objects.order_by('-id').first()
        return Response({
            'top_liked': PoemSerializer(top_liked, many=True).data,
            'top_commented': PoemSerializer(top_commented, many=True).data,
            'most_recent': PoemSerializer(most_recent).data if most_recent else None,
        })

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        message = serializer.instance  # Get the created message here
        # Send email
        send_mail(
            subject=f"Bright Minds Poetry Message: {message.subject}",
            message=f"Name: {message.name}\nEmail: {message.email}\n\n{message.content}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.DEFAULT_FROM_EMAIL],
            fail_silently=True,
        )
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    http_method_names = ['get', 'put', 'patch', 'head', 'options']

    def get_queryset(self):
        # Optionally filter to only the requesting user
        user = self.request.user
        if user.is_authenticated:
            return UserProfile.objects.filter(user=user)
        return UserProfile.objects.none()

    def perform_update(self, serializer):
        serializer.save()

class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class GalleryItemViewSet(viewsets.ModelViewSet):
    serializer_class = GalleryItemSerializer
    
    def get_queryset(self):
        queryset = GalleryItem.objects.all()
        item_type = self.request.query_params.get('type')
        if item_type in ['publication', 'poem']:
            queryset = queryset.filter(item_type=item_type)
        return queryset.order_by('-published_date')
    
    def get_serializer_context(self):
        return {'request': self.request}

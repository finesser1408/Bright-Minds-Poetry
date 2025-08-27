from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PoemViewSet, LikeViewSet, CommentViewSet, 
    CommunityHighlightsView, MessageViewSet, 
    UserProfileViewSet, GalleryItemViewSet
)

router = DefaultRouter()
router.register(r'poems', PoemViewSet, basename='poem')
router.register(r'likes', LikeViewSet, basename='like')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'gallery', GalleryItemViewSet, basename='gallery-item')

urlpatterns = [
    path('highlights/', CommunityHighlightsView.as_view(), name='community-highlights'),
]
urlpatterns += router.urls

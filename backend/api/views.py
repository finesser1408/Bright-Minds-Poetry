from django.conf import settings
from django.core.mail import EmailMessage
from django.db.models import Count
from rest_framework import status, viewsets, views
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from .models import Comment, GalleryItem, Like, Message, Poem, UserProfile
from .serializers import (
    CommentSerializer,
    GalleryItemSerializer,
    LikeSerializer,
    MessageSerializer,
    PoemSerializer,
    UserProfileSerializer,
)


class PoemViewSet(viewsets.ModelViewSet):
    serializer_class = PoemSerializer

    def get_queryset(self):
        queryset = Poem.objects.all().order_by("-created_at", "-id")
        author = self.request.query_params.get("author")
        if author:
            queryset = queryset.filter(author=author)
        return queryset

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user.username)

    def perform_update(self, serializer):
        poem = self.get_object()
        if poem.author != self.request.user.username and not self.request.user.is_staff:
            raise PermissionDenied("You can only edit your own work.")
        serializer.save(author=poem.author)

    def perform_destroy(self, instance):
        if instance.author != self.request.user.username and not self.request.user.is_staff:
            raise PermissionDenied("You can only delete your own work.")
        instance.delete()


class CommunityHighlightsView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        top_liked = Poem.objects.annotate(num_likes=Count("likes")).order_by("-num_likes", "-created_at")[:3]
        top_commented = Poem.objects.annotate(num_comments=Count("comments")).order_by("-num_comments", "-created_at")[:3]
        most_recent = Poem.objects.order_by("-created_at", "-id").first()
        return Response({
            "top_liked": PoemSerializer(top_liked, many=True).data,
            "top_commented": PoemSerializer(top_commented, many=True).data,
            "most_recent": PoemSerializer(most_recent).data if most_recent else None,
        })


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().order_by("-created_at")
    serializer_class = MessageSerializer
    http_method_names = ["get", "post", "head", "options"]

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsAdminUser()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.save()
        try:
            email = EmailMessage(
                subject=f"Bright Minds Poetry message: {message.subject}",
                body=f"Name: {message.name}\nEmail: {message.email}\n\n{message.content}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.CONTACT_RECIPIENT_EMAIL],
                reply_to=[message.email],
            )
            sent = email.send(fail_silently=False)
        except Exception:
            return Response(
                {"detail": "Your message could not be emailed right now. Please try again later."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        if sent != 1:
            return Response(
                {"detail": "Your message could not be emailed right now. Please try again later."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return Response({"detail": "Message sent."}, status=status.HTTP_201_CREATED)


class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "put", "patch", "head", "options"]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.select_related("poem").all()
    serializer_class = LikeSerializer
    http_method_names = ["get", "post", "head", "options"]

    def get_permissions(self):
        return [AllowAny()] if self.action == "list" else [IsAuthenticated()]

    def get_queryset(self):
        queryset = Like.objects.all()
        poem_id = self.request.query_params.get("poem")
        poem_author = self.request.query_params.get("poem_author")
        if poem_id:
            queryset = queryset.filter(poem_id=poem_id)
        if poem_author:
            queryset = queryset.filter(poem__author=poem_author)
        return queryset

    def perform_create(self, serializer):
        if Like.objects.filter(poem_id=serializer.validated_data["poem"].id, user=self.request.user.username).exists():
            raise PermissionDenied("You have already appreciated this poem.")
        serializer.save(user=self.request.user.username)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.select_related("poem").all()
    serializer_class = CommentSerializer
    http_method_names = ["get", "post", "head", "options"]

    def get_permissions(self):
        return [AllowAny()] if self.action == "list" else [IsAuthenticated()]

    def get_queryset(self):
        queryset = Comment.objects.all()
        poem_id = self.request.query_params.get("poem")
        if poem_id:
            queryset = queryset.filter(poem_id=poem_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user.username)



class GalleryItemViewSet(viewsets.ModelViewSet):
    serializer_class = GalleryItemSerializer

    def get_queryset(self):
        queryset = GalleryItem.objects.all()
        item_type = self.request.query_params.get("type")
        if item_type in ("publication", "poem"):
            queryset = queryset.filter(item_type=item_type)
        return queryset.order_by("-published_date")

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsAdminUser()]

    def get_serializer_context(self):
        return {"request": self.request}

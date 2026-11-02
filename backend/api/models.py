from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Poem(models.Model):
    MEDIA_TYPE_CHOICES = [
        ("text", "Text"),
        ("image", "Image"),
        ("video", "Video"),
        ("document", "Document"),
    ]
    title = models.CharField(max_length=200, blank=True, null=True)
    author = models.CharField(max_length=150, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES, default="text")
    media_file = models.FileField(upload_to="poem_media/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or "Untitled poem"

class Like(models.Model):
    poem = models.ForeignKey(Poem, on_delete=models.CASCADE, related_name='likes')
    user = models.CharField(max_length=150, blank=True, null=True)  # Authenticated username set by the API
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} liked {self.poem.title}"

class Comment(models.Model):
    poem = models.ForeignKey(Poem, on_delete=models.CASCADE, related_name='comments')
    user = models.CharField(max_length=150, blank=True, null=True)  # Authenticated username set by the API
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} on {self.poem.title}: {self.content[:20]}"

class Message(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name} <{self.email}>: {self.subject}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    favorite_genre = models.CharField(max_length=100, blank=True)
    writing_since = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)

    def __str__(self):
        return f"Profile of {self.user.username}"

class GalleryItem(models.Model):
    ITEM_TYPES = [
        ('publication', 'Publication'),
        ('poem', 'Poem'),
    ]
    
    MEDIA_TYPES = [
        ('image', 'Image'),
        ('video', 'Video'),
        ('document', 'Document'),
        ('text', 'Text'),
    ]
    
    title = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    item_type = models.CharField(max_length=20, choices=ITEM_TYPES)
    media_type = models.CharField(max_length=20, choices=MEDIA_TYPES)
    media_file = models.FileField(upload_to='gallery_media/', blank=True, null=True)
    thumbnail = models.ImageField(upload_to='gallery_thumbnails/', blank=True, null=True, 
                                help_text='Thumbnail image for the document (recommended size: 300x300px)')
    content = models.TextField(blank=True, null=True)
    author = models.CharField(max_length=100, blank=True, null=True)
    published_date = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # For publications
    publisher = models.CharField(max_length=200, blank=True, null=True)
    publication_date = models.DateField(blank=True, null=True)
    isbn = models.CharField(max_length=20, blank=True, null=True)
    
    # For poems
    poem = models.ForeignKey(Poem, on_delete=models.SET_NULL, null=True, blank=True, related_name='gallery_items')
    
    def __str__(self):
        return f"{self.get_item_type_display()}: {self.title}"

# Signals to create/save profile when user is created
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()

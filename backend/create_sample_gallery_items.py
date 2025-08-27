import os
import django
import sys
from datetime import datetime, timedelta

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'brightminds.settings')
django.setup()

from api.models import GalleryItem, User
from django.core.files import File

def create_sample_gallery_items():
    """Create sample gallery items for testing."""
    print("Creating sample gallery items...")
    
    # Get or create a test user
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User'
        }
    )
    if created:
        user.set_password('testpass123')
        user.save()
    
    # Sample gallery items data
    sample_items = [
        {
            'title': 'Inspirational Poetry',
            'description': 'A collection of inspirational poems',
            'item_type': 'poem',
            'media_type': 'text',
            'content': 'Roses are red, violets are blue...',
            'author': 'Test User',
        },
        {
            'title': 'Nature Photography',
            'description': 'Beautiful nature photography',
            'item_type': 'publication',
            'media_type': 'image',
            'media_file': 'gallery_media/nature.jpg',
            'thumbnail': 'gallery_thumbnails/nature_thumb.jpg',
            'author': 'Test User',
        },
        {
            'title': 'Poetry Reading',
            'description': 'Video of poetry reading',
            'item_type': 'poem',
            'media_type': 'video',
            'media_file': 'gallery_media/poetry_reading.mp4',
            'thumbnail': 'gallery_thumbnails/poetry_thumb.jpg',
            'author': 'Test User',
        },
        {
            'title': 'Poetry Collection',
            'description': 'Downloadable poetry collection',
            'item_type': 'publication',
            'media_type': 'document',
            'media_file': 'gallery_media/poetry_collection.pdf',
            'thumbnail': 'gallery_thumbnails/poetry_pdf_thumb.jpg',
            'author': 'Test User',
        },
    ]
    
    # Create the sample items
    for i, item_data in enumerate(sample_items, 1):
        # Set published date to be spread out over the last 30 days
        published_date = datetime.now() - timedelta(days=30-i*2)
        
        # Create the gallery item
        gallery_item = GalleryItem.objects.create(
            title=item_data['title'],
            description=item_data['description'],
            item_type=item_data['item_type'],
            media_type=item_data['media_type'],
            author=item_data['author'],
            published_date=published_date,
            publisher='Bright Minds Poetry',
            content=item_data.get('content', ''),
        )
        
        # Print success message
        print(f"Created gallery item: {gallery_item.title} (ID: {gallery_item.id})")
    
    print("\nSample gallery items created successfully!")
    print("Note: The media files referenced in the sample data don't actually exist yet.")
    print("You'll need to upload the actual files to the media directory or update the references.")

if __name__ == "__main__":
    create_sample_gallery_items()

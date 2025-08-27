import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'brightminds.settings')
django.setup()

from api.models import GalleryItem

def list_gallery_items():
    """List all GalleryItems in the database."""
    print("Listing all GalleryItems in the database...\n")
    
    items = GalleryItem.objects.all()
    total_items = items.count()
    
    print(f"Found {total_items} GalleryItems in the database.\n")
    
    for item in items:
        print(f"ID: {item.id}")
        print(f"Title: {item.title}")
        print(f"Type: {item.item_type}")
        print(f"Media Type: {item.media_type}")
        print(f"Media File: {item.media_file}")
        print(f"Thumbnail: {item.thumbnail}")
        print(f"Created: {item.created_at}")
        print("-" * 50)
    
    print("\nCheck complete.")

if __name__ == "__main__":
    list_gallery_items()

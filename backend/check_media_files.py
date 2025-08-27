import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'brightminds.settings')
django.setup()

from django.conf import settings
from api.models import GalleryItem

def check_media_files():
    """Check for missing media files in the GalleryItem model."""
    print("Checking for missing media files...\n")
    
    # Ensure media directories exist
    media_dirs = [
        os.path.join(settings.MEDIA_ROOT, 'gallery_media'),
        os.path.join(settings.MEDIA_ROOT, 'gallery_thumbnails')
    ]
    
    for directory in media_dirs:
        os.makedirs(directory, exist_ok=True)
    
    missing_files = []
    total_items = GalleryItem.objects.count()
    
    print(f"Found {total_items} gallery items in the database.")
    
    for item in GalleryItem.objects.all():
        # Check media file
        if item.media_file:
            file_path = os.path.join(settings.MEDIA_ROOT, str(item.media_file))
            if not os.path.exists(file_path):
                missing_files.append({
                    'id': item.id,
                    'title': item.title,
                    'file': str(item.media_file),
                    'type': 'media_file',
                    'path': file_path
                })
        
        # Check thumbnail
        if item.thumbnail:
            thumb_path = os.path.join(settings.MEDIA_ROOT, str(item.thumbnail))
            if not os.path.exists(thumb_path):
                missing_files.append({
                    'id': item.id,
                    'title': item.title,
                    'file': str(item.thumbnail),
                    'type': 'thumbnail',
                    'path': thumb_path
                })
    
    # Print results
    print("\n" + "="*80)
    print(f"Checked {total_items} gallery items.")
    print(f"Found {len(missing_files)} missing files.")
    
    if missing_files:
        print("\nMissing files:")
        for i, missing in enumerate(missing_files, 1):
            print(f"\n{i}. ID: {missing['id']} - {missing['title']}")
            print(f"   Type: {missing['type']}")
            print(f"   File: {missing['file']}")
            print(f"   Expected path: {missing['path']}")
    
    print("\n" + "="*80)
    print("Check complete.")
    
    if missing_files:
        print("\nTo fix these issues:")
        print("1. Ensure all media files are in the correct directories:")
        print(f"   - Media files: {os.path.join(settings.MEDIA_ROOT, 'gallery_media')}")
        print(f"   - Thumbnails: {os.path.join(settings.MEDIA_ROOT, 'gallery_thumbnails')}")
        print("2. Or update the database records to point to the correct file locations.")
        print("3. You can also use the Django admin to re-upload the missing files.")

if __name__ == "__main__":
    check_media_files()

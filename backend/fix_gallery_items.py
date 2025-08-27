import os
import sys
import django
from pathlib import Path

def setup_django():
    """Set up Django environment."""
    sys.path.append(str(Path(__file__).parent))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'brightminds.settings')
    django.setup()

def fix_missing_gallery_items():
    """Fix gallery items with missing media files."""
    from django.conf import settings
    from api.models import GalleryItem
    
    print("Checking for gallery items with missing media files...\n")
    
    # Get all gallery items with media files
    items_with_media = GalleryItem.objects.exclude(media_file__isnull=True).exclude(media_file__exact='')
    
    if not items_with_media.exists():
        print("No gallery items with media files found in the database.")
        return
    
    missing_count = 0
    fixed_count = 0
    
    for item in items_with_media:
        media_path = Path(settings.MEDIA_ROOT) / str(item.media_file)
        
        if not media_path.exists():
            missing_count += 1
            print(f"\nMissing media file for GalleryItem ID {item.id}:")
            print(f"- Title: {item.title}")
            print(f"- Media file: {item.media_file}")
            print(f"- Expected path: {media_path}")
            
            # Try to find an alternative image
            sample_image = Path(settings.MEDIA_ROOT) / 'gallery_media' / 'sample_image.svg'
            
            if sample_image.exists():
                # Update the item to use the sample image
                try:
                    # Create a new path for the sample image
                    new_filename = f"sample_{item.id}{sample_image.suffix}"
                    new_path = sample_image.parent / new_filename
                    
                    # Copy the sample image to the new location
                    import shutil
                    shutil.copy2(sample_image, new_path)
                    
                    # Update the database
                    item.media_file = str(Path('gallery_media') / new_filename)
                    item.save()
                    
                    print(f"✓ Fixed: Updated to use {new_filename}")
                    fixed_count += 1
                    
                except Exception as e:
                    print(f"✗ Failed to fix: {e}")
            else:
                print("✗ No sample image available to use as replacement")
    
    # Print summary
    print("\n" + "="*50)
    print(f"Gallery items checked: {items_with_media.count()}")
    print(f"Items with missing media files: {missing_count}")
    print(f"Items fixed: {fixed_count}")
    
    if missing_count > 0 and fixed_count == 0:
        print("\nRecommendation: Upload the missing media files to the media directory")
        print(f"Media root: {settings.MEDIA_ROOT}")
    
    print("\nDone!")

if __name__ == "__main__":
    setup_django()
    fix_missing_gallery_items()

import os
from django.core.management.base import BaseCommand
from django.conf import settings
from api.models import GalleryItem

class Command(BaseCommand):
    help = 'Check GalleryItem media files and verify their existence'

    def handle(self, *args, **options):
        missing_files = []
        total_items = 0
        
        self.stdout.write("Checking GalleryItem media files...\n")
        
        # Create media directories if they don't exist
        media_dirs = [
            os.path.join(settings.MEDIA_ROOT, 'gallery_media'),
            os.path.join(settings.MEDIA_ROOT, 'gallery_thumbnails')
        ]
        
        for directory in media_dirs:
            os.makedirs(directory, exist_ok=True)
        
        for item in GalleryItem.objects.all():
            total_items += 1
            
            # Check media file
            if item.media_file:
                file_path = os.path.join(settings.MEDIA_ROOT, str(item.media_file))
                if not os.path.exists(file_path):
                    missing_files.append({
                        'id': item.id,
                        'title': item.title,
                        'file': str(item.media_file),
                        'type': 'media_file',
                        'expected_path': file_path,
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
                        'expected_path': thumb_path,
                    })
        
        # Print summary
        self.stdout.write("\n" + "="*70)
        self.stdout.write(f"Gallery Items Checked: {total_items}")
        self.stdout.write(f"Missing Files Found: {len(missing_files)}")
        
        if missing_files:
            self.stdout.write("\nMissing Files:")
            for i, missing in enumerate(missing_files, 1):
                self.stdout.write(
                    f"\n{i}. ID: {missing['id']} | "
                    f"Title: {missing['title']}"
                )
                self.stdout.write(f"   Type: {missing['type']}")
                self.stdout.write(f"   File: {missing['file']}")
                self.stdout.write(f"   Expected path: {missing['expected_path']}")
        
        self.stdout.write("\n" + "="*70)
        self.stdout.write("Check complete.")
        
        if missing_files:
            self.stdout.write("\nTo fix missing files:")
            self.stdout.write("1. Ensure all media files are in the correct directories:")
            self.stdout.write(f"   - Media files: {os.path.join(settings.MEDIA_ROOT, 'gallery_media')}")
            self.stdout.write(f"   - Thumbnails: {os.path.join(settings.MEDIA_ROOT, 'gallery_thumbnails')}")
            self.stdout.write("2. Or update the database records to point to the correct file locations.")
            self.stdout.write("3. You can also use the Django admin to re-upload the missing files.")

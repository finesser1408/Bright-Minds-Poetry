import os
import django
import sys
from datetime import datetime

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'brightminds.settings')
django.setup()

from api.models import GalleryItem
from django.core.files import File
from django.utils import timezone

def recreate_gallery():
    """Recreate gallery item records from existing media files."""
    
    MEDIA_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'media')
    
    # Define gallery items based on actual files on disk
    items = [
        {
            'title': 'BLACKOUT',
            'description': 'A poetry publication by Bright Minds Poetry',
            'item_type': 'publication',
            'media_type': 'document',
            'media_file': 'gallery_media/BLACKOUT.pdf',
            'thumbnail': 'gallery_thumbnails/Blackout.jpg',
            'author': 'Tavonga',
            'publisher': 'Bright Minds Poetry',
        },
        {
            'title': 'Diary Of A Monster',
            'description': 'A poetry publication by Bright Minds Poetry',
            'item_type': 'publication',
            'media_type': 'document',
            'media_file': 'gallery_media/Diary_Of_A_Monster.pdf',
            'thumbnail': 'gallery_thumbnails/person.png',
            'author': 'Tavonga',
            'publisher': 'Bright Minds Poetry',
        },
        {
            'title': 'H.O.P.E',
            'description': 'A poetry publication by Bright Minds Poetry',
            'item_type': 'publication',
            'media_type': 'document',
            'media_file': 'gallery_media/H.O.P.E-1.pdf',
            'thumbnail': 'gallery_thumbnails/HOPE.jpg',
            'author': 'Tavonga',
            'publisher': 'Bright Minds Poetry',
        },
        {
            'title': 'Monster',
            'description': 'A poetry image by Bright Minds Poetry',
            'item_type': 'poem',
            'media_type': 'image',
            'media_file': 'gallery_media/Monster.png',
            'thumbnail': 'gallery_thumbnails/download_16.jpg',
            'author': 'Tavonga',
        },
        {
            'title': 'Mrs Finesser',
            'description': 'A poetry image by Bright Minds Poetry',
            'item_type': 'poem',
            'media_type': 'image',
            'media_file': 'gallery_media/Mrs_Finesser.png',
            'thumbnail': 'gallery_thumbnails/Mrs_Finesser.png',
            'author': 'Tavonga',
        },
        {
            'title': 'Nicole',
            'description': 'A poetry image by Bright Minds Poetry',
            'item_type': 'poem',
            'media_type': 'image',
            'media_file': 'gallery_media/Nicole.png',
            'thumbnail': 'gallery_thumbnails/Nicole.png',
            'author': 'Tavonga',
        },
        {
            'title': 'The Gap She Left',
            'description': 'A poetry image by Bright Minds Poetry',
            'item_type': 'poem',
            'media_type': 'image',
            'media_file': 'gallery_media/The_Gap_She_Left.png',
            'thumbnail': 'gallery_thumbnails/The_Gap_She_Left.png',
            'author': 'Tavonga',
        },
        {
            'title': 'Unsent Messages',
            'description': 'A poetry publication by Bright Minds Poetry',
            'item_type': 'publication',
            'media_type': 'document',
            'media_file': 'gallery_media/Unsent_Messages.pdf',
            'thumbnail': 'gallery_thumbnails/Unsent_Message.jpg',
            'author': 'Tavonga',
            'publisher': 'Bright Minds Poetry',
        },
    ]
    
    created = 0
    for item_data in items:
        # Verify files exist
        media_path = os.path.join(MEDIA_ROOT, item_data['media_file'])
        thumb_path = os.path.join(MEDIA_ROOT, item_data['thumbnail'])
        
        if not os.path.exists(media_path):
            print(f"  SKIP: media file not found: {media_path}")
            continue
        if not os.path.exists(thumb_path):
            print(f"  SKIP: thumbnail not found: {thumb_path}")
            continue
        
        gallery_item = GalleryItem.objects.create(
            title=item_data['title'],
            description=item_data['description'],
            item_type=item_data['item_type'],
            media_type=item_data['media_type'],
            media_file=item_data['media_file'],
            thumbnail=item_data['thumbnail'],
            author=item_data['author'],
            publisher=item_data.get('publisher', ''),
            published_date=timezone.now(),
        )
        print(f"  Created: {gallery_item.title} (pk={gallery_item.pk})")
        created += 1
    
    print(f"\nDone! Created {created} gallery items.")
    print(f"Total gallery items: {GalleryItem.objects.count()}")

if __name__ == '__main__':
    recreate_gallery()

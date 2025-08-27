from django.http import FileResponse, JsonResponse
from django.conf import settings
import os

def test_media(request):
    """Test endpoint to verify media file serving"""
    # Check if media directory exists
    media_dir = settings.MEDIA_ROOT
    if not os.path.exists(media_dir):
        return JsonResponse({
            'status': 'error',
            'message': f'Media directory not found at {media_dir}'
        }, status=500)
    
    # List files in media directory
    try:
        files = []
        for root, _, filenames in os.walk(media_dir):
            for filename in filenames:
                rel_path = os.path.relpath(os.path.join(root, filename), settings.BASE_DIR)
                files.append({
                    'path': rel_path,
                    'url': f"{settings.MEDIA_URL}{rel_path.replace(os.path.sep, '/').replace(settings.MEDIA_ROOT.replace(os.path.sep, '/').lstrip('/'), '')}"
                })
        
        return JsonResponse({
            'status': 'success',
            'media_root': settings.MEDIA_ROOT,
            'media_url': settings.MEDIA_URL,
            'files': files
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

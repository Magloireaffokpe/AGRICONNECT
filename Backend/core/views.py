from django.http import FileResponse, Http404
from django.views import View
from django.conf import settings
import os


class MediaServeView(View):
    """Serve media files with fallback to local storage if Cloudinary is unavailable"""
    
    def get(self, request, path):
        # Construct the full path to the media file
        file_path = os.path.join(settings.MEDIA_ROOT, path)
        
        # Security check: ensure the path is within MEDIA_ROOT
        file_path = os.path.abspath(file_path)
        media_root = os.path.abspath(settings.MEDIA_ROOT)
        
        if not file_path.startswith(media_root):
            raise Http404("File not found")
        
        # Check if file exists
        if not os.path.exists(file_path) or not os.path.isfile(file_path):
            raise Http404("File not found")
        
        try:
            return FileResponse(open(file_path, 'rb'))
        except IOError:
            raise Http404("File not found")

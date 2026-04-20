from django.http import FileResponse, Http404
from django.views import View
from django.conf import settings
import os
import logging

logger = logging.getLogger(__name__)


class MediaServeView(View):
    """
    Serve media files with fallback to local storage if Cloudinary is unavailable.
    
    In production (DEBUG=False):
    - First tries to serve from local storage (fallback for missing images)
    - Log when images are requested (useful for debugging)
    
    In development (DEBUG=True):
    - Serves local files normally
    """
    
    def get(self, request, path):
        # Construct the full path to the media file
        file_path = os.path.join(settings.MEDIA_ROOT, path)
        
        # Security check: ensure the path is within MEDIA_ROOT
        file_path = os.path.abspath(file_path)
        media_root = os.path.abspath(settings.MEDIA_ROOT)
        
        if not file_path.startswith(media_root):
            logger.warning(f"Attempted path traversal: {path}")
            raise Http404("File not found")
        
        # Check if file exists
        if not os.path.exists(file_path) or not os.path.isfile(file_path):
            logger.debug(f"Local media file not found (expected in production): {path}")
            # In production, this is normal - images should be on Cloudinary
            if not settings.DEBUG:
                logger.warning(f"Image should be on Cloudinary but not found locally: {path}")
            raise Http404("File not found")
        
        try:
            response = FileResponse(open(file_path, 'rb'))
            # Set proper content type
            import mimetypes
            content_type, _ = mimetypes.guess_type(file_path)
            if content_type:
                response['Content-Type'] = content_type
            return response
        except IOError as e:
            logger.error(f"Error serving media file {path}: {str(e)}")
            raise Http404("File not found")


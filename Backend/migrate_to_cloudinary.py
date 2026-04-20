"""
Script pour migrer les images existantes vers Cloudinary
À exécuter UNE FOIS en production
"""
import os
import django

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "agriconnect.settings")
django.setup()

from products.models import Product
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

def migrate_images_to_cloudinary():
    """Migrate all local images to Cloudinary"""
    products = Product.objects.filter(image__isnull=False).exclude(image='')
    
    print(f"📦 Trouvé {products.count()} produits avec des images...")
    
    for i, product in enumerate(products, 1):
        try:
            if not product.image:
                continue
            
            # Get current image path
            image_path = str(product.image)
            
            # Check if it's already a Cloudinary URL
            if 'cloudinary' in image_path or image_path.startswith('http'):
                print(f"✅ [{i}/{products.count()}] {product.name} - Déjà sur Cloudinary")
                continue
            
            # Read the local file
            local_file_path = product.image.path
            if not os.path.exists(local_file_path):
                print(f"⚠️  [{i}/{products.count()}] {product.name} - Fichier local introuvable: {local_file_path}")
                continue
            
            # Upload to Cloudinary
            with open(local_file_path, 'rb') as f:
                content = ContentFile(f.read())
                # Force re-upload to Cloudinary
                product.image.save(product.image.name, content, save=True)
            
            print(f"✅ [{i}/{products.count()}] {product.name} - Migrée vers Cloudinary")
            
        except Exception as e:
            print(f"❌ [{i}/{products.count()}] {product.name} - Erreur: {str(e)}")
    
    print(f"\n✨ Migration terminée!")

if __name__ == '__main__':
    migrate_images_to_cloudinary()

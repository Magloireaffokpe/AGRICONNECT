# products/serializers.py

from rest_framework import serializers
from django.conf import settings
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    farmer_name     = serializers.CharField(source="farmer.get_full_name", read_only=True)
    farmer_location = serializers.CharField(source="farmer.location",      read_only=True)
    average_rating  = serializers.SerializerMethodField()
    review_count    = serializers.SerializerMethodField()
    image           = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "description", "category",
            "price", "quantity_available",
            "farmer", "farmer_name", "farmer_location",
            "image", "is_available",
            "average_rating", "review_count",
            "created_at", "updated_at",
        ]
        read_only_fields = [
            "id", "farmer", "farmer_name", "farmer_location",
            "average_rating", "review_count",
            "created_at", "updated_at", "image",
        ]

    def get_image(self, obj):
        """
        Construit l'URL correcte selon le type de stockage.

        Cas possibles dans la DB :
          1. Vide / None                        → None
          2. "products/mais.webp"               → stockage local ou Cloudinary (chemin relatif)
          3. "https://res.cloudinary.com/..."   → déjà une URL absolue Cloudinary ✅
          4. "/media/products/mais.webp"        → stockage local (chemin absolu)

        Problème observé :
          Cloudinary retourne des URLs du type :
            https://res.cloudinary.com/dzmp00qcw/products/mais.webp   ← FAUX (404)
          alors que la bonne URL est :
            https://res.cloudinary.com/dzmp00qcw/image/upload/products/mais.webp  ← CORRECT
        """
        if not obj.image:
            return None

        # Récupérer l'URL brute depuis Django
        try:
            image_url = obj.image.url if hasattr(obj.image, "url") else str(obj.image)
        except Exception:
            # Si .url() plante (ex: Cloudinary non configuré), on prend le nom du fichier
            image_url = str(obj.image)

        if not image_url:
            return None

        # ── Cas 1 : URL Cloudinary déjà correcte avec /image/upload/ ──────────
        if "res.cloudinary.com" in image_url and "/image/upload/" in image_url:
            return image_url

        # ── Cas 2 : URL Cloudinary SANS /image/upload/ (bug connu) ────────────
        # Ex: https://res.cloudinary.com/dzmp00qcw/products/mais.webp
        # → corriger en : https://res.cloudinary.com/dzmp00qcw/image/upload/products/mais.webp
        if "res.cloudinary.com" in image_url and "/image/upload/" not in image_url:
            cloud_name = getattr(settings, "CLOUDINARY_CLOUD_NAME", "")
            if cloud_name and f"/{cloud_name}/" in image_url:
                # Insérer /image/upload/ après le cloud_name
                fixed = image_url.replace(
                    f"res.cloudinary.com/{cloud_name}/",
                    f"res.cloudinary.com/{cloud_name}/image/upload/",
                )
                return fixed
            return image_url

        # ── Cas 3 : chemin relatif stocké en DB (local ou Cloudinary path) ─────
        # Ex: "products/mais.webp" ou "products/igname_yTDQ5Zq.webp"
        if not image_url.startswith("http"):
            # Si Cloudinary est actif en production, construire l'URL Cloudinary
            cloud_name = getattr(settings, "CLOUDINARY_CLOUD_NAME", "")
            if cloud_name and not getattr(settings, "DEBUG", True):
                # Retirer le /media/ initial si présent
                clean_path = image_url.lstrip("/")
                if clean_path.startswith("media/"):
                    clean_path = clean_path[len("media/"):]
                return f"https://res.cloudinary.com/{cloud_name}/image/upload/{clean_path}"

            # Stockage local — construire l'URL absolue
            request = self.context.get("request")
            if request:
                if not image_url.startswith("/media/"):
                    image_url = f"/media/{image_url.lstrip('/')}"
                return request.build_absolute_uri(image_url)
            return image_url

        # ── Cas 4 : URL absolue autre (ex: https://autre-cdn.com/...) ──────────
        return image_url

    def get_average_rating(self, obj):
        """
        Calcul depuis le cache prefetch_related — aucune requête SQL supplémentaire.
        """
        total = 0
        count = 0
        for r in obj.reviews.all():  # itère sur le cache RAM (pas de SQL)
            total += r.rating
            count += 1
        return round(total / count, 1) if count > 0 else None

    def get_review_count(self, obj):
        reviews = obj.reviews.all()
        if hasattr(reviews, "_result_cache") and reviews._result_cache is not None:
            return len(reviews._result_cache)
        return reviews.count()

    def create(self, validated_data):
        validated_data["farmer"] = self.context["request"].user
        qty = validated_data.get("quantity_available", 0)
        validated_data["is_available"] = qty > 0
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "quantity_available" in validated_data:
            validated_data["is_available"] = validated_data["quantity_available"] > 0
        return super().update(instance, validated_data)

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Le prix doit être supérieur à 0.")
        return value

    def validate_quantity_available(self, value):
        if value < 0:
            raise serializers.ValidationError("La quantité ne peut pas être négative.")
        return value
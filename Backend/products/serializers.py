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

    # ─── Image ────────────────────────────────────────────────────
    def get_image(self, obj):
        """
        Retourne l'URL de l'image.
        - Cloudinary : URL absolue directement (commence par https://)
        - Stockage local : URL relative préfixée avec l'URL du serveur
        """
        if not obj.image:
            return None

        image_url = obj.image.url if hasattr(obj.image, "url") else str(obj.image)

        # Cloudinary retourne déjà une URL absolue
        if image_url.startswith("http"):
            return image_url

        # Stockage local : construire l'URL absolue
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(image_url)
        return image_url

    # ─── Ratings ──────────────────────────────────────────────────
    def get_average_rating(self, obj):
        """
        ✅ OPTIMISATION N+1 :
        On utilise les reviews déjà prefetch_related dans la vue (prefetch_related("reviews")).
        all() ne fait PAS de nouvelle requête si les reviews sont déjà en cache Django.
        On évite .exists() et .count() supplémentaires en itérant une seule fois.
        """
        # Accède au cache prefetch — zéro requête SQL supplémentaire
        reviews = obj.reviews.all()

        # _result_cache est rempli si prefetch_related a été utilisé dans la vue
        # len() sur un queryset déjà évalué = O(1), pas de nouvelle requête
        total = 0
        count = 0
        for r in reviews:          # itère sur le cache en mémoire
            total += r.rating
            count += 1

        if count == 0:
            return None
        return round(total / count, 1)

    def get_review_count(self, obj):
        """
        ✅ Même logique : on utilise le cache prefetch, pas de COUNT(*) SQL.
        """
        # Si prefetch_related("reviews") a été fait dans la vue,
        # _result_cache est déjà rempli — len() est O(1) sans requête
        reviews = obj.reviews.all()
        if hasattr(reviews, "_result_cache") and reviews._result_cache is not None:
            return len(reviews._result_cache)
        # Fallback si pas de prefetch (ex: retrieve seul)
        return reviews.count()

    # ─── Create / Update ──────────────────────────────────────────
    def create(self, validated_data):
        validated_data["farmer"] = self.context["request"].user
        qty = validated_data.get("quantity_available", 0)
        validated_data["is_available"] = qty > 0
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "quantity_available" in validated_data:
            validated_data["is_available"] = validated_data["quantity_available"] > 0
        return super().update(instance, validated_data)

    # ─── Validation ───────────────────────────────────────────────
    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Le prix doit être supérieur à 0.")
        return value

    def validate_quantity_available(self, value):
        if value < 0:
            raise serializers.ValidationError("La quantité ne peut pas être négative.")
        return value
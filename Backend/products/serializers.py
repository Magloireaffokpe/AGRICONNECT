from rest_framework import serializers
from .models import Product
from django.conf import settings


class ProductSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source="farmer.get_full_name", read_only=True)
    farmer_location = serializers.CharField(source="farmer.location", read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "category",
            "price",
            "quantity_available",
            "farmer",
            "farmer_name",
            "farmer_location",
            "image",
            "is_available",
            "average_rating",
            "review_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "farmer",
            "farmer_name",
            "farmer_location",
            "average_rating",
            "review_count",
            "created_at",
            "updated_at",
            "image",
        ]

    def get_image(self, obj):
        """Return image URL with fallback to local storage if Cloudinary fails"""
        if not obj.image:
            return None
        
        # If image has a URL method (Cloudinary), use it
        if hasattr(obj.image, 'url'):
            image_url = obj.image.url
        else:
            image_url = str(obj.image)
        
        # If URL is already absolute (from Cloudinary), return as-is
        if image_url.startswith('http'):
            return image_url
        
        # Otherwise, construct absolute URL for local storage
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(image_url)
        
        return image_url

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews.exists():
            return None
        return round(sum(r.rating for r in reviews) / reviews.count(), 1)

    def get_review_count(self, obj):
        return obj.reviews.count()

    def create(self, validated_data):
        validated_data["farmer"] = self.context["request"].user
        # 🔧 Force is_available selon la quantité
        if validated_data.get("quantity_available", 0) > 0:
            validated_data["is_available"] = True
        else:
            validated_data["is_available"] = False
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # 🔧 Si la quantité est modifiée, ajuster is_available
        if "quantity_available" in validated_data:
            validated_data["is_available"] = validated_data["quantity_available"] > 0
        return super().update(instance, validated_data)

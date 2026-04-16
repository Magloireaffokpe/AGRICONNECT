from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    buyer_name = serializers.CharField(source="buyer.get_full_name", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Review
        fields = ["id", "product", "product_name", "buyer", "buyer_name", "rating", "comment", "created_at"]
        read_only_fields = ["id", "buyer", "buyer_name", "product_name", "created_at"]

    def validate(self, attrs):
        buyer = self.context["request"].user
        product = attrs["product"]
        if Review.objects.filter(product=product, buyer=buyer).exists():
            raise serializers.ValidationError("Vous avez déjà laissé un avis pour ce produit.")
        return attrs

    def create(self, validated_data):
        validated_data["buyer"] = self.context["request"].user
        return super().create(validated_data)
from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product
from delivery.serializers import DeliverySerializer
from delivery.models import Delivery


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "quantity", "price", "subtotal"]
        read_only_fields = ["id", "price", "subtotal", "product_name"]

    def validate(self, attrs):
        product = attrs["product"]
        quantity = attrs["quantity"]
        if quantity > product.quantity_available:
            raise serializers.ValidationError(
                {
                    "quantity": f"Stock insuffisant : seulement {product.quantity_available} disponible(s)."
                }
            )
        attrs["price"] = product.price
        return attrs


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    buyer_name = serializers.CharField(source="buyer.get_full_name", read_only=True)
    delivery = serializers.SerializerMethodField()
    # Champ d'écriture pour l'adresse de livraison (optionnel)
    delivery_address = serializers.CharField(
        write_only=True, required=False, allow_blank=True
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "buyer",
            "buyer_name",
            "items",
            "total_price",
            "status",
            "delivery_type",
            "delivery",
            "delivery_address",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "buyer",
            "buyer_name",
            "total_price",
            "status",
            "delivery",
            "created_at",
            "updated_at",
        ]

    def get_delivery(self, obj):
        if hasattr(obj, "delivery"):
            return DeliverySerializer(obj.delivery).data
        return None

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        delivery_address = validated_data.pop("delivery_address", "")
        buyer = self.context["request"].user

        order = Order.objects.create(buyer=buyer, **validated_data)

        for item_data in items_data:
            product = item_data["product"]
            quantity = item_data["quantity"]
            OrderItem.objects.create(order=order, **item_data)
            product.update_stock(quantity)

        order.compute_total()

        # Créer la livraison seulement si le type est HOME_DELIVERY
        if order.delivery_type == Order.DeliveryType.HOME_DELIVERY:
            Delivery.objects.create(order=order, delivery_address=delivery_address)

        return order


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["status"]

from rest_framework import serializers
from .models import Delivery


class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = ["id", "order", "delivery_address", "delivery_status", "delivery_date", "notes", "created_at", "updated_at"]
        read_only_fields = ["id", "order", "created_at", "updated_at"]
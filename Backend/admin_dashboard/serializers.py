from rest_framework import serializers


class AdminStatsSerializer(serializers.Serializer):
    total_orders = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_users = serializers.IntegerField()
    total_farmers = serializers.IntegerField()
    total_buyers = serializers.IntegerField()
    total_products = serializers.IntegerField()
    top_products = serializers.ListField()
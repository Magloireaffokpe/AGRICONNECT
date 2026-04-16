from rest_framework import filters, permissions, viewsets
from django_filters.rest_framework import DjangoFilterBackend
from accounts.permissions import IsAdmin
from .models import Delivery
from .serializers import DeliverySerializer


class DeliveryViewSet(viewsets.ModelViewSet):
    serializer_class = DeliverySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["delivery_status"]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return Delivery.objects.select_related("order__buyer").all()
        if user.role == "BUYER":
            return Delivery.objects.filter(order__buyer=user)
        if user.role == "FARMER":
            return Delivery.objects.filter(order__items__product__farmer=user).distinct()
        return Delivery.objects.none()

    def get_permissions(self):
        if self.action in ["create", "destroy"]:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]
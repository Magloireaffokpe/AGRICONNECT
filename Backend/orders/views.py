from rest_framework import filters, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Order
from .serializers import OrderSerializer, OrderStatusUpdateSerializer
from delivery.models import Delivery  # ← ajoute cet import
from accounts.permissions import IsFarmer, IsBuyer, IsOwnerOrAdmin, IsFarmerOrAdmin


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["status", "delivery_type"]
    ordering_fields = ["created_at", "total_price"]
    ordering = ["-created_at"]

    def get_queryset(self):
        user = self.request.user
        base_qs = Order.objects.select_related("buyer").prefetch_related(
            "items__product", "delivery"
        )
        if user.role == "BUYER":
            return base_qs.filter(buyer=user)
        if user.role == "FARMER":
            return base_qs.filter(items__product__farmer=user).distinct()
        if user.role == "ADMIN":
            return base_qs.all()
        return Order.objects.none()

    def get_permissions(self):
        if self.action == "create":
            return [IsBuyer()]
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        if self.action == "update_status":
            # Correction : utiliser la permission combinée au lieu de l'opérateur |
            return [IsFarmerOrAdmin()]
        return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]

    def get_serializer_class(self):
        if self.action in ["update", "partial_update"]:
            return OrderStatusUpdateSerializer
        return OrderSerializer

    @action(detail=True, methods=["patch"])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get("status")

        # Empêcher l'agriculteur de passer à DELIVERED
        if request.user.role == "FARMER" and new_status == Order.Status.DELIVERED:
            return Response(
                {"error": "Seul l'acheteur peut confirmer la livraison."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = OrderStatusUpdateSerializer(order, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(OrderSerializer(order).data)

    @action(detail=False, methods=["get"], permission_classes=[IsBuyer])
    def my_orders(self, request):
        orders = Order.objects.filter(buyer=request.user).order_by("-created_at")
        page = self.paginate_queryset(orders)
        if page:
            return Response(self.get_serializer(page, many=True).data)
        return Response(self.get_serializer(orders, many=True).data)

    @action(detail=False, methods=["get"], permission_classes=[IsFarmer])
    def farmer_orders(self, request):
        orders = (
            Order.objects.filter(items__product__farmer=request.user)
            .distinct()
            .order_by("-created_at")
        )
        page = self.paginate_queryset(orders)
        if page:
            return Response(self.get_serializer(page, many=True).data)
        return Response(self.get_serializer(orders, many=True).data)

    @action(detail=True, methods=["post"], permission_classes=[IsBuyer])
    def confirm_delivery(self, request, pk=None):
        order = self.get_object()
        if order.status != Order.Status.CONFIRMED:
            return Response(
                {
                    "error": "Seules les commandes confirmées peuvent être marquées comme livrées."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        order.status = Order.Status.DELIVERED
        order.save(update_fields=["status"])
        if hasattr(order, "delivery"):
            order.delivery.delivery_status = Delivery.DeliveryStatus.DELIVERED
            order.delivery.save(update_fields=["delivery_status"])
        return Response({"message": "Livraison confirmée avec succès."})

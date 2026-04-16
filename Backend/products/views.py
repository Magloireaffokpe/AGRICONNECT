from rest_framework import filters, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from accounts.permissions import IsFarmer, IsOwnerOrAdmin
from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("farmer").prefetch_related("reviews").all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category", "is_available", "farmer"]
    search_fields = ["name", "description", "farmer__first_name", "farmer__last_name", "farmer__location"]
    ordering_fields = ["price", "created_at", "quantity_available"]
    ordering = ["-created_at"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        if self.action == "create":
            return [IsFarmer()]
        if self.action in ["update", "partial_update", "destroy"]:
            return [IsFarmer(), IsOwnerOrAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = super().get_queryset()
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        location = self.request.query_params.get("location")
        if location:
            queryset = queryset.filter(farmer__location__icontains=location)
        user = self.request.user
        if user.is_authenticated and user.role == "BUYER":
            queryset = queryset.filter(is_available=True)
        return queryset

    @action(detail=False, methods=["get"], permission_classes=[IsFarmer])
    def my_products(self, request):
        products = Product.objects.filter(farmer=request.user).order_by("-created_at")
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response(self.get_serializer(products, many=True).data)

    @action(detail=True, methods=["patch"], permission_classes=[IsFarmer, IsOwnerOrAdmin])
    def update_stock(self, request, pk=None):
        product = self.get_object()
        quantity = request.data.get("quantity_available")
        if quantity is None or int(quantity) < 0:
            return Response({"error": "La quantité doit être un entier positif ou nul."}, status=status.HTTP_400_BAD_REQUEST)
        product.quantity_available = int(quantity)
        product.is_available = int(quantity) > 0
        product.save(update_fields=["quantity_available", "is_available"])
        return Response(ProductSerializer(product).data)
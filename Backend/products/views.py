# products/views.py
# ✅ select_related + prefetch_related obligatoires pour que le serializer
#    fonctionne sans N+1

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers
from rest_framework import filters, permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from accounts.permissions import IsFarmer, IsOwnerOrAdmin
from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category", "is_available", "farmer"]
    search_fields = [
        "name", "description",
        "farmer__first_name", "farmer__last_name", "farmer__location",
    ]
    ordering_fields = ["price", "created_at", "quantity_available"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """
        ✅ select_related("farmer")   → 1 JOIN pour tous les farmers (était N requêtes)
        ✅ prefetch_related("reviews") → 1 requête pour tous les avis (était N requêtes)

        Pour une liste de 12 produits :
        Avant  → 1 + 12 (farmers) + 12 (avg) + 12 (count) = 37 requêtes
        Après  → 1 (produits) + 1 (farmers JOIN) + 1 (reviews) = 3 requêtes
        """
        queryset = (
            Product.objects
            .select_related("farmer")
            .prefetch_related("reviews")
            .all()
        )

        # Filtre prix
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Filtre localisation
        location = self.request.query_params.get("location")
        if location:
            queryset = queryset.filter(farmer__location__icontains=location)

        # Les acheteurs connectés ne voient que les produits disponibles
        user = self.request.user
        if user.is_authenticated and hasattr(user, "role") and user.role == "BUYER":
            queryset = queryset.filter(is_available=True)

        return queryset

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        if self.action == "create":
            return [IsFarmer()]
        if self.action in ["update", "partial_update", "destroy"]:
            return [IsFarmer(), IsOwnerOrAdmin()]
        return [permissions.IsAuthenticated()]

    # ✅ Cache 2 min sur la liste — varie selon le token (buyer vs farmer vs anon)
    @method_decorator(cache_page(120))
    @method_decorator(vary_on_headers("Authorization"))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    # ✅ Cache 5 min sur le détail
    @method_decorator(cache_page(300))
    @method_decorator(vary_on_headers("Authorization"))
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @action(detail=False, methods=["get"], permission_classes=[IsFarmer])
    def my_products(self, request):
        """Pas de cache — données personnelles du farmer connecté"""
        products = (
            Product.objects
            .filter(farmer=request.user)
            .select_related("farmer")
            .prefetch_related("reviews")
            .order_by("-created_at")
        )
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response(self.get_serializer(products, many=True).data)

    @action(
        detail=True,
        methods=["patch"],
        permission_classes=[IsFarmer, IsOwnerOrAdmin],
    )
    def update_stock(self, request, pk=None):
        product = self.get_object()
        quantity = request.data.get("quantity_available")
        if quantity is None:
            return Response(
                {"error": "La quantité est requise."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            quantity = int(quantity)
        except (ValueError, TypeError):
            return Response(
                {"error": "La quantité doit être un entier."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if quantity < 0:
            return Response(
                {"error": "La quantité doit être positive ou nulle."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        product.quantity_available = quantity
        product.is_available = quantity > 0
        product.save(update_fields=["quantity_available", "is_available"])
        return Response(ProductSerializer(product, context={"request": request}).data)
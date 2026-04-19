from rest_framework import filters, permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from accounts.permissions import IsBuyer, IsOwnerOrAdmin, IsFarmer
from .models import Review
from .serializers import ReviewSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.select_related("buyer", "product").all()
    serializer_class = ReviewSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["product", "rating"]
    ordering_fields = ["created_at", "rating"]
    ordering = ["-created_at"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        if self.action == "create":
            return [IsBuyer()]
        if self.action in ["update", "partial_update", "destroy"]:
            return [IsBuyer(), IsOwnerOrAdmin()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=["get"])
    def my_reviews(self, request):
        reviews = Review.objects.filter(buyer=request.user)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsFarmer])
    def farmer_reviews(self, request):
        """Renvoie tous les avis sur les produits de l'agriculteur connecté."""
        user = request.user
        reviews = Review.objects.filter(product__farmer=user).select_related('product', 'buyer')
        page = self.paginate_queryset(reviews)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
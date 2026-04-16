from rest_framework import filters, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from accounts.permissions import IsBuyer, IsOwnerOrAdmin
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
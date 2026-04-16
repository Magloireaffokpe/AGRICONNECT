from rest_framework.permissions import BasePermission


class IsFarmer(BasePermission):
    message = "Accès réservé aux agriculteurs."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "FARMER"
        )


class IsBuyer(BasePermission):
    message = "Accès réservé aux acheteurs."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "BUYER"
        )


class IsAdmin(BasePermission):
    message = "Accès réservé aux administrateurs."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "ADMIN"
        )


class IsFarmerOrReadOnly(BasePermission):
    message = "La modification est réservée aux agriculteurs."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        return request.user.role == "FARMER"


class IsOwnerOrAdmin(BasePermission):
    message = "Vous n'avez pas la permission de modifier cet objet."

    def has_object_permission(self, request, view, obj):
        if request.user.role == "ADMIN":
            return True
        if hasattr(obj, "farmer"):
            return obj.farmer == request.user
        if hasattr(obj, "buyer"):
            return obj.buyer == request.user
        if hasattr(obj, "user"):
            return obj.user == request.user
        return obj == request.user


class IsBuyerOrFarmer(BasePermission):
    message = "Accès réservé aux agriculteurs et acheteurs."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ("FARMER", "BUYER")
        )


class IsFarmerOrAdmin(BasePermission):
    """Autorise les agriculteurs (FARMER) et les administrateurs (ADMIN)."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in (
            "FARMER",
            "ADMIN",
        )

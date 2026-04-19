
import secrets
from urllib.parse import quote

from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView  # ← AJOUT OBLIGATOIRE
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.utils.crypto import get_random_string
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import PasswordResetToken
from .serializers import (
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    PasswordChangeSerializer,
)

from .models import FarmerProfile, User
from .permissions import IsAdmin, IsOwnerOrAdmin, IsFarmer
from .serializers import (
    FarmerProfileSerializer,
    FarmerVerifySerializer,
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"message": "Compte créé avec succès.", "user": UserSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["role", "is_active"]
    search_fields = ["email", "first_name", "last_name", "phone"]

    # Dans la classe UserViewSet, ajoutez cette méthode

    @action(detail=True, methods=["post"], permission_classes=[IsAdmin])
    def set_password(self, request, pk=None):
        user = self.get_object()
        new_password = request.data.get("password")
        if not new_password:
            return Response(
                {"error": "Le mot de passe est requis."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.set_password(new_password)
        user.save()
        return Response({"message": "Mot de passe modifié avec succès."})

    def get_permissions(self):
        if self.action in ["retrieve", "update", "partial_update"]:
            return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
        return [IsAdmin()]

    @action(detail=True, methods=["post"], permission_classes=[IsAdmin])
    def activate(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save(update_fields=["is_active"])
        return Response(
            {
                "is_active": user.is_active,
                "message": f"Compte {'activé' if user.is_active else 'désactivé'}.",
            }
        )


class FarmerProfileViewSet(viewsets.ModelViewSet):
    queryset = FarmerProfile.objects.select_related("user").all()
    serializer_class = FarmerProfileSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "farm_name",
        "user__first_name",
        "user__last_name",
        "user__location",
    ]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        if self.action in ["verify"]:
            return [IsAdmin()]
        return [IsFarmer(), IsOwnerOrAdmin()]

    @action(detail=True, methods=["patch"], permission_classes=[IsAdmin])
    def verify(self, request, pk=None):
        profile = self.get_object()
        serializer = FarmerVerifySerializer(
            profile, data={"verified": True}, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Agriculteur vérifié avec succès.", "verified": True}
        )


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"message": "Si cet email existe, un lien de réinitialisation a été envoyé."},
                status=status.HTTP_200_OK,
            )

        # Supprimer les anciens tokens
        PasswordResetToken.objects.filter(user=user).delete()

        # Générer un token hexadécimal (pas de caractères spéciaux)
        token = secrets.token_hex(32)
        expires_at = timezone.now() + timedelta(hours=24)
        PasswordResetToken.objects.create(user=user, token=token, expires_at=expires_at)

        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"

        # En développement : afficher le lien dans la console
        print(f"\n=== LIEN DE RÉINITIALISATION ===\n{reset_link}\n")

        # Optionnel : essayer d’envoyer un email simple (sans EmailMessage) en ignorant l’erreur
        # send_mail(
        #     subject="Réinitialisation mot de passe AgriConnect",
        #     message=f"Bonjour {user.first_name},\n\nCliquez sur ce lien : {reset_link}",
        #     from_email="noreply@agriconnect.com",
        #     recipient_list=[email],
        #     fail_silently=True,
        # )

        return Response(
            {"message": "Un email vous a été envoyé (consultez la console Django)."},
            status=status.HTTP_200_OK,
        )
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]

        try:
            reset_token = PasswordResetToken.objects.get(
                token=token, expires_at__gt=timezone.now()
            )
        except PasswordResetToken.DoesNotExist:
            return Response(
                {"error": "Token invalide ou expiré."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = reset_token.user
        user.set_password(new_password)
        user.save()
        reset_token.delete()
        return Response(
            {"message": "Mot de passe réinitialisé avec succès."},
            status=status.HTTP_200_OK,
        )


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()
        return Response(
            {"message": "Mot de passe modifié avec succès."}, status=status.HTTP_200_OK
        )

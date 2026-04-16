from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        FARMER = "FARMER", _("Agriculteur")
        BUYER = "BUYER", _("Acheteur")
        ADMIN = "ADMIN", _("Administrateur")

    email = models.EmailField(_("adresse email"), unique=True)
    first_name = models.CharField(_("prénom"), max_length=150)
    last_name = models.CharField(_("nom"), max_length=150)
    phone = models.CharField(_("téléphone"), max_length=20, blank=True)
    location = models.CharField(_("localisation"), max_length=255, blank=True)
    role = models.CharField(_("rôle"), max_length=10, choices=Role.choices, default=Role.BUYER)
    is_active = models.BooleanField(_("actif"), default=True)
    is_staff = models.BooleanField(_("staff"), default=False)
    date_joined = models.DateTimeField(_("date d'inscription"), default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    class Meta:
        verbose_name = _("utilisateur")
        verbose_name_plural = _("utilisateurs")
        ordering = ["-date_joined"]

    def __str__(self):
        return f"{self.get_full_name()} <{self.email}>"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        return self.first_name

    @property
    def is_farmer(self):
        return self.role == self.Role.FARMER

    @property
    def is_buyer(self):
        return self.role == self.Role.BUYER

    @property
    def is_admin_role(self):
        return self.role == self.Role.ADMIN


class FarmerProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="farmer_profile",
        limit_choices_to={"role": User.Role.FARMER},
    )
    farm_name = models.CharField(_("nom de la ferme"), max_length=255, blank=True)
    verified = models.BooleanField(_("vérifié"), default=False)
    bio = models.TextField(_("biographie"), blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("profil agriculteur")
        verbose_name_plural = _("profils agriculteurs")

    def __str__(self):
        return f"Profil de {self.user.get_full_name()} — {self.farm_name or 'Sans nom'}"
    

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"Token for {self.user.email}"   
from django.db import models
from django.utils.translation import gettext_lazy as _
from accounts.models import User


class Product(models.Model):
    class Category(models.TextChoices):
        FRUITS = "FRUITS", _("Fruits")
        VEGETABLES = "VEGETABLES", _("Légumes")
        CEREALS = "CEREALS", _("Céréales")
        MEAT = "MEAT", _("Viande")
        DAIRY = "DAIRY", _("Produits laitiers")
        OTHER = "OTHER", _("Autre")

    name = models.CharField(_("nom"), max_length=255)
    description = models.TextField(_("description"), blank=True)
    category = models.CharField(_("catégorie"), max_length=20, choices=Category.choices, default=Category.OTHER)
    price = models.DecimalField(_("prix (FCFA)"), max_digits=10, decimal_places=2)
    quantity_available = models.PositiveIntegerField(_("quantité disponible"), default=0)
    farmer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="products",
        limit_choices_to={"role": User.Role.FARMER},
        verbose_name=_("agriculteur"),
    )
    image = models.ImageField(_("image"), upload_to="products/", null=True, blank=True)
    is_available = models.BooleanField(_("disponible"), default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("produit")
        verbose_name_plural = _("produits")
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["category"]), models.Index(fields=["farmer"]), models.Index(fields=["is_available"])]

    def __str__(self):
        return f"{self.name} — {self.farmer.get_full_name()}"

    def update_stock(self, quantity_sold):
        if quantity_sold > self.quantity_available:
            raise ValueError(f"Stock insuffisant : {self.quantity_available} disponible(s), {quantity_sold} demandé(s).")
        self.quantity_available -= quantity_sold
        if self.quantity_available == 0:
            self.is_available = False
        self.save(update_fields=["quantity_available", "is_available"])
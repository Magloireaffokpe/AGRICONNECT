from django.db import models
from django.utils.translation import gettext_lazy as _
from accounts.models import User
from products.models import Product


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", _("En attente")
        CONFIRMED = "CONFIRMED", _("Confirmée")
        DELIVERED = "DELIVERED", _("Livrée")
        CANCELLED = "CANCELLED", _("Annulée")

    class DeliveryType(models.TextChoices):
        HOME_DELIVERY = "HOME_DELIVERY", _("Livraison à domicile")
        PICKUP_POINT = "PICKUP_POINT", _("Point de retrait")

    buyer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="orders",
        limit_choices_to={"role": User.Role.BUYER},
        verbose_name=_("acheteur"),
    )
    total_price = models.DecimalField(_("prix total (FCFA)"), max_digits=12, decimal_places=2, default=0)
    status = models.CharField(_("statut"), max_length=20, choices=Status.choices, default=Status.PENDING)
    delivery_type = models.CharField(_("type de livraison"), max_length=20, choices=DeliveryType.choices, default=DeliveryType.PICKUP_POINT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("commande")
        verbose_name_plural = _("commandes")
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["buyer", "status"])]

    def __str__(self):
        return f"Commande #{self.pk} — {self.buyer.get_full_name()} [{self.status}]"

    def compute_total(self):
        total = sum(item.price * item.quantity for item in self.items.all())
        self.total_price = total
        self.save(update_fields=["total_price"])
        return total


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items", verbose_name=_("commande"))
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="order_items", verbose_name=_("produit"))
    quantity = models.PositiveIntegerField(_("quantité"))
    price = models.DecimalField(_("prix unitaire (FCFA)"), max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = _("article de commande")
        verbose_name_plural = _("articles de commande")

    def __str__(self):
        return f"{self.quantity}x {self.product.name} (commande #{self.order_id})"

    @property
    def subtotal(self):
        return self.price * self.quantity
from django.db import models
from django.utils.translation import gettext_lazy as _
from orders.models import Order


class Delivery(models.Model):
    class DeliveryStatus(models.TextChoices):
        PENDING = "PENDING", _("En attente")
        IN_TRANSIT = "IN_TRANSIT", _("En transit")
        DELIVERED = "DELIVERED", _("Livrée")
        FAILED = "FAILED", _("Échouée")

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="delivery", verbose_name=_("commande"))
    delivery_address = models.TextField(_("adresse de livraison"), blank=True)
    delivery_status = models.CharField(_("statut de livraison"), max_length=20, choices=DeliveryStatus.choices, default=DeliveryStatus.PENDING)
    delivery_date = models.DateField(_("date de livraison prévue"), null=True, blank=True)
    notes = models.TextField(_("notes"), blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("livraison")
        verbose_name_plural = _("livraisons")

    def __str__(self):
        return f"Livraison commande #{self.order_id} [{self.delivery_status}]"
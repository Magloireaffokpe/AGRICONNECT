from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from accounts.models import User
from products.models import Product


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews", verbose_name=_("produit"))
    buyer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reviews",
        limit_choices_to={"role": User.Role.BUYER},
        verbose_name=_("acheteur"),
    )
    rating = models.PositiveSmallIntegerField(_("note"), validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(_("commentaire"), blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("avis")
        verbose_name_plural = _("avis")
        ordering = ["-created_at"]
        unique_together = [("product", "buyer")]
        indexes = [models.Index(fields=["product"])]

    def __str__(self):
        return f"Avis de {self.buyer.get_full_name()} sur {self.product.name} ({self.rating}/5)"
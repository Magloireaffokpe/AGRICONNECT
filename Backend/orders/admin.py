from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Order, OrderItem
from delivery.models import Delivery


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("subtotal",)
    fields = ("product", "quantity", "price", "subtotal")

    def subtotal(self, obj):
        # Évite l'erreur si l'objet n'est pas encore sauvegardé
        if obj.price is not None and obj.quantity is not None:
            return obj.price * obj.quantity
        return 0
    subtotal.short_description = _("Sous-total")


class DeliveryInline(admin.StackedInline):
    model = Delivery
    can_delete = False
    extra = 0
    fields = ("delivery_address", "delivery_status", "delivery_date", "notes")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "buyer", "total_price", "status", "delivery_type", "created_at")
    list_filter = ("status", "delivery_type", "created_at")
    search_fields = ("buyer__email", "buyer__first_name", "buyer__last_name")
    readonly_fields = ("created_at", "updated_at", "total_price")
    ordering = ("-created_at",)
    inlines = [OrderItemInline, DeliveryInline]
    fieldsets = (
        (None, {"fields": ("buyer", "status", "delivery_type")}),
        (_("Montant"), {"fields": ("total_price",)}),
        (_("Dates"), {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )
    actions = ["confirm_orders", "cancel_orders"]

    @admin.action(description=_("Confirmer les commandes sélectionnées"))
    def confirm_orders(self, request, queryset):
        count = queryset.filter(status=Order.Status.PENDING).update(status=Order.Status.CONFIRMED)
        self.message_user(request, f"{count} commande(s) confirmée(s).")

    @admin.action(description=_("Annuler les commandes sélectionnées"))
    def cancel_orders(self, request, queryset):
        count = queryset.exclude(status=Order.Status.DELIVERED).update(status=Order.Status.CANCELLED)
        self.message_user(request, f"{count} commande(s) annulée(s).")
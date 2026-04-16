from django.contrib import admin
from .models import Delivery


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ("order", "delivery_status", "delivery_date", "created_at")
    list_filter = ("delivery_status", "delivery_date")
    search_fields = ("order__buyer__email", "delivery_address")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)
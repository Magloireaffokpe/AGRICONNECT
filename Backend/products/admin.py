from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "quantity_available", "farmer", "is_available", "created_at")
    list_filter = ("category", "is_available", "created_at")
    search_fields = ("name", "description", "farmer__email", "farmer__first_name")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)
    list_editable = ("price", "quantity_available", "is_available")
    fieldsets = (
        (None, {"fields": ("name", "description", "category", "farmer")}),
        (_("Prix & Stock"), {"fields": ("price", "quantity_available", "is_available")}),
        (_("Image"), {"fields": ("image",)}),
        (_("Dates"), {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )
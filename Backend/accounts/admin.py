from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import FarmerProfile, User


class FarmerProfileInline(admin.StackedInline):
    model = FarmerProfile
    can_delete = False
    verbose_name = _("Profil agriculteur")
    fields = ("farm_name", "verified", "bio")
    extra = 0


@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = (
        "email",
        "get_full_name",
        "role",
        "phone",
        "location",
        "is_active",
        "is_staff",
        "date_joined",
    )
    list_filter = ("role", "is_active", "is_staff", "date_joined")
    search_fields = ("email", "first_name", "last_name", "phone", "location")
    ordering = ("-date_joined",)
    readonly_fields = ("date_joined", "last_login")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (_("Informations personnelles"), {"fields": ("first_name", "last_name", "phone", "location", "role")}),
        (_("Permissions"), {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        (_("Dates"), {"fields": ("date_joined", "last_login")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "first_name", "last_name", "role", "password1", "password2")}),
    )
    filter_horizontal = ("groups", "user_permissions")
    inlines = [FarmerProfileInline]

    def get_full_name(self, obj):
        return obj.get_full_name()
    get_full_name.short_description = _("Nom complet")


@admin.register(FarmerProfile)
class FarmerProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "farm_name", "verified", "created_at")
    list_filter = ("verified",)
    search_fields = ("user__email", "user__first_name", "farm_name")
    readonly_fields = ("created_at",)
    actions = ["mark_verified", "mark_unverified"]

    @admin.action(description=_("Valider les agriculteurs sélectionnés"))
    def mark_verified(self, request, queryset):
        count = queryset.update(verified=True)
        self.message_user(request, f"{count} agriculteur(s) validé(s).")

    @admin.action(description=_("Invalider les agriculteurs sélectionnés"))
    def mark_unverified(self, request, queryset):
        count = queryset.update(verified=False)
        self.message_user(request, f"{count} agriculteur(s) invalidé(s).")
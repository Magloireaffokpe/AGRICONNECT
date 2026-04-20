from django.contrib import admin
from django.urls import include, path, re_path
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static
from core.views import MediaServeView

urlpatterns = [
    path("secret-agri-admin/", include("admin_dashboard.urls")),
    path("django-admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/products/", include("products.urls")),
    path("api/orders/", include("orders.urls")),
    path("api/delivery/", include("delivery.urls")),
    path("api/reviews/", include("reviews.urls")),
    # Media files fallback - serve from local storage
    re_path(r'^media/(?P<path>.+)$', MediaServeView.as_view(), name='media-serve'),
    # Vues de réinitialisation de mot de passe
    path(
        "password-reset/",
        auth_views.PasswordResetView.as_view(
            template_name="registration/password_reset_form.html"
        ),
        name="password_reset",
    ),
    path(
        "password-reset/done/",
        auth_views.PasswordResetDoneView.as_view(
            template_name="registration/password_reset_done.html"
        ),
        name="password_reset_done",
    ),
    path(
        "reset/<uidb64>/<token>/",
        auth_views.PasswordResetConfirmView.as_view(
            template_name="registration/password_reset_confirm.html"
        ),
        name="password_reset_confirm",
    ),
    path(
        "reset/done/",
        auth_views.PasswordResetCompleteView.as_view(
            template_name="registration/password_reset_complete.html"
        ),
        name="password_reset_complete",
    ),
]

# ⬇️ En production, servir les images via la vue custom (déjà configurée ci-dessus)
# En développement, utiliser Django's static view
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

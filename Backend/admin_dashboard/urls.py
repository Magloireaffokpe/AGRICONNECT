from django.urls import path
from django.contrib.auth.views import LogoutView
from . import views

app_name = "admin_dashboard"
urlpatterns = [
    path("login/", views.CustomAdminLoginView.as_view(), name="login"),
    path(
        "logout/",
        LogoutView.as_view(next_page="/secret-agri-admin/login/"),
        name="logout",
    ),
    path("stats/", views.stats_dashboard, name="stats"),
    path("api/stats/", views.AdminStatsView.as_view(), name="admin-stats"),
    path("users/", views.user_list, name="user_list"),
    path("users/<int:user_id>/delete/", views.user_delete, name="user_delete"),
    path("change-password/", views.change_password, name="change_password"),
]

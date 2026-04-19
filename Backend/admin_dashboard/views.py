from django.db.models import Sum
from rest_framework.response import Response
from rest_framework.views import APIView
from accounts.permissions import IsAdmin
from accounts.models import User
from products.models import Product
from orders.models import Order, OrderItem
from .serializers import AdminStatsSerializer
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import user_passes_test
from django.contrib import messages
from django.contrib.auth.views import LoginView
from django.contrib.auth import authenticate, login
from django.urls import reverse_lazy
from delivery.models import Delivery


class AdminStatsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, *args, **kwargs):
        total_orders = Order.objects.count()
        total_revenue = (
            Order.objects.filter(status=Order.Status.DELIVERED).aggregate(
                total=Sum("total_price")
            )["total"]
            or 0
        )
        total_users = User.objects.count()
        total_farmers = User.objects.filter(role="FARMER").count()
        total_buyers = User.objects.filter(role="BUYER").count()
        total_products = Product.objects.count()

        top_products = (
            OrderItem.objects.values("product__name")
            .annotate(total_qty=Sum("quantity"))
            .order_by("-total_qty")[:5]
        )
        top_products_list = [
            {"name": p["product__name"], "total_quantity": p["total_qty"]}
            for p in top_products
        ]

        data = {
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "total_users": total_users,
            "total_farmers": total_farmers,
            "total_buyers": total_buyers,
            "total_products": total_products,
            "top_products": top_products_list,
        }
        serializer = AdminStatsSerializer(data)
        return Response(serializer.data)


class CustomAdminLoginView(LoginView):
    template_name = "admin_dashboard/login.html"
    redirect_authenticated_user = True

    def form_valid(self, form):
        email = form.cleaned_data.get("username")
        password = form.cleaned_data.get("password")
        user = authenticate(self.request, username=email, password=password)
        if user is not None and user.is_staff:
            login(self.request, user)
            return redirect(self.get_success_url())
        else:
            form.add_error(
                None, "Email ou mot de passe incorrect, ou compte non autorisé."
            )
            return self.form_invalid(form)

    def get_success_url(self):
        return reverse_lazy("admin_dashboard:user_list")


def is_admin(user):
    return user.is_authenticated and user.role == "ADMIN"


@user_passes_test(is_admin, login_url="/secret-agri-admin/login/")
def user_list(request):
    users = User.objects.all().order_by("-date_joined")
    return render(request, "admin_dashboard/user_list.html", {"users": users})


@user_passes_test(is_admin, login_url="/secret-agri-admin/login/")
def user_delete(request, user_id):
    user = get_object_or_404(User, id=user_id)
    if user == request.user:
        messages.error(request, "Vous ne pouvez pas vous supprimer vous-même.")
    else:
        user.delete()
        messages.success(request, f"Utilisateur {user.email} supprimé.")
    return redirect("admin_dashboard:user_list")


@user_passes_test(is_admin, login_url="/secret-agri-admin/login/")
def change_password(request):
    if request.method == "POST":
        new_password = request.POST.get("new_password")
        confirm_password = request.POST.get("confirm_password")
        if new_password and new_password == confirm_password:
            request.user.set_password(new_password)
            request.user.save()
            messages.success(
                request, "Votre mot de passe a été modifié. Veuillez vous reconnecter."
            )
            return redirect("admin_dashboard:login")
        else:
            messages.error(
                request, "Les mots de passe ne correspondent pas ou sont vides."
            )
    return render(request, "admin_dashboard/change_password.html")


@user_passes_test(is_admin, login_url="/secret-agri-admin/login/")
def stats_dashboard(request):
    total_orders = Order.objects.count()
    total_revenue = (
        Order.objects.filter(status=Order.Status.DELIVERED).aggregate(
            total=Sum("total_price")
        )["total"]
        or 0
    )
    total_users = User.objects.count()
    total_farmers = User.objects.filter(role="FARMER").count()
    total_buyers = User.objects.filter(role="BUYER").count()
    total_products = Product.objects.count()
    top_products = (
        OrderItem.objects.values("product__name")
        .annotate(total_qty=Sum("quantity"))
        .order_by("-total_qty")[:5]
    )
    context = {
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "total_users": total_users,
        "total_farmers": total_farmers,
        "total_buyers": total_buyers,
        "total_products": total_products,
        "top_products": top_products,
    }
    return render(request, "admin_dashboard/stats.html", context)



@user_passes_test(is_admin, login_url="/secret-agri-admin/login/")
def delivery_list(request):
    deliveries = Delivery.objects.select_related('order__buyer').all().order_by('-created_at')
    return render(request, "admin_dashboard/delivery_list.html", {"deliveries": deliveries})

@user_passes_test(is_admin, login_url="/secret-agri-admin/login/")
def toggle_verify(request, user_id):
    user = get_object_or_404(User, id=user_id)
    if user.role == 'FARMER' and hasattr(user, 'farmer_profile'):
        profile = user.farmer_profile
        profile.verified = not profile.verified
        profile.save()
        messages.success(request, f"Agriculteur {user.email} {'vérifié' if profile.verified else 'dévérifié'}.")
    else:
        messages.error(request, "Cet utilisateur n'est pas un agriculteur.")
    return redirect("admin_dashboard:user_list")

@user_passes_test(is_admin, login_url="/secret-agri-admin/login/")
def user_detail(request, user_id):
    user = get_object_or_404(User, id=user_id)
    return render(request, "admin_dashboard/user_detail.html", {"user": user})
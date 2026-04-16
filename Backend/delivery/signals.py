from django.db.models.signals import post_save
from django.dispatch import receiver
from orders.models import Order
from .models import Delivery


@receiver(post_save, sender=Order)
def create_delivery_on_order(sender, instance, created, **kwargs):
    if created and instance.delivery_type == Order.DeliveryType.HOME_DELIVERY:
        Delivery.objects.get_or_create(order=instance)
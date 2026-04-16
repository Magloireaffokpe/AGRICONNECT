from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import FarmerProfile, User


@receiver(post_save, sender=User)
def create_farmer_profile_on_register(sender, instance, created, **kwargs):
    if created and instance.role == User.Role.FARMER:
        FarmerProfile.objects.get_or_create(user=instance)
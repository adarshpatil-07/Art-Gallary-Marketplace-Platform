from django.conf import settings
from django.db import models

from artworks.models import Artwork


class Order(models.Model):
    """
    Stub model for MVP — records buyer intent without real payment processing.
    Stripe Connect will replace/extend this in a future phase.
    """

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"       # buyer clicked Buy, awaiting contact
        CONFIRMED = "confirmed", "Confirmed"  # both parties agreed off-platform
        CANCELLED = "cancelled", "Cancelled"
        COMPLETED = "completed", "Completed"  # artwork delivered

    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="orders",
        limit_choices_to={"role": "buyer"},
    )
    artwork = models.ForeignKey(
        Artwork,
        on_delete=models.PROTECT,  # don't allow artwork deletion while an order exists
        related_name="orders",
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    # Snapshot price at time of order to guard against future price changes
    price_at_order = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Price of the artwork at the time this order was created.",
    )
    notes = models.TextField(
        blank=True,
        default="",
        help_text="Any buyer notes or contact details for arranging payment/collection.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Order"
        verbose_name_plural = "Orders"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.pk} — {self.buyer} → '{self.artwork.title}' [{self.status}]"

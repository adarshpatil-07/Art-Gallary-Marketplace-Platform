from django.conf import settings
from django.db import models


class CommissionRequest(models.Model):
    """
    A buyer's request to an artist for custom work.
    `artist` is nullable — a null artist means it is an open/public request
    that any artist can respond to (future feature; scaffold is here now).
    `reference_images` stores a JSON list of URLs (R2 objects).
    """

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        QUOTED = "quoted", "Quoted"
        ACCEPTED = "accepted", "Accepted"
        DECLINED = "declined", "Declined"

    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="commission_requests_sent",
        limit_choices_to={"role": "buyer"},
    )
    # Nullable → open/broadcast request; non-null → directed at a specific artist
    artist = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="commission_requests_received",
        limit_choices_to={"role": "artist"},
    )
    budget = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Buyer's stated budget in the marketplace's base currency.",
    )
    # Freeform size description, e.g. "A3", "50cm × 70cm", "life-size portrait"
    size = models.CharField(max_length=100, blank=True, default="")
    description = models.TextField(
        help_text="Full description of what the buyer wants created.",
    )
    # JSON list of R2 image URLs the buyer uploads as style references
    reference_images = models.JSONField(
        default=list,
        blank=True,
        help_text="List of reference image URLs (Cloudflare R2 objects).",
    )
    deadline = models.DateField(
        null=True,
        blank=True,
        help_text="Buyer's requested completion date.",
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Commission Request"
        verbose_name_plural = "Commission Requests"
        ordering = ["-created_at"]

    def __str__(self):
        target = self.artist.username if self.artist else "open request"
        return f"Commission by {self.buyer.username} → {target} ({self.status})"


class CommissionStatusLog(models.Model):
    """
    Immutable audit trail of every status change on a CommissionRequest.
    Written whenever the status field on CommissionRequest changes.
    """

    request = models.ForeignKey(
        CommissionRequest,
        on_delete=models.CASCADE,
        related_name="status_logs",
    )
    old_status = models.CharField(max_length=20, blank=True, default="")
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="commission_status_changes",
        help_text="The user who triggered this status change (artist, buyer, or admin).",
    )
    note = models.TextField(
        blank=True,
        default="",
        help_text="Optional free-text note attached to this status change (e.g. quote amount).",
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Commission Status Log"
        verbose_name_plural = "Commission Status Logs"
        ordering = ["timestamp"]

    def __str__(self):
        return (
            f"[{self.timestamp:%Y-%m-%d %H:%M}] "
            f"Request #{self.request_id}: {self.old_status} → {self.new_status}"
        )

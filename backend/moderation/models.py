from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models


class Report(models.Model):
    """
    A user-submitted report on any content object (Artwork, CommissionRequest, etc.).
    Uses Django's GenericForeignKey so a single Report model covers all reportable types
    without hard-coded FKs to every content app.

    `content_type` + `object_id` → any model instance.
    """

    class Status(models.TextChoices):
        OPEN = "open", "Open"
        REVIEWED = "reviewed", "Reviewed"
        ACTIONED = "actioned", "Actioned"

    class Reason(models.TextChoices):
        AI_GENERATED = "ai_generated", "AI-generated artwork"
        SPAM = "spam", "Spam"
        OFFENSIVE = "offensive", "Offensive content"
        COUNTERFEIT = "counterfeit", "Counterfeit / plagiarism"
        OTHER = "other", "Other"

    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="reports_filed",
    )

    # Generic relation — points at any model instance
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
    )
    object_id = models.PositiveBigIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    reason = models.CharField(
        max_length=50,
        choices=Reason.choices,
        default=Reason.OTHER,
    )
    detail = models.TextField(
        blank=True,
        default="",
        help_text="Additional context the reporter wants to provide.",
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN,
    )

    # Optional: track which admin reviewed/actioned the report
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reports_reviewed",
    )
    admin_note = models.TextField(
        blank=True,
        default="",
        help_text="Internal admin note on the outcome of this report.",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Report"
        verbose_name_plural = "Reports"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]

    def __str__(self):
        return (
            f"Report #{self.pk} by {self.reporter} "
            f"on {self.content_type.model} #{self.object_id} [{self.status}]"
        )

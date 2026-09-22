from django.conf import settings
from django.db import models


class Artwork(models.Model):
    """
    A physical, non-AI artwork listed for sale by an artist.
    `extra_attributes` is a JSONField for category-specific metadata
    (e.g. frame size for paintings, edition number for prints).
    """

    class Status(models.TextChoices):
        AVAILABLE = "available", "Available"
        SOLD = "sold", "Sold"

    class Category(models.TextChoices):
        PAINTING = "painting", "Painting"
        DRAWING = "drawing", "Drawing"
        SCULPTURE = "sculpture", "Sculpture"
        PHOTOGRAPHY = "photography", "Photography"
        PRINTMAKING = "printmaking", "Printmaking"
        DIGITAL = "digital", "Digital"
        TEXTILE = "textile", "Textile"
        OTHER = "other", "Other"

    artist = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="artworks",
        limit_choices_to={"role": "artist"},
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    medium = models.CharField(
        max_length=255,
        help_text="E.g. 'Oil on canvas', 'Watercolour', 'Charcoal'",
    )
    category = models.CharField(
        max_length=50,
        choices=Category.choices,
        default=Category.OTHER,
    )
    # Freeform string so artists can type "30cm × 40cm" or "12\" × 16\""
    dimensions = models.CharField(max_length=100, blank=True, default="")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    # Artist's description of their process — the primary trust/authenticity mechanism.
    process_note = models.TextField(
        blank=True,
        default="",
        help_text="Artist's description of how the piece was made (authenticity mechanism).",
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.AVAILABLE,
    )
    # Flexible JSONB store for category-specific fields (frame type, edition #, etc.)
    extra_attributes = models.JSONField(
        default=dict,
        blank=True,
        help_text="Category-specific extra metadata as key/value pairs.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Artwork"
        verbose_name_plural = "Artworks"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} by {self.artist.username}"


class ArtworkImage(models.Model):
    """
    One or more images attached to an artwork.
    `image_url` points to an object stored in Cloudflare R2.
    Only one image per artwork should have `is_primary=True`.
    """

    artwork = models.ForeignKey(
        Artwork,
        on_delete=models.CASCADE,
        related_name="images",
    )
    # URL to the file on Cloudflare R2 (or any CDN/storage backend)
    image_url = models.URLField(max_length=1024)
    is_primary = models.BooleanField(
        default=False,
        help_text="Mark as True for the main display image of the artwork.",
    )
    upload_order = models.PositiveSmallIntegerField(
        default=0,
        help_text="Controls display order when multiple images exist.",
    )

    class Meta:
        verbose_name = "Artwork Image"
        verbose_name_plural = "Artwork Images"
        ordering = ["-is_primary", "upload_order"]

    def __str__(self):
        flag = " (primary)" if self.is_primary else ""
        return f"Image for '{self.artwork.title}'{flag}"

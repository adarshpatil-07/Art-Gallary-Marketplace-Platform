from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    Adds role and verification status fields.
    """

    class Role(models.TextChoices):
        ARTIST = "artist", "Artist"
        BUYER = "buyer", "Buyer"

    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.BUYER,
    )
    verified = models.BooleanField(
        default=False,
        help_text="Whether the user (artist) has been verified by an admin.",
    )

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class ArtistProfile(models.Model):
    """
    Extended profile for users with the artist role.
    One-to-one with User; created when a user registers as an artist.
    """

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="artist_profile",
    )
    bio = models.TextField(blank=True, default="")
    # Stored as a JSON list of {"label": str, "url": str} dicts.
    # Intentionally flexible so artists can add Behance, Instagram, personal site, etc.
    portfolio_links = models.JSONField(
        default=list,
        blank=True,
        help_text='JSON list of portfolio links, e.g. [{"label": "Instagram", "url": "https://..."}]',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Artist Profile"
        verbose_name_plural = "Artist Profiles"

    def __str__(self):
        return f"Profile of {self.user.username}"

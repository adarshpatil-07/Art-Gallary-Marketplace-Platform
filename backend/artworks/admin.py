from django.contrib import admin

from .models import Artwork, ArtworkImage


class ArtworkImageInline(admin.TabularInline):
    """Show all images for an artwork inline on the artwork admin page."""

    model = ArtworkImage
    extra = 1
    fields = ("image_url", "is_primary", "upload_order")


@admin.register(Artwork)
class ArtworkAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "artist",
        "category",
        "medium",
        "price",
        "status",
        "created_at",
    )
    list_filter = ("status", "category")
    search_fields = ("title", "description", "medium", "artist__username")
    raw_id_fields = ("artist",)
    readonly_fields = ("created_at", "updated_at")
    inlines = [ArtworkImageInline]
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "artist",
                    "title",
                    "description",
                    "medium",
                    "category",
                    "dimensions",
                    "price",
                    "status",
                )
            },
        ),
        (
            "Authenticity",
            {"fields": ("process_note",)},
        ),
        (
            "Extra Attributes",
            {
                "fields": ("extra_attributes",),
                "classes": ("collapse",),
                "description": "Category-specific key/value metadata (JSON).",
            },
        ),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )


@admin.register(ArtworkImage)
class ArtworkImageAdmin(admin.ModelAdmin):
    list_display = ("artwork", "image_url", "is_primary", "upload_order")
    list_filter = ("is_primary",)
    search_fields = ("artwork__title", "image_url")
    raw_id_fields = ("artwork",)

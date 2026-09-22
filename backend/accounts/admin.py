from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import ArtistProfile, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Extends the built-in UserAdmin to expose the custom `role` and `verified` fields.
    """

    # Show role and verified on the list page
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "role",
        "verified",
        "is_staff",
        "date_joined",
    )
    list_filter = ("role", "verified", "is_staff", "is_active")
    search_fields = ("username", "email", "first_name", "last_name")

    # Inject our custom fields into the existing fieldset groups
    fieldsets = BaseUserAdmin.fieldsets + (
        (
            "Art Marketplace",
            {"fields": ("role", "verified")},
        ),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        (
            "Art Marketplace",
            {"fields": ("role", "verified")},
        ),
    )


@admin.register(ArtistProfile)
class ArtistProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "created_at", "updated_at")
    search_fields = ("user__username", "user__email", "bio")
    raw_id_fields = ("user",)
    readonly_fields = ("created_at", "updated_at")

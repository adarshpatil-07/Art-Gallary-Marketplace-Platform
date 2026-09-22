from django.contrib import admin

from .models import CommissionRequest, CommissionStatusLog


class CommissionStatusLogInline(admin.TabularInline):
    """Read-only audit log shown inline on the commission request detail page."""

    model = CommissionStatusLog
    extra = 0
    readonly_fields = ("old_status", "new_status", "changed_by", "note", "timestamp")
    can_delete = False

    def has_add_permission(self, request, obj=None):
        # Log entries should be created programmatically, not via admin
        return False


@admin.register(CommissionRequest)
class CommissionRequestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "buyer",
        "artist",
        "status",
        "budget",
        "deadline",
        "created_at",
    )
    list_filter = ("status",)
    search_fields = (
        "buyer__username",
        "buyer__email",
        "artist__username",
        "description",
    )
    raw_id_fields = ("buyer", "artist")
    readonly_fields = ("created_at", "updated_at")
    inlines = [CommissionStatusLogInline]
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "buyer",
                    "artist",
                    "status",
                    "budget",
                    "size",
                    "deadline",
                )
            },
        ),
        (
            "Request Details",
            {"fields": ("description", "reference_images")},
        ),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )


@admin.register(CommissionStatusLog)
class CommissionStatusLogAdmin(admin.ModelAdmin):
    list_display = ("request", "old_status", "new_status", "changed_by", "timestamp")
    list_filter = ("new_status",)
    search_fields = (
        "request__buyer__username",
        "request__artist__username",
        "note",
    )
    raw_id_fields = ("request", "changed_by")
    readonly_fields = ("timestamp",)

    def has_change_permission(self, request, obj=None):
        # Audit log entries are immutable
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

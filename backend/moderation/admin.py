from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline

from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "reporter",
        "content_type",
        "object_id",
        "reason",
        "status",
        "reviewed_by",
        "created_at",
    )
    list_filter = ("status", "reason", "content_type")
    search_fields = (
        "reporter__username",
        "reporter__email",
        "detail",
        "admin_note",
    )
    raw_id_fields = ("reporter", "reviewed_by")
    readonly_fields = ("created_at", "updated_at", "content_type", "object_id")
    fieldsets = (
        (
            "Report",
            {
                "fields": (
                    "reporter",
                    "content_type",
                    "object_id",
                    "reason",
                    "detail",
                )
            },
        ),
        (
            "Moderation",
            {"fields": ("status", "reviewed_by", "admin_note")},
        ),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

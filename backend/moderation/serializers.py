from rest_framework import serializers

from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    """
    Used for both creating reports (POST) and admin list/detail views.
    - `reporter` is injected from request.user on create; read-only thereafter.
    - `content_type_label` exposes a human-readable "app.model" string.
    - Admin-only fields (status, reviewed_by, admin_note) are writable by staff only;
      validation is enforced in the view layer.
    """

    reporter_username = serializers.CharField(source="reporter.username", read_only=True)
    content_type_label = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            "id",
            "reporter", "reporter_username",
            "content_type", "content_type_label", "object_id",
            "reason", "detail",
            "status", "reviewed_by", "admin_note",
            "created_at", "updated_at",
        ]
        read_only_fields = [
            "id", "reporter", "reporter_username",
            "content_type_label", "status", "reviewed_by", "admin_note",
            "created_at", "updated_at",
        ]

    def get_content_type_label(self, obj):
        return f"{obj.content_type.app_label}.{obj.content_type.model}"

    def create(self, validated_data):
        validated_data["reporter"] = self.context["request"].user
        return super().create(validated_data)


class ReportAdminSerializer(ReportSerializer):
    """
    Extends ReportSerializer to make moderation fields writable for staff users.
    Used on PATCH requests from the admin UI / staff API consumers.
    """

    class Meta(ReportSerializer.Meta):
        read_only_fields = [
            "id", "reporter", "reporter_username",
            "content_type_label", "created_at",
        ]

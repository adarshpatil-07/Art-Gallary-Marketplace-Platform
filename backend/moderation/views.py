from rest_framework import generics, permissions

from .models import Report
from .serializers import ReportAdminSerializer, ReportSerializer


class ReportCreateView(generics.CreateAPIView):
    """
    POST /api/moderation/reports/
    Any authenticated user can file a report against any object.
    """

    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]


class ReportListView(generics.ListAPIView):
    """
    GET /api/moderation/reports/
    Staff-only — returns all reports for the moderation queue.
    Supports filtering by status and content_type via query params.
    """

    serializer_class = ReportAdminSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        qs = Report.objects.select_related(
            "reporter", "reviewed_by", "content_type"
        )
        status_param = self.request.query_params.get("status")
        content_type = self.request.query_params.get("content_type")  # e.g. "artworks.artwork"
        if status_param:
            qs = qs.filter(status=status_param)
        if content_type and "." in content_type:
            app_label, model = content_type.split(".", 1)
            qs = qs.filter(content_type__app_label=app_label, content_type__model=model)
        return qs


class ReportDetailView(generics.RetrieveUpdateAPIView):
    """
    GET   /api/moderation/reports/<id>/   — staff only
    PATCH /api/moderation/reports/<id>/   — staff only; update status / admin_note
    """

    serializer_class = ReportAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Report.objects.select_related("reporter", "reviewed_by", "content_type")
    http_method_names = ["get", "patch", "head", "options"]

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)

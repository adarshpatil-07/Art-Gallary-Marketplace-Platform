from django.urls import path

from .views import ReportCreateView, ReportDetailView, ReportListView

app_name = "moderation"

urlpatterns = [
    # POST is public (any authenticated user); GET is staff-only.
    # Two separate views are used so DRF permission classes are clean per HTTP method.
    path("reports/", ReportCreateView.as_view(), name="report-create"),
    path("reports/queue/", ReportListView.as_view(), name="report-queue"),
    path("reports/<int:pk>/", ReportDetailView.as_view(), name="report-detail"),
]

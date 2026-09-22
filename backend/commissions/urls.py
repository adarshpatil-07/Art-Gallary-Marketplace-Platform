from django.urls import path

from .views import (
    CommissionRequestDetailView,
    CommissionRequestListCreateView,
    CommissionStatusUpdateView,
)

app_name = "commissions"

urlpatterns = [
    path("", CommissionRequestListCreateView.as_view(), name="commission-list"),
    path("<int:pk>/", CommissionRequestDetailView.as_view(), name="commission-detail"),
    path("<int:pk>/status/", CommissionStatusUpdateView.as_view(), name="commission-status"),
]

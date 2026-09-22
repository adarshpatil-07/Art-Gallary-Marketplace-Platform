"""
URL configuration for core project.
"""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),

    # API root — all app routers live under /api/
    path("api/accounts/", include("accounts.urls", namespace="accounts")),
    path("api/artworks/", include("artworks.urls", namespace="artworks")),
    path("api/commissions/", include("commissions.urls", namespace="commissions")),
    path("api/moderation/", include("moderation.urls", namespace="moderation")),
    path("api/orders/", include("orders.urls", namespace="orders")),
]

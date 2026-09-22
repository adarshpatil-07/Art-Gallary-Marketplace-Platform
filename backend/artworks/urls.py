from django.urls import path

from .views import (
    ArtworkDetailView,
    ArtworkImageDetailView,
    ArtworkImageListCreateView,
    ArtworkListCreateView,
)

app_name = "artworks"

urlpatterns = [
    path("", ArtworkListCreateView.as_view(), name="artwork-list"),
    path("<int:pk>/", ArtworkDetailView.as_view(), name="artwork-detail"),
    path("<int:artwork_id>/images/", ArtworkImageListCreateView.as_view(), name="artwork-image-list"),
    path("<int:artwork_id>/images/<int:pk>/", ArtworkImageDetailView.as_view(), name="artwork-image-detail"),
]

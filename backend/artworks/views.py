from accounts.permissions import IsArtist, IsOwnerOrReadOnly
from rest_framework import filters, generics, permissions
from rest_framework.exceptions import PermissionDenied

from .models import Artwork, ArtworkImage
from .serializers import ArtworkDetailSerializer, ArtworkImageSerializer, ArtworkListSerializer


class ArtworkListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/artworks/          — public gallery; supports filtering & search
    POST /api/artworks/          — authenticated artists only
    """

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description", "medium", "artist__username"]
    ordering_fields = ["price", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        qs = (
            Artwork.objects.select_related("artist", "artist__artist_profile")
            .prefetch_related("images")
        )
        # Optional query-param filters (all are public)
        category = self.request.query_params.get("category")
        medium = self.request.query_params.get("medium")
        status_param = self.request.query_params.get("status", "available")
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")

        if category:
            qs = qs.filter(category=category)
        if medium:
            qs = qs.filter(medium__icontains=medium)
        if status_param:
            qs = qs.filter(status=status_param)
        if min_price:
            qs = qs.filter(price__gte=min_price)
        if max_price:
            qs = qs.filter(price__lte=max_price)
        return qs

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ArtworkDetailSerializer
        return ArtworkListSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated(), IsArtist()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        # Force artist to the logged-in user (also validated in serializer)
        serializer.save(artist=self.request.user)


class ArtworkDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/artworks/<id>/   — public
    PATCH  /api/artworks/<id>/   — owner artist or staff only
    DELETE /api/artworks/<id>/   — owner artist or staff only
    """

    serializer_class = ArtworkDetailSerializer
    queryset = (
        Artwork.objects.select_related("artist", "artist__artist_profile")
        .prefetch_related("images")
    )
    http_method_names = ["get", "patch", "delete", "head", "options"]

    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)


class ArtworkImageListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/artworks/<artwork_id>/images/   — list images for an artwork (public)
    POST /api/artworks/<artwork_id>/images/   — add an image (owner artist only)
    """

    serializer_class = ArtworkImageSerializer

    def get_queryset(self):
        return ArtworkImage.objects.filter(artwork_id=self.kwargs["artwork_id"])

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated(), IsArtist()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        artwork = generics.get_object_or_404(Artwork, pk=self.kwargs["artwork_id"])
        if artwork.artist != self.request.user and not self.request.user.is_staff:
            raise PermissionDenied("You can only add images to your own artworks.")
        serializer.save(artwork=artwork)


class ArtworkImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/artworks/<artwork_id>/images/<id>/
    PATCH  /api/artworks/<artwork_id>/images/<id>/  — owner only
    DELETE /api/artworks/<artwork_id>/images/<id>/  — owner only
    """

    serializer_class = ArtworkImageSerializer
    http_method_names = ["get", "patch", "delete", "head", "options"]

    def get_queryset(self):
        return ArtworkImage.objects.filter(artwork_id=self.kwargs["artwork_id"])

    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)

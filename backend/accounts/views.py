from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ArtistProfile
from .serializers import (
    ArtistProfileUpdateSerializer,
    RegisterSerializer,
    UserMeSerializer,
    UserPublicSerializer,
)
from .permissions import IsArtist

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    POST /api/accounts/register/
    Public — creates a new user (artist or buyer).
    """

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/accounts/me/   — return the authenticated user's own data
    PATCH /api/accounts/me/  — update first_name, last_name, email
    """

    serializer_class = UserMeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    # Disable full PUT so PATCH (partial update) is the only write method
    http_method_names = ["get", "patch", "head", "options"]

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)


class ArtistProfileView(generics.RetrieveUpdateAPIView):
    """
    GET   /api/accounts/profile/   — return the logged-in artist's profile
    PATCH /api/accounts/profile/   — update bio / portfolio_links
    """

    serializer_class = ArtistProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsArtist]
    http_method_names = ["get", "patch", "head", "options"]

    def get_object(self):
        profile, _ = ArtistProfile.objects.get_or_create(user=self.request.user)
        return profile

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)


class PublicArtistDetailView(generics.RetrieveAPIView):
    """
    GET /api/accounts/artists/<id>/
    Public — returns a single artist's public profile (used on artist pages).
    """

    serializer_class = UserPublicSerializer
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.filter(role="artist").select_related("artist_profile")

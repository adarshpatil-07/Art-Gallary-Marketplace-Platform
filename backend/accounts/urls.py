from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import ArtistProfileView, MeView, PublicArtistDetailView, RegisterView

app_name = "accounts"

urlpatterns = [
    # Auth
    path("register/", RegisterView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # Own user
    path("me/", MeView.as_view(), name="me"),
    path("profile/", ArtistProfileView.as_view(), name="artist-profile"),
    # Public artist lookup
    path("artists/<int:pk>/", PublicArtistDetailView.as_view(), name="artist-detail"),
]

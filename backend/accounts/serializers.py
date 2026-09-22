from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import ArtistProfile

User = get_user_model()


# ---------------------------------------------------------------------------
# Nested / read-only helpers
# ---------------------------------------------------------------------------

class ArtistProfileSerializer(serializers.ModelSerializer):
    """Full profile details — embedded inside artist representations."""

    class Meta:
        model = ArtistProfile
        fields = ["bio", "portfolio_links", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]


class UserPublicSerializer(serializers.ModelSerializer):
    """
    Minimal public representation of a user — safe to embed in Artwork /
    CommissionRequest responses without leaking sensitive fields.
    """

    artist_profile = ArtistProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "role", "verified", "artist_profile"]


# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------

class RegisterSerializer(serializers.ModelSerializer):
    """
    Create a new User account.  Password is write-only; artist_profile is
    auto-created when role == 'artist'.
    """

    password = serializers.CharField(write_only=True, min_length=8, style={"input_type": "password"})
    password2 = serializers.CharField(write_only=True, label="Confirm password", style={"input_type": "password"})

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "role", "password", "password2"]
        read_only_fields = ["id"]

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password2"):
            raise serializers.ValidationError({"password2": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        # Auto-create ArtistProfile when registering as an artist
        if user.role == User.Role.ARTIST:
            ArtistProfile.objects.create(user=user)
        return user


# ---------------------------------------------------------------------------
# Authenticated user — own profile
# ---------------------------------------------------------------------------

class UserMeSerializer(serializers.ModelSerializer):
    """
    Serializer for /api/accounts/me/ — returns everything the logged-in user
    is allowed to see/edit about themselves.
    """

    artist_profile = ArtistProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "first_name", "last_name",
            "role", "verified", "artist_profile", "date_joined",
        ]
        read_only_fields = ["id", "role", "verified", "date_joined"]


class ArtistProfileUpdateSerializer(serializers.ModelSerializer):
    """Allows an artist to update their own profile bio and links."""

    class Meta:
        model = ArtistProfile
        fields = ["bio", "portfolio_links"]

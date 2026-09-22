from accounts.serializers import UserPublicSerializer
from rest_framework import serializers

from .models import Artwork, ArtworkImage


class ArtworkImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtworkImage
        fields = ["id", "image_url", "is_primary", "upload_order"]


class ArtworkListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for gallery/browse list views.
    Embeds the primary image URL and a minimal artist snapshot so the
    frontend can render a grid card without extra requests.
    """

    artist = UserPublicSerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Artwork
        fields = [
            "id", "title", "artist", "category", "medium",
            "price", "status", "primary_image", "created_at",
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        return img.image_url if img else None


class ArtworkDetailSerializer(serializers.ModelSerializer):
    """
    Full artwork detail — includes all fields, nested artist info, and all images.
    Used on the artwork detail page.

    `artist_id` is a write-only FK accepted on POST/PATCH.
    The queryset is set in __init__ (deferred) to avoid circular import issues
    and because DRF requires a non-None queryset at field-definition time —
    so we pass an empty QS and replace it before any validation runs.
    """

    artist = UserPublicSerializer(read_only=True)
    # Dummy empty queryset at class level; replaced in __init__
    artist_id = serializers.PrimaryKeyRelatedField(
        source="artist",
        write_only=True,
        queryset=Artwork.objects.none(),  # replaced in __init__
    )
    images = ArtworkImageSerializer(many=True, read_only=True)

    class Meta:
        model = Artwork
        fields = [
            "id", "artist", "artist_id", "title", "description",
            "medium", "category", "dimensions", "price",
            "process_note", "status", "extra_attributes",
            "images", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from django.contrib.auth import get_user_model
        User = get_user_model()
        self.fields["artist_id"].queryset = User.objects.filter(role="artist")

    def validate_artist_id(self, user):
        request = self.context.get("request")
        # Non-admin artists may only create artworks attributed to themselves
        if request and not request.user.is_staff and user != request.user:
            raise serializers.ValidationError("You may only create artworks for yourself.")
        return user

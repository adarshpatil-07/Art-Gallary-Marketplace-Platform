from accounts.serializers import UserPublicSerializer
from artworks.serializers import ArtworkListSerializer
from rest_framework import serializers

from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    """
    Stub order serializer for MVP.
    - `buyer` and `artwork` are expanded for reads.
    - `artwork_id` is the write-side FK.
    - `price_at_order` is auto-populated from the artwork's current price on create.

    `artwork_id` uses Order.objects.none() as a placeholder queryset at class level;
    replaced in __init__ with Artwork.objects.filter(status="available").
    """

    buyer = UserPublicSerializer(read_only=True)
    artwork = ArtworkListSerializer(read_only=True)
    artwork_id = serializers.PrimaryKeyRelatedField(
        source="artwork",
        write_only=True,
        queryset=Order.objects.none(),  # replaced in __init__
    )

    class Meta:
        model = Order
        fields = [
            "id", "buyer", "artwork", "artwork_id",
            "status", "price_at_order", "notes",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "buyer", "status", "price_at_order", "created_at", "updated_at"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from artworks.models import Artwork
        self.fields["artwork_id"].queryset = Artwork.objects.filter(status="available")

    def create(self, validated_data):
        artwork = validated_data["artwork"]
        validated_data["buyer"] = self.context["request"].user
        # Snapshot price at time of order
        validated_data["price_at_order"] = artwork.price
        return super().create(validated_data)

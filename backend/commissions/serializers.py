from accounts.serializers import UserPublicSerializer
from rest_framework import serializers

from .models import CommissionRequest, CommissionStatusLog


class CommissionStatusLogSerializer(serializers.ModelSerializer):
    changed_by = UserPublicSerializer(read_only=True)

    class Meta:
        model = CommissionStatusLog
        fields = ["id", "old_status", "new_status", "changed_by", "note", "timestamp"]
        read_only_fields = ["id", "old_status", "new_status", "changed_by", "note", "timestamp"]


class CommissionRequestSerializer(serializers.ModelSerializer):
    """
    Used for both list and detail views.
    - `buyer` and `artist` are expanded for reads.
    - `artist_id` is the write-side FK for directing a request at a specific artist.
    - `status_logs` are embedded on detail reads.

    `artist_id` uses CommissionRequest.objects.none() as a placeholder queryset
    (required by DRF at class-definition time); replaced in __init__.
    """

    buyer = UserPublicSerializer(read_only=True)
    artist = UserPublicSerializer(read_only=True)
    artist_id = serializers.PrimaryKeyRelatedField(
        source="artist",
        allow_null=True,
        required=False,
        queryset=CommissionRequest.objects.none(),  # replaced in __init__
        write_only=True,
    )
    status_logs = CommissionStatusLogSerializer(many=True, read_only=True)

    class Meta:
        model = CommissionRequest
        fields = [
            "id", "buyer", "artist", "artist_id",
            "budget", "size", "description", "reference_images",
            "deadline", "status", "status_logs",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "buyer", "status", "status_logs", "created_at", "updated_at"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from django.contrib.auth import get_user_model
        User = get_user_model()
        self.fields["artist_id"].queryset = User.objects.filter(role="artist")

    def create(self, validated_data):
        # Automatically set buyer to the authenticated user
        validated_data["buyer"] = self.context["request"].user
        return super().create(validated_data)


class CommissionStatusUpdateSerializer(serializers.Serializer):
    """
    Thin serializer for the dedicated status-transition endpoint.
    Validates the new status and an optional note (e.g. a quote message).
    """

    new_status = serializers.ChoiceField(choices=CommissionRequest.Status.choices)
    note = serializers.CharField(required=False, allow_blank=True, default="")

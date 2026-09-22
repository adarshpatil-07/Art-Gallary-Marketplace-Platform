from accounts.permissions import IsArtist, IsBuyer
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CommissionRequest, CommissionStatusLog
from .serializers import (
    CommissionRequestSerializer,
    CommissionStatusUpdateSerializer,
)


class CommissionRequestListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/commissions/   — list commissions relevant to the logged-in user:
                               buyers see their own sent requests;
                               artists see requests directed at them.
    POST /api/commissions/   — buyers only; creates a new request.
    """

    serializer_class = CommissionRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = (
            CommissionRequest.objects.select_related(
                "buyer", "buyer__artist_profile",
                "artist", "artist__artist_profile",
            )
            .prefetch_related("status_logs", "status_logs__changed_by")
        )
        if user.role == "artist":
            return qs.filter(artist=user)
        # buyer sees only their own requests
        return qs.filter(buyer=user)

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated(), IsBuyer()]
        return [permissions.IsAuthenticated()]


class CommissionRequestDetailView(generics.RetrieveAPIView):
    """
    GET /api/commissions/<id>/
    Authenticated — buyer who owns it, or artist it's directed at, or staff.
    """

    serializer_class = CommissionRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return CommissionRequest.objects.all()
        return CommissionRequest.objects.filter(buyer=user) | CommissionRequest.objects.filter(artist=user)


class CommissionStatusUpdateView(APIView):
    """
    PATCH /api/commissions/<id>/status/
    Artists and buyers can transition the status according to allowed rules:
      - Artist: pending → quoted | declined, quoted → accepted (if buyer accepts) — wait,
        the artist quotes; the buyer accepts/declines.
    Simplified for MVP: any party can move to any valid status; add stricter
    state-machine logic in a future iteration.
    """

    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            commission = CommissionRequest.objects.get(pk=pk)
        except CommissionRequest.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        # Only buyer, directed artist, or staff can touch the status
        if not (
            user == commission.buyer
            or user == commission.artist
            or user.is_staff
        ):
            raise PermissionDenied("You do not have permission to update this commission's status.")

        serializer = CommissionStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_status = commission.status
        new_status = serializer.validated_data["new_status"]
        note = serializer.validated_data.get("note", "")

        commission.status = new_status
        commission.save(update_fields=["status", "updated_at"])

        # Write audit log entry
        CommissionStatusLog.objects.create(
            request=commission,
            old_status=old_status,
            new_status=new_status,
            changed_by=user,
            note=note,
        )

        return Response(
            CommissionRequestSerializer(commission, context={"request": request}).data,
            status=status.HTTP_200_OK,
        )

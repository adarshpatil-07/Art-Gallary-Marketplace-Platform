from accounts.permissions import IsBuyer
from rest_framework import generics, permissions

from .models import Order
from .serializers import OrderSerializer


class OrderListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/orders/   — authenticated buyer sees their own orders
    POST /api/orders/   — authenticated buyer creates an order (clicks Buy)
    """

    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsBuyer]

    def get_queryset(self):
        return (
            Order.objects.filter(buyer=self.request.user)
            .select_related("buyer", "artwork", "artwork__artist")
            .prefetch_related("artwork__images")
        )


class OrderDetailView(generics.RetrieveAPIView):
    """
    GET /api/orders/<id>/
    Buyer who owns the order, or staff, can retrieve it.
    No update/delete — orders are immutable stubs for MVP.
    """

    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(buyer=user)

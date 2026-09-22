from rest_framework import permissions


class IsArtist(permissions.BasePermission):
    """Grants access only to authenticated users whose role is 'artist'."""

    message = "Only artist accounts can access this resource."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "artist"
        )


class IsBuyer(permissions.BasePermission):
    """Grants access only to authenticated users whose role is 'buyer'."""

    message = "Only buyer accounts can access this resource."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "buyer"
        )


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission — safe methods (GET/HEAD/OPTIONS) are always allowed;
    unsafe methods require the request user to be the object's owner.

    The view must call `get_object()` before this runs.
    Assumes the model has an `artist` or `buyer` attribute pointing at the owner.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Check common owner FK names
        owner = getattr(obj, "artist", None) or getattr(obj, "buyer", None)
        return owner == request.user

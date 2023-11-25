from rest_framework import permissions

class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is a manager and in the same department
        return (
            request.user.is_authenticated
            and request.user.is_manager()  # Assuming you have an is_manager method in your User model
            # and request.user.department == request.data.get('department')
        )
    
class IsLeader(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is a manager and in the same department
        return (
            request.user.is_authenticated
            and request.user.is_leader()  # Assuming you have an is_manager method in your User model
            # and request.user.department == request.data.get('department')
        )

class IsEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is a manager and in the same department
        return (
            request.user.is_authenticated
            and request.user.is_employee()  # Assuming you have an is_manager method in your User model
            # and request.user.department == request.data.get('department')
        )
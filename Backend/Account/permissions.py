from rest_framework import permissions

class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is a manager and in the same department
        return (
            request.user.is_authenticated
            and request.user.is_manager() 
        )
    
class IsLeader(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is a leader
        print(request.user)
        return (
            request.user.is_authenticated
            and request.user.is_leader()
        )

class IsEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is employee
        return (
            request.user.is_authenticated
            and request.user.is_employee() 
        )
    
class IsTransactionEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is a employee and in the transaction
        return (
            request.user.is_authenticated
            and request.user.is_transaction_employee()
        )
    
class IsConsolidationEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is a employee and in the consolidation
        return (
            request.user.is_authenticated
            and request.user.is_consolidation_employee() 
        )
    
class IsConsolidationManager(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is a manager and in the consolidation
        return (
            request.user.is_authenticated
            and request.user.is_consolidation_manager() 
        )
    
class IsTransactionManager(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is a manager and in the transaction
        return (
            request.user.is_authenticated
            and request.user.is_transaction_manager()  
        )
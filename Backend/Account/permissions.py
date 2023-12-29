from rest_framework import permissions

'''
Only request from Manager Account is accepted
'''
class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is a manager and in the same department
        return (
            request.user.is_authenticated
            and request.user.is_manager() 
        )

'''
Only request from Leader Account is accepted
'''  
class IsLeader(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is a leader
        print(request.user)
        return (
            request.user.is_authenticated
            and request.user.is_leader()
        )

'''
Only request from Employee Account is accepted
'''
class IsEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is employee
        return (
            request.user.is_authenticated
            and request.user.is_employee() 
        )

'''
Only request from Transaction Employee Account is accepted
'''   
class IsTransactionEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is a employee and in the transaction
        return (
            request.user.is_authenticated
            and request.user.is_transaction_employee()
        )

'''
Only request from Consolidation Employee Account is accepted
''' 
class IsConsolidationEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is a employee and in the consolidation
        return (
            request.user.is_authenticated
            and request.user.is_consolidation_employee() 
        )
    
'''
Only request from Consolidation Manager Account is accepted
'''
class IsConsolidationManager(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is a manager and in the consolidation
        return (
            request.user.is_authenticated
            and request.user.is_consolidation_manager() 
        )

'''
Only request from Transaction Manager Account is accepted
'''   
class IsTransactionManager(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is a manager and in the transaction
        return (
            request.user.is_authenticated
            and request.user.is_transaction_manager()  
        )
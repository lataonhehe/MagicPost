from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from .serializers import UserSerializer
from .permissions import IsLeader, IsManager, IsEmployee
from .models import User, Department
from Transaction.models import Shipment, Transaction
from django import forms
from django.http import JsonResponse

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
def login_api(request):
    """Log in and response token"""
    username = request.data.get('username', None)
    password = request.data.get('password', None)
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return Response(status=status.HTTP_200_OK, data={"message": "Login successful"})

    return Response(
        status=status.HTTP_400_BAD_REQUEST,
        data={"message": "Invalid username or password"},
    )

# @api_view(["GET"])
# @permission_classes([IsLeader])
# def display_leader_department_page(request):
#     """Display transaction_page """
#     json_data = {
#         'transaction_list': Department.objects.all.values()
#     }
#     return JsonResponse(json_data)

@api_view(["POST"])
def register_api(request):
    """Create a new account and respond with a success message."""
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_201_CREATED, data={"message": "User is registered successfully."})
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST, data={"errors": serializer.errors})

@api_view(["POST"])
@permission_classes([IsManager])
def create_employee(request):
    """Create an employee only if the requesting user is a manager in the same department."""
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_201_CREATED, data={"message": "Employee is created successfully."})
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST, data={"errors": serializer.errors})
    
@api_view(["POST"])
@permission_classes([IsLeader])
def create_manager(request):
    """Create an employee only if the requesting user is a manager in the same department."""
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_201_CREATED, data={"message": "Employee is created successfully."})
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST, data={"errors": serializer.errors})
    
@api_view(["GET", "DELETE"])
@permission_classes([IsManager])
def employee_list(request):
    """Get a list of employees in the manager's department and delete an employee."""
    if request.method == "GET":
        manager = request.user
        employees = User.objects.filter(department=manager.department, role='0')  # Filter users with role 'Employee' in the same department
        serializer = UserSerializer(employees, many=True)
        return Response(serializer.data)

    elif request.method == "DELETE":
        employee_id = request.data.get('employee_id')
        try:
            employee = User.objects.get(id=employee_id, role='0', department=request.user.department)
            employee.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    else:
        return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Invalid request method."})

@api_view(["GET", "DELETE"])
@permission_classes([IsLeader])
def manager_list(request):
    """Get a list of managers and delete a manager."""
    if request.method == "GET":
        managers = User.objects.filter(role='1')  # Filter users with role 'Manager'
        serializer = UserSerializer(managers, many=True)
        return Response(serializer.data)

    elif request.method == "DELETE":
        manager_id = request.data.get('manager_id')
        try:
            manager = User.objects.get(id=manager_id, role='1')
            manager.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    else:
        return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Invalid request method."})

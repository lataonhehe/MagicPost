from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.http import JsonResponse
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import check_password
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from .serializers import UserSerializer
from .permissions import IsLeader, IsManager, IsEmployee
from .models import User
from django.shortcuts import get_object_or_404

@api_view(["POST"])
def login_api(request):
    """Log in and response token"""

    #Get usename and password from request
    username = request.data.get('username', None)
    password = request.data.get('password', None)
    try:
        #Get User info by username
        user = User.objects.get(username=username)

        #Run when username exists
        if user is not None:

            #Check if password is correct by hashing request password
            #Successful
            if check_password(password, user.password):
                #create token
                token, created = Token.objects.get_or_create(user=user)
                serializer = UserSerializer(instance=user)
                #return response

                department_type = 3
                if(user.role != '2'): 
                    department_type = user.department.department_type
                #return response
                return JsonResponse({
                    "Token": token.key,
                    "username": user.username,
                    "role": user.role,
                    "department": department_type
                }, status= status.HTTP_200_OK)
            else:
                # Authentication failed
                return JsonResponse({"detail": "Wrong username or password"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            # Authentication failed
            return JsonResponse({"detail": "Wrong username or password"}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        print(e) 
        #Return this if the data from request is now what the server expected
        return JsonResponse({"detail": "Wrong username or password."}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout_api(request):
    """Log out user"""
    request.auth.delete()
    return JsonResponse(status=status.HTTP_200_OK, data={"message": "Logout successful"})

# @api_view(["GET"])
# @permission_classes([IsLeader])
# def display_leader_department_page(request):
#     """Display transaction_page """
#     json_data = {
#         'transaction_list': Department.objects.all.values()
#     }
#     return JsonResponse(json_data)

@api_view(["POST"])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsManager])
def register_api(request):
    """Create a new account and respond with a success message."""
    #Get usename and password from request
    username = request.data.get('username', None)
    password = request.data.get('password', None)
    department = request.user.department

    # Check data 
    if username == None or password == None:
        return JsonResponse({
            "detail": "Username or password is not provided"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check username exist in database or not
    exist = User.objects.filter(username=username).exists()

    if exist:
        return JsonResponse({
            "detail": "Username exists."}, 
            status=status.HTTP_409_CONFLICT
        )
    
    user = User(username=username, password=password, role='0', department=department)
    user.save()

    return JsonResponse({
        "detail": "Account is created successfully."}, 
        status=status.HTTP_201_CREATED
    ) 

@api_view(["POST"])
@permission_classes([IsManager])
def create_employee(request):
    """Create an employee only if the requesting user is a manager in the same department."""
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return JsonResponse(status=status.HTTP_201_CREATED, data={"message": "Employee is created successfully."})
    else:
        return JsonResponse(status=status.HTTP_400_BAD_REQUEST, data={"errors": serializer.errors})
    
@api_view(["POST"])
@permission_classes([IsLeader])
def create_manager(request):
    """Create an employee only if the requesting user is a manager in the same department."""
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return JsonResponse(status=status.HTTP_201_CREATED, data={"message": "Employee is created successfully."})
    else:
        return JsonResponse(status=status.HTTP_400_BAD_REQUEST, data={"errors": serializer.errors})
    
@api_view(["GET", "DELETE"])
@permission_classes([IsManager])
def employee_list(request):
    """Get a list of employees in the manager's department and delete an employee."""
    if request.method == "GET":
        manager = request.user
        employees = User.objects.filter(department=manager.department, role='0')  # Filter users with role 'Employee' in the same department
        serializer = UserSerializer(employees, many=True)
        return JsonResponse(serializer.data)

    elif request.method == "DELETE":
        employee_id = request.data.get('employee_id')
        try:
            employee = User.objects.get(id=employee_id, role='0', department=request.user.department)
            employee.delete()
            return JsonResponse(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return JsonResponse(status=status.HTTP_404_NOT_FOUND)

    else:
        return JsonResponse(status=status.HTTP_400_BAD_REQUEST, data={"message": "Invalid request method."})

@api_view(["GET", "DELETE"])
@permission_classes([IsLeader])
def manager_list(request):
    """Get a list of managers and delete a manager."""
    if request.method == "GET":
        managers = User.objects.filter(role='1')  # Filter users with role 'Manager'
        serializer = UserSerializer(managers, many=True)
        return JsonResponse(serializer.data)

    elif request.method == "DELETE":
        manager_id = request.data.get('manager_id')
        try:
            manager = User.objects.get(id=manager_id, role='1')
            manager.delete()
            return JsonResponse(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return JsonResponse(status=status.HTTP_404_NOT_FOUND)

    else:
        return JsonResponse(status=status.HTTP_400_BAD_REQUEST, data={"message": "Invalid request method."})

### Truong diem tap ket, giao dich

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsManager])
def list_employee(request):
    '''
    Rerturn the list employee via manager
    '''
    manager = request.user
    department = manager.department

    # Get list of employee via manager department
    employee_list = list(User.objects.filter(department=department, role='0'))

    response_data = {
        'employee_list': [
        {
            'id': x.pk,
            'username': x.username,
            'role': 'Transaction Employee' if department.department_type == '0' else 'Consolidation Employee',
            'department': department.call_name(),
        } for x in employee_list]
    }
    return JsonResponse (
        response_data,
        status = status.HTTP_200_OK
    )
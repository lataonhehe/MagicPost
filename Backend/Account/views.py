'''
This place defines each request action
'''

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
                department_type = 3
                if(user.role != '2'): 
                    department_type = user.department.department_type
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

# Define a view function for creating an employee
@api_view(["POST"])
@permission_classes([IsManager])
def create_employee(request):
    """
    Create an employee only if the requesting user is a manager in the same department.
    
    Args:
        request: HTTP request object containing data for creating the employee.
    
    Returns:
        JsonResponse: JSON response indicating success or failure of the employee creation.
    """
    
    # Create a serializer instance with the request data
    serializer = UserSerializer(data=request.data)

    # Check if the serializer data is valid
    if serializer.is_valid():
        # Save the serialized data to create the employee
        serializer.save()
        
        # Return a JSON response indicating successful employee creation
        return JsonResponse(status=status.HTTP_201_CREATED, data={"message": "Employee is created successfully."})
    else:
        # Return a JSON response indicating validation errors if serializer data is not valid
        return JsonResponse(status=status.HTTP_400_BAD_REQUEST, data={"errors": serializer.errors})
    
# Define a view function for creating a manager
@api_view(["POST"])
@permission_classes([IsLeader])
def create_manager(request):
    """
    Create a manager only if the requesting user is a leader in the same department.
    
    Args:
        request: HTTP request object containing data for creating the manager.
    
    Returns:
        JsonResponse: JSON response indicating success or failure of the manager creation.
    """
    
    # Create a serializer instance with the request data
    serializer = UserSerializer(data=request.data)

    # Check if the serializer data is valid
    if serializer.is_valid():
        # Save the serialized data to create the manager
        serializer.save()
        
        # Return a JSON response indicating successful manager creation
        return JsonResponse(status=status.HTTP_201_CREATED, data={"message": "Manager is created successfully."})
    else:
        # Return a JSON response indicating validation errors if serializer data is not valid
        return JsonResponse(status=status.HTTP_400_BAD_REQUEST, data={"errors": serializer.errors})
    
# Define a view function for managing employee list (GET and DELETE)
@api_view(["GET", "DELETE"])
@permission_classes([IsManager])
def employee_list(request):
    """
    Get a list of employees in the manager's department and delete an employee.

    Args:
        request: HTTP request object for retrieving or deleting employee data.

    Returns:
        JsonResponse: JSON response containing employee data for GET requests or status for DELETE requests.
    """
    
    if request.method == "GET":
        # Retrieve the manager and filter employees in the same department with role 'Employee'
        manager = request.user
        employees = User.objects.filter(department=manager.department, role='Employee')
        serializer = UserSerializer(employees, many=True)
        
        # Return a JSON response with the serialized employee data
        return JsonResponse(serializer.data)

    elif request.method == "DELETE":
        # Extract employee_id from request data and attempt to delete the employee
        employee_id = request.data.get('employee_id')
        try:
            # Retrieve the employee with specified id, role 'Employee', and in the same department
            employee = User.objects.get(id=employee_id, role='Employee', department=request.user.department)
            employee.delete()
            
            # Return a JSON response indicating successful deletion
            return JsonResponse(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            # Return a JSON response indicating employee not found
            return JsonResponse(status=status.HTTP_404_NOT_FOUND)

    else:
        # Return a JSON response indicating invalid request method
        return JsonResponse(status=status.HTTP_400_BAD_REQUEST, data={"message": "Invalid request method."})

# Define a view function for managing manager list (GET and DELETE)
@api_view(["GET", "DELETE"])
@permission_classes([IsLeader])
def manager_list(request):
    """
    Get a list of managers and delete a manager.

    Args:
        request: HTTP request object for retrieving or deleting manager data.

    Returns:
        JsonResponse: JSON response containing manager data for GET requests or status for DELETE requests.
    """
    
    if request.method == "GET":
        # Retrieve managers with role 'Manager'
        managers = User.objects.filter(role='Manager')
        serializer = UserSerializer(managers, many=True)
        
        # Return a JSON response with the serialized manager data
        return JsonResponse(serializer.data)

    elif request.method == "DELETE":
        # Extract manager_id from request data and attempt to delete the manager
        manager_id = request.data.get('manager_id')
        try:
            # Retrieve the manager with specified id and role 'Manager'
            manager = User.objects.get(id=manager_id, role='Manager')
            manager.delete()
            
            # Return a JSON response indicating successful deletion
            return JsonResponse(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            # Return a JSON response indicating manager not found
            return JsonResponse(status=status.HTTP_404_NOT_FOUND)

    else:
        # Return a JSON response indicating invalid request method
        return JsonResponse(status=status.HTTP_400_BAD_REQUEST, data={"message": "Invalid request method."})
#------------------------------------------------------------------------------------
# Truong diem tap ket, giao dich
#------------------------------------------------------------------------------------

# Define a view function for retrieving a list of employees via manager (GET)
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsManager])
def employee_list(request):
    '''
    Return the list of employees via the manager's department.

    Args:
        request: HTTP request object for retrieving the employee list.

    Returns:
        JsonResponse: JSON response containing the employee list.
    '''

    # Retrieve the manager and department information
    manager = request.user
    department = manager.department

    # Get a list of employees in the manager's department with role 'Transaction Employee' or 'Consolidation Employee'
    employee_list = list(User.objects.filter(department=department, role='Transaction Employee' if department.department_type == '0' else 'Consolidation Employee'))

    # Prepare the response data with required fields
    response_data = {
        'employee_list': [
            {
                'id': x.pk,
                'username': x.username,
                'role': 'Transaction Employee' if department.department_type == '0' else 'Consolidation Employee',
                'department': department.call_name(),
            } for x in employee_list]
    }

    # Return a JSON response with the serialized employee data and a 200 OK status
    return JsonResponse(
        response_data,
        status=status.HTTP_200_OK
    )


# Define a view function for deleting selected employees via manager (DELETE)
@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsManager])
def delete_employee(request):
    '''
    Delete selected employees via manager.

    Args:
        request: HTTP request object for deleting selected employees.

    Returns:
        JsonResponse: JSON response indicating success or failure of the delete operation.
    '''

    if request.method == 'DELETE':
        # Retrieve the manager and department information
        manager = request.user
        department = manager.department

        # Ensure the request body contains a list of employee IDs to delete
        employee_ids = request.data.get('ids', [])

        try:
            # Perform the delete operation for each employee ID
            for employee_id in employee_ids:
                # Retrieve the employee with the specified ID, in the manager's department, and with role 'Employee'
                user_to_delete = User.objects.get(id=employee_id, department=department, role='Employee')
                user_to_delete.delete()

            # Return a JSON response indicating successful deletion
            return JsonResponse(
                {'message': 'Employees deleted successfully'},
                status=status.HTTP_204_NO_CONTENT
            )
        except User.DoesNotExist:
            # Return a JSON response indicating that one or more selected employees do not exist or do not belong to the manager's department
            return JsonResponse(
                {'error': 'One or more selected employees do not exist or do not belong to the manager\'s department'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            # Return a JSON response indicating an internal server error during the delete operation
            return JsonResponse(
                {'error': f'An error occurred while deleting employees: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    else:
        # Return a JSON response indicating that the HTTP method is not allowed
        return JsonResponse(
            {'error': 'Method not allowed'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import AccountSerializer  
from .models import Account
from django.shortcuts import render
from django.contrib.auth import authenticate, login


@api_view(["POST"])
# @permission_classes([AllowAny])
def login_view(request):
    """Authenticate user and respond with a token."""
    username = request.data.get('username')
    password = request.data.get('password')
    print(username+' '+password)
    try:
        account = Account.objects.get(username=username)
    except Account.DoesNotExist:
        Response(status=status.HTTP_401_UNAUTHORIZED, data={"error": "Invalid credentials"})
    
    if account.password == password:
        return Response(status=status.HTTP_200_OK, data={"message": "Login successful"})
    else:
        return Response(status=status.HTTP_401_UNAUTHORIZED, data={"error": "Wrong password"})

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response(status=status.HTTP_200_OK, data={"message": "Login successful"})
    else:
        return Response(status=status.HTTP_401_UNAUTHORIZED, data={"error": "Invalid credentials"})
    


@api_view(["POST"])
def register_view(request):
    """Create new account and response token"""
    serializer = AccountSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        # Perform login after registration if needed
        # login(request, user)
        return Response(status=status.HTTP_201_CREATED, data={"message": "User is created"})

    return Response(status=status.HTTP_400_BAD_REQUEST, data={"errors": serializer.errors})

def list(request):
    accounts = Account.objects.all()
    return render(request, 'Account/list.html', {'accounts': accounts})

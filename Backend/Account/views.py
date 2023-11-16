from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import AccountSerializer  
from .models import Account
from django.shortcuts import render



@api_view(["POST"])
# @permission_classes([AllowAny])
def login_view(request):
    """Token login"""
    auth_view = ObtainAuthToken.as_view()
    response = auth_view(request._request)

    # Customize the response if needed
    if response.status_code == status.HTTP_200_OK:
        user = response.data['user']
        print(f"[SERVER] Login successfully from {user}\n")

    return response



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

def index(request):
    return HttpResponse('Hello world. You are at the account index.')
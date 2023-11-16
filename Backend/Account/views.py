from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login
from .serializers import UserSerializer

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
        return Response(status=HTTP_200_OK, data={"message": "Login successful"})

    return Response(
        status=HTTP_400_BAD_REQUEST,
        data={"message": "Invalid username or password"},
    )


@api_view(["POST"])
def register_api(request):
    """Create a new account and respond with a success message."""
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(status=HTTP_200_OK, data={"message": "User is registered successfully."})
    else:
        return Response(status=HTTP_400_BAD_REQUEST, data={"errors": serializer.errors})
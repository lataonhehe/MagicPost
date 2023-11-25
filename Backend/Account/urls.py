from django.urls import path
from .views import create_employee, create_manager

urlpatterns = [
    path('create_employee', create_employee, name='create_employee'),
    path('create_manager', create_manager, name='create_manager')
    # Add other URL patterns as needed
]
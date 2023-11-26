from django.urls import path
from .views import create_employee, create_manager, manager_list

urlpatterns = [
    path('create_employee', create_employee, name='create_employee'),
    path('create_manager', create_manager, name='create_manager'),
    path('manager_list', manager_list, name='manager_list')
    # Add other URL patterns as needed
]
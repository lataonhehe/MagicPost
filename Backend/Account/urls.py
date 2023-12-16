from django.urls import path
from .views import *

urlpatterns = [
    path('create_employee', create_employee, name='create_employee'),
    path('create_manager', create_manager, name='create_manager'),
    path('manager_list', manager_list, name='manager_list'),
    path("manager/register", register_api),
    path("manager/list_employee", list_employee)
    # Add other URL patterns as needed
]
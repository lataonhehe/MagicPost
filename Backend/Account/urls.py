from django.urls import path
from .views import *

'''
Add URL of each requests
'''
urlpatterns = [
    path('create_employee', create_employee, name='create_employee'),
    path('create_manager', create_manager, name='create_manager'),
    path('manager_list', manager_list, name='manager_list'),
    path("register", register_api),
    path("employee_list", employee_list),
    path('delete_employee', delete_employee),
    # Add other URL patterns as needed
]
from typing import Any
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

'''
Declare Department object
'''
class Department(models.Model):
    TYPE = [
        ('0', 'TransactionPoint'),
        ('1', 'ConsolidationPoint')
    ]
    
    department_id = models.AutoField(primary_key=True)
    manager = models.OneToOneField('User', on_delete=models.CASCADE, related_name='manager')
    department_type = models.CharField(max_length=1, choices=TYPE, default='0')
    consolidation_point = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)    

    def call_name(self):
        name = "Điểm giao dịch" if self.department_type == '0' else "Điểm tập kết"
        return f"{name} {self.department_id}"

    
    def to_json(self):
        return {
            'department_id': self.department_id,
            'manager': self.manager.call_name(),
            'department_type': self.department_type,
            'department_type_name': "Điểm giao dịch" if self.department_type == '0' else "Điểm tập kết",
            'consolidation_point': self.consolidation_point.call_name() \
                                    if self.consolidation_point is not None else None,
        }

'''
Declare User Manager to add data from server
'''
class UserManager(BaseUserManager):
    def create_user(self, username, password=None, department=None, role='0', **extra_fields):
        '''
        Create new User from server
        '''
        if not username:
            raise ValueError('The Username field must be set')
        
        user = self.model(username=username, role=role, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    

    def create_superuser(self, username, password=None, department=None, role='2', **extra_fields):
        '''
        Create user who can modify data from server
        '''
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, password, department, role, **extra_fields)

'''
Declear User object, which include employee, manager, leader account
'''
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('2', 'Leader'),
        ('1', 'Manager'),
        ('0', 'Employee')
    ]
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True, default=None)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='0')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'username'

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"

    def is_leader(self):
        return self.role == '2'

    def is_manager(self):
        return self.role == '1'
    
    def is_employee(self):
        return self.role == '0'
    
    def is_transaction_employee(self):
        return self.is_employee() and self.department.department_type == '0'
    
    def is_consolidation_employee(self):
        return self.is_employee() and self.department.department_type == '1'
    
    def is_transaction_manager(self):
        return self.is_manager() and self.department.department_type == '0'
    
    def is_consolidation_manager(self):
        return self.is_leader() and self.department.department_type == '1'
    
    def call_name(self):
        return self.username
    
    def to_json(self):
        return {
            'username': self.username,
            'department': self.department.call_name(),
            'role': self.get_role_display(),
            'id': self.pk,            
        }
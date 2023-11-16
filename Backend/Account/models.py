from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class Department(models.Model):
    TYPE = [
        ('0', 'TransactionPoint'),
        ('1', 'ConsolidationPoint')
    ]
    
    department_id = models.AutoField(primary_key=True)
    manager = models.OneToOneField('User', on_delete=models.CASCADE, related_name='manager')
    department_type = models.CharField(max_length=1, choices=TYPE, default='0')
    consolidation_point = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)    

class UserManager(BaseUserManager):
    def create_user(self, username, password=None, department=None, role='0', **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        
        user = self.model(username=username, department=department, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, department=None, role='2', **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, password, department, role, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('2', 'Leader'),
        ('1', 'Manager'),
        ('0', 'Employee')
    ]

    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=50)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
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
    

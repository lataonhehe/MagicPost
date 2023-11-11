from django.db import models

# Create your models here.
class Department(models.Model):
    DEPARTMENT_TYPE_CHOICES = [
        ('CFS', 'CFS'),
        ('Other', 'Other'),
    ]

    department_id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=50, choices=DEPARTMENT_TYPE_CHOICES, default='Other')
    cfs = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.department_id} - {self.type}"
    
class Account(models.Model):
    ROLE_CHOICES = [
        ('Manager', 'Manager'),
        ('Staff', 'Staff'),
        ('Other', 'Other'),
    ]

    username = models.IntegerField(primary_key=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='Other')
    department = models.ForeignKey(Department, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.username} - {self.role}"

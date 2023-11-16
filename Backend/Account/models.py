from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class TransactionPoint(models.Model):
    department_id = models.AutoField(primary_key=True) 
    # manager = models.ForeignKey(Account, on_delete=models.CASCADE)
    consolidation_point = models.ForeignKey('ConsolidationPoint', on_delete=models.CASCADE)

class ConsolidationPoint(models.Model):
    department_id = models.AutoField(primary_key=True)
    # manager = models.ForeignKey(Account, on_delete=models.CASCADE)
    transaction_points = models.ManyToManyField(TransactionPoint)
    

class Account(models.Model):
    ROLE_CHOICES = [
        ('2', 'Leader'),
        ('1', 'Manager'),
        ('0', 'Employee')
    ]
    
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='0')
    transaction_point = models.ForeignKey('TransactionPoint', on_delete=models.CASCADE, null=True, blank=True)
    consolidation_point = models.ForeignKey('ConsolidationPoint', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"
    
    def isLeader(self):
        return self.role == '2'

    def isManager(self):
        return self.role == '1'




# from django.db import models

# # Create your models here.

# class Account(models.Model):
#     ROLE_CHOICES = [
#         ('LD', 'lanh_dao'),
#         ('TTK', 'truong_tap_ket'),
#         ('TGD', 'truong_giao_dich'),
#         ('NV', 'nhan_vien'),
#         ('KH', 'khach_hang')
#     ]

#     username = models.IntegerField(primary_key=True)
#     password = models.CharField(max_length=255)
#     role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='NV')

#     def __str__(self):
#         return f"{self.username} - {self.role}"
    
# class Tap_ket(models.Model):
#     department_id = models.AutoField(primary_key=True)
#     manager_id = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True)

#     def __str__(self):
#         return f"{self.department_id} - {self.type}"
    
# class Giao_dich(models.Model):
#     department_id = models.AutoField(primary_key=True)
#     manager_id = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True)
#     tap_ket = models.ForeignKey(Tap_ket, on_delete=models.SET_NULL, null=True)

from django.db import models

# Create your models here.

class Account(models.Model):
    ROLE_CHOICES = [
        ('LD', 'lanh_dao'),
        ('TTK', 'truong_tap_ket'),
        ('TGD', 'truong_giao_dich'),
        ('NV', 'nhan_vien'),
        ('KH', 'khach_hang')
    ]

    username = models.IntegerField(primary_key=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='NV')

    def __str__(self):
        return f"{self.username} - {self.role}"
    
class Tap_ket(models.Model):
    department_id = models.AutoField(primary_key=True)
    manager_id = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.department_id} - {self.type}"
    
class Giao_dich(models.Model):
    department_id = models.AutoField(primary_key=True)
    manager_id = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True)
    tap_ket = models.ForeignKey(Tap_ket, on_delete=models.SET_NULL, null=True)

    
class Customer(models.Model):
    name = models.CharField(max_length=30)
    phone = models.CharField(max_length=15)
    code = models.CharField(max_length=5)

    def __str__(self):
        pass

class Good(models.Model):
    status_list = [
        ('0', 'Noi giao dich cua nguoi gui.'),
        ('1', 'Noi tap ket.'),
        ('2', 'Noi giao dich cua nguoi nhan.'),
        ('3', 'Da den tay nguoi nhan.'),
    ]
    good_type_list = [
        ('TL', 'tai lieu'),
        ('HH', 'hang hoa')
    ]

    id = models.AutoField(primary_key=True)
    status = models.CharField(max_length=50, choices=status_list, default='0')
    
    #sender info
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    sender_address = models.CharField(max_length=100)
    sender_postal_code = models.CharField(max_length=10)
    sender_total_payment = models.DecimalField(max_digits=12, decimal_places=2)

    #receiver info
    receiver_address = models.CharField(max_length=100)
    receiver_postal_code = models.CharField(max_length=10)
    receiver_name = models.CharField(max_length=30)
    receiver_phone = models.CharField(max_length=15)
    receiver_total_payment = models.DecimalField(max_digits=12, decimal_places=2)
    DHCode = models.CharField(max_length=5, null=True)
    receiving_date = models.DateField(blank=True, null=True)

    good_type = models.CharField(max_length=8, choices=good_type_list, default='HH')
    special_service = models.CharField(max_length=50, null=True)
    weight = models.DecimalField(max_digits=4, decimal_places=2)


    def __str__(self):
        pass

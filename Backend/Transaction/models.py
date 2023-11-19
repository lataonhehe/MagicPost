from django.db import models
from Account.models import Department

# Create your models here.
class Shipment(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]

    good_type_list = [
        ('TL', 'tai lieu'),
        ('HH', 'hang hoa')
    ]

    shipment_id = models.AutoField(primary_key=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending')
    pos = models.ForeignKey(Department, related_name='transactions_pos', on_delete=models.CASCADE)

    #sender info
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
        return f"{self.shipment_id} - {self.status}"

class Transaction(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed')
    ]

    transaction_id = models.AutoField(primary_key=True)
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE)
    pos = models.ForeignKey(Department, related_name='transactions_pos', on_delete=models.CASCADE)
    des = models.ForeignKey(Department, related_name='transactions_des', on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"{self.transaction_id} - {self.status}"

    
    
    

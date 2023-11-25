from django.db import models
from Account.models import Department

# Create your models here.
class Shipment(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed')
    ]

    good_type_list = [
        ('TL', 'tai lieu'),
        ('HH', 'hang hoa')
    ]

    shipment_id = models.AutoField(primary_key=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending')
    pos = models.ForeignKey(Department, related_name='shipment_pos', on_delete=models.CASCADE)
    current_pos = models.ForeignKey(Department, related_name='shipment_current_pos', on_delete=models.CASCADE)
    #sender info
    sender_address = models.CharField(max_length=100, default=None, null=True)
    sender_postal_code = models.CharField(max_length=10, default=None, null=True)
    sender_total_payment = models.DecimalField(max_digits=12, decimal_places=2, default=None, null=True)

    #receiver info
    receiver_address = models.CharField(max_length=100, default=None, null=True)
    receiver_postal_code = models.CharField(max_length=10, default=None, null=True)
    receiver_name = models.CharField(max_length=30, default=None, null=True)
    receiver_phone = models.CharField(max_length=15, default=None, null=True)
    receiver_total_payment = models.DecimalField(max_digits=12, decimal_places=2, default=None, null=True)
    DHCode = models.CharField(max_length=5, default=None, null=True)
    receiving_date = models.DateField(blank=True, default=None, null=True)

    good_type = models.CharField(max_length=8, choices=good_type_list, default='HH')
    special_service = models.CharField(max_length=50, default=None, null=True)
    weight = models.DecimalField(max_digits=4, decimal_places=2, default=None, null=True)

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

    
    
    

from django.db import models

# Create your models here.
class Transaction(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]

    transaction_id = models.AutoField(primary_key=True)
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE)
    pos = models.ForeignKey(Department, related_name='transactions_pos', on_delete=models.CASCADE)
    des = models.ForeignKey(Department, related_name='transactions_des', on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"{self.transaction_id} - {self.status}"
    
class Shipment(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]

    shipment_id = models.AutoField(primary_key=True)
    progress = models.CharField(max_length=255)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"{self.shipment_id} - {self.status}"
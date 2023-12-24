from django.db import models
from Account.models import Department
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone
import uuid

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
    des = models.ForeignKey(Department, related_name='shipment_des', on_delete=models.CASCADE)
    #sender info
    sender_address = models.CharField(max_length=100, default=None, null=True)
    sender_postal_code = models.CharField(max_length=10, default=None, null=True)
    sender_total_payment = models.DecimalField(max_digits=12, decimal_places=2, default=None, null=True)
    sender_phone = models.CharField(max_length=15, default=None, null=True, blank=True)
    sender_name = models.CharField(max_length=30, default=None, null=True, blank=True)
    #receiver info
    receiver_address = models.CharField(max_length=100, default=None, null=True)
    receiver_postal_code = models.CharField(max_length=10, default=None, null=True)
    receiver_name = models.CharField(max_length=30, default=None, null=True)
    receiver_phone = models.CharField(max_length=15, default=None, null=True)
    receiver_total_payment = models.DecimalField(max_digits=12, decimal_places=2, default=None, null=True)
    DHCode = models.CharField(max_length=15, default=None, null=True, blank=True)
    receiving_date = models.DateField(blank=True, default=None, null=True)

    good_type = models.CharField(max_length=8, choices=good_type_list, default='HH')
    special_service = models.CharField(max_length=50, default=None, null=True, blank=True)
    weight = models.DecimalField(max_digits=4, decimal_places=2, default=None, null=True)

    def __str__(self):
        return f"{self.shipment_id} - {self.status}"
    
    def generate_dhcode(self):
        # Use UUID to generate a unique DHCode
        return str(uuid.uuid4().hex)[:15]
    
    def to_json(self, status):
        return {
            'shipment_id': self.shipment_id,
            'status': status,
            'DHCode': self.DHCode,
            'sender_address': self.sender_address,
            'receiver_address': self.receiver_address,
            'type': self.good_type,
            'weight': self.weight
        }

    def call_name(self):
        return f"Shipment{self.pk}"
    
     
    
@receiver(pre_save, sender=Shipment)
def set_dhcode(sender, instance, **kwargs):
    # Check if the Shipment instance doesn't have a DHCode yet
    if not instance.DHCode:
        # Generate DHCode and set it to the instance
        instance.DHCode = instance.generate_dhcode()
        
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
    created_at = models.DateTimeField(default=timezone.now)


    def __str__(self):
        return f"{self.transaction_id} - {self.status}"
    
    def call_name(self):
        return f"Transaction{self.pk}"

# Signal receiver to update created_at when status is changed
@receiver(pre_save, sender=Transaction)
def update_created_at(sender, instance, **kwargs):
    # Check if the instance is being updated (already exists in the database)
    if instance.pk:
        old_instance = Transaction.objects.get(pk=instance.pk)
        # Check if the status field has changed
        if old_instance.status != instance.status:
            # Update created_at to the current date and time
            instance.created_at = timezone.now()

# Connect the signal
pre_save.connect(update_created_at, sender=Transaction)
    
class CustomerTransaction(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed')
    ]

    shipment = models.ForeignKey(Shipment, related_name='shipment', on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='In Progress')
    created_at = models.DateTimeField(default=timezone.now)


# Signal receiver to update created_at when status is changed
@receiver(pre_save, sender=CustomerTransaction)
def update_created_at(sender, instance, **kwargs):
    # Check if the instance is being updated (already exists in the database)
    if instance.pk:
        old_instance = CustomerTransaction.objects.get(pk=instance.pk)
        # Check if the status field has changed
        if old_instance.status != instance.status:
            # Update created_at to the current date and time
            instance.created_at = timezone.now()

# Connect the signal
pre_save.connect(update_created_at, sender=CustomerTransaction)
from django.db import models
from Account.models import Department
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone
import uuid

# Create your models here.
# Define a Shipment model
class Shipment(models.Model):
    # Choices for shipment status
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed')
    ]

    # Choices for good type
    GOOD_TYPE_CHOICES = [
        ('TL', 'Tài Liệu'),
        ('HH', 'Hàng Hóa')
    ]

    # Define Shipment model fields
    shipment_id = models.AutoField(primary_key=True)
    shipment_name = models.CharField(max_length=30, default=None, null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending')
    pos = models.ForeignKey(Department, related_name='shipment_pos', on_delete=models.CASCADE)
    current_pos = models.ForeignKey(Department, related_name='shipment_current_pos', on_delete=models.CASCADE)
    des = models.ForeignKey(Department, related_name='shipment_des', on_delete=models.CASCADE)

    # Sender information
    sender_name = models.CharField(max_length=30, default=None, null=True, blank=True)
    sender_address = models.CharField(max_length=100, default=None, null=True)
    sender_address_detail = models.CharField(max_length=100, default=None, null=True)
    sender_postal_code = models.CharField(max_length=10, default=None, null=True)
    sender_total_payment = models.DecimalField(max_digits=12, decimal_places=2, default=None, null=True)
    sender_phone = models.CharField(max_length=15, default=None, null=True, blank=True)

    # Receiver information
    receiver_address = models.CharField(max_length=100, default=None, null=True)
    receiver_address_detail = models.CharField(max_length=100, default=None, null=True)
    receiver_postal_code = models.CharField(max_length=10, default=None, null=True)
    receiver_name = models.CharField(max_length=30, default=None, null=True)
    receiver_phone = models.CharField(max_length=15, default=None, null=True)
    receiver_total_payment = models.DecimalField(max_digits=12, decimal_places=2, default=None, null=True)
    DHCode = models.CharField(max_length=15, default=None, null=True, blank=True)
    receiving_date = models.DateField(blank=True, default=None, null=True)

    good_type = models.CharField(max_length=8, choices=GOOD_TYPE_CHOICES, default='HH')
    special_service = models.CharField(max_length=50, default=None, null=True, blank=True)
    weight = models.DecimalField(max_digits=10, decimal_places=2, default=None, null=True)

    # Define the __str__ method to represent Shipment instances as a string
    def __str__(self):
        return f"{self.shipment_id} - {self.status}"

    # Generate a unique DHCode using UUID
    def generate_dhcode(self):
        return str(uuid.uuid4().hex)[:15]

    # Convert Shipment instance to a JSON-like dictionary
    def to_json(self):
        status = "Hàng đợi"
        if self.status == "In Progress":
            status = "Đang vận chuyển"
        elif self.status == "Completed":
            status = "Thành công"
        elif self.status == "Failed":
            status = "Thất bại"
        return {
            'shipment_id': self.shipment_id,
            'status': status,
            'DHCode': self.DHCode,
            'current_pos': self.current_pos.call_name(),
            'des': self.des.call_name(),
            'sender_address': self.sender_address_detail,
            'receiver_address': self.receiver_address_detail,
            'type': "Tài liệu" if self.good_type == "TL" else "Hàng hóa",
            'weight': self.weight,
            'target_consolidation_point': self.des.consolidation_point.pk
        }

    # Define a method to return a formatted name for the Shipment
    def call_name(self):
        return f"Shipment{self.pk}"

# Signal receiver to set DHCode before saving a Shipment instance
@receiver(pre_save, sender=Shipment)
def set_dhcode(sender, instance, **kwargs):
    # Check if the Shipment instance doesn't have a DHCode yet
    if not instance.DHCode:
        # Generate DHCode and set it to the instance
        instance.DHCode = instance.generate_dhcode()
        
# Define a Transaction model
class Transaction(models.Model):
    # Choices for transaction status
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed')
    ]

    # Define Transaction model fields
    transaction_id = models.AutoField(primary_key=True)
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE)
    pos = models.ForeignKey(Department, related_name='transactions_pos', on_delete=models.CASCADE)
    des = models.ForeignKey(Department, related_name='transactions_des', on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(default=timezone.now)

    # Define the __str__ method to represent Transaction instances as a string
    def __str__(self):
        return f"{self.transaction_id} - {self.status}"

    # Define a method to return a formatted name for the Transaction
    def call_name(self):
        return f"Transaction{self.pk}"

    # Convert Transaction instance to a JSON-like dictionary
    def to_json(self):
        return {
            'transaction_id': self.transaction_id,
            'shipment_id': self.shipment.pk,
            'pos': self.pos.call_name(),
            'des': self.des.call_name(),
            'status': self.status,
            'created_at': self.created_at
        }

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

# Define a CustomerTransaction model
class CustomerTransaction(models.Model):
    # Choices for transaction status
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed')
    ]

    # Define CustomerTransaction model fields
    shipment = models.ForeignKey(Shipment, related_name='shipment', on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='In Progress')
    created_at = models.DateTimeField(default=timezone.now)

    # Convert CustomerTransaction instance to a JSON-like dictionary
    def to_json(self):
        return {
            'shipment': self.shipment.to_json(),
            'status': self.status,
            'created_at': self.created_at
        }

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
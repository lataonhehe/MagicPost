from django.db import models
from Account.models import TransactionPoint, ConsolidationPoint

class Parcel(models.Model):
    sender = models.CharField(max_length=100)
    receiver = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    transaction_point = models.ForeignKey(TransactionPoint, on_delete=models.CASCADE, null=True, blank=True)
    consolidation_point = models.ForeignKey(ConsolidationPoint, on_delete=models.CASCADE, null=True, blank=True)
    # employee = models.ForeignKey(Account, on_delete=models.CASCADE, null=True, blank=True)

class Transaction(models.Model):
    sender = models.CharField(max_length=100)
    receiver = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    transaction_point = models.ForeignKey(TransactionPoint, on_delete=models.CASCADE, null=True, blank=True)
    consolidation_point = models.ForeignKey(ConsolidationPoint, on_delete=models.CASCADE, null=True, blank=True)
    # employee = models.ForeignKey(Account, on_delete=models.CASCADE, null=True, blank=True)

# class Good(models.Model):
#     status_list = [
#         ('0', 'Noi giao dich cua nguoi gui.'),
#         ('1', 'Noi tap ket.'),
#         ('2', 'Noi giao dich cua nguoi nhan.'),
#         ('3', 'Da den tay nguoi nhan.'),
#     ]
#     good_type_list = [
#         ('TL', 'tai lieu'),
#         ('HH', 'hang hoa')
#     ]

#     id = models.AutoField(primary_key=True)
#     status = models.CharField(max_length=50, choices=status_list, default='0')
    
#     #sender info
#     customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
#     sender_address = models.CharField(max_length=100)
#     sender_postal_code = models.CharField(max_length=10)
#     sender_total_payment = models.DecimalField(max_digits=12, decimal_places=2)

#     #receiver info
#     receiver_address = models.CharField(max_length=100)
#     receiver_postal_code = models.CharField(max_length=10)
#     receiver_name = models.CharField(max_length=30)
#     receiver_phone = models.CharField(max_length=15)
#     receiver_total_payment = models.DecimalField(max_digits=12, decimal_places=2)
#     DHCode = models.CharField(max_length=5, null=True)
#     receiving_date = models.DateField(blank=True, null=True)

#     good_type = models.CharField(max_length=8, choices=good_type_list, default='HH')
#     special_service = models.CharField(max_length=50, null=True)
#     weight = models.DecimalField(max_digits=4, decimal_places=2)


#     def __str__(self):
#         pass


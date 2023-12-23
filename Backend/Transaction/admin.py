from django.contrib import admin
from .models import Shipment, Transaction, CustomerTransaction
# Register your models here.
admin.site.register(Shipment)
admin.site.register(Transaction)
admin.site.register(CustomerTransaction)
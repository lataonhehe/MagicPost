from django.contrib import admin
from .models import Shipment, Transaction
# Register your models here.
admin.site.register(Shipment)
admin.site.register(Transaction)
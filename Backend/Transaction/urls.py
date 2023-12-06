from django.urls import path
from .views import *

urlpatterns = [
    path('create_shipment', create_shipment),
    path('create_transaction_to_consolidation_point', create_transaction_to_consolidation_point),
    path('confirm_shipment_from_consolidation_department', confirm_shipment_from_consolidation_department),
    path('confirm_shipment_to_receiver', confirm_shipment_to_receiver),
    path('confirm_failed_shipment_and_create_transaction', confirm_failed_shipment_and_create_transaction),
    path('confirm_transaction_from_transaction_department', confirm_transaction_from_transaction_department),
    path('create_transaction_to_target_consolidation_point', create_transaction_to_target_consolidation_point),
    path('confirm_transaction_from_other_consolidation_department', confirm_transaction_from_other_consolidation_department),
    path('create_transaction_to_target_transaction_point', create_transaction_to_target_transaction_point)
]
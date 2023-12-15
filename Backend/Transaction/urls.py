from django.urls import path
from .views import *

urlpatterns = [
    path('create_shipment', create_shipment),
    path('transaction_employee/shipment_to_consolidation', create_transaction_to_correspond_consolidation_point),
    path('transaction_employee/shipment_from_consolidation', confirm_shipment_from_correspond_consolidation_department),

    path('consolidation_employee/shipment_from_transaction', confirm_transaction_from_correspond_transaction_department),
    path('consolidation_employee/shipment_to_consolidation', create_transaction_to_target_consolidation_point),
    path('consolidation_employee/shipment_from_consolidation', confirm_transaction_from_other_consolidation_department),
    path('consolidation_employee/shipment_to_transaction', create_transaction_to_target_transaction_point),
    path('search_shipment', search_shipment)
]


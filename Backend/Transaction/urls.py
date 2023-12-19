from django.urls import path
from .views import *

urlpatterns = [
    path('create_shipment', create_shipment),
    path('transaction_employee/shipment_to_consolidation', create_transaction_to_correspond_consolidation_point),
    path('transaction_employee/shipment_from_consolidation', confirm_shipment_from_correspond_consolidation_department),
    path('transaction_employee/create_transaction_to_receiver', create_transaction_to_receiver),
    path('transaction_employee/confirm_complete_shipment', confirm_complete_shipment),
    path('transaction_employee/confirm_failed_shipment_and_send_back', confirm_failed_shipment_and_send_back),
    path('transaction_employee/list_complete_and_fail_shipment', list_complete_and_fail_shipment),

    path('consolidation_employee/shipment_from_transaction', confirm_transaction_from_correspond_transaction_department),
    path('consolidation_employee/shipment_to_consolidation', create_transaction_to_target_consolidation_point),
    path('consolidation_employee/shipment_from_consolidation', confirm_transaction_from_other_consolidation_department),
    path('consolidation_employee/shipment_to_transaction', create_transaction_to_target_transaction_point),
    path('search_shipment', search_shipment),
    path('manager/list_shipment', list_shipment),
]


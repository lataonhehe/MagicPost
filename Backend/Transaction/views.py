from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from Account.serializers import UserSerializer
from Account.permissions import IsLeader, IsManager, IsEmployee
from Account.models import User, Department
from Transaction.models import Shipment, Transaction
from django import forms
from django.http import JsonResponse
from .serializers import ShipmentSerializer, TransactionSerializer

# Create your views here.

#Giao dịch viên

class ShipmentForm(forms.ModelForm):
    class Meta:
        model = Shipment
        fields = ['pos', 'current_pos']

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, IsEmployee]) 
def create_shipment(request):
    """
    Create shipment for customer from Transaction Department
    """
    pos = request.user.department
    # request.data['pos'] = pos
    # request.data['current_pos'] = pos
    serializer = ShipmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            status=status.HTTP_201_CREATED,
            data={"message": "Shipment is created successfully."}
        )
    return Response(status=status.HTTP_400_BAD_REQUEST, data={"errors": serializer.errors})

    # if request.method == 'POST':
    #     #Page have a 'save' button
    #     try:
    #         data['pos'] = Department.objects.get(department_id=data['pos'])
    #         data['current_pos'] = data['pos']
    #     except Exception:
    #         response_data = {'status': 'error', 'message': 'Invalid pos id'}
    #         return JsonResponse(response_data)
        
    #     #Check position is transaction point
    #     if data['pos'].department_type == '1':
    #         response_data = {'status': 'errror', 'message': 'Position is not transaction point.'}
    #         return JsonResponse(response_data)
        
        # Check position is a transaction point
    form = ShipmentForm(request.data)
    if form.is_valid():
        new_shipment = Shipment(**request.data)
        new_shipment.status = 'In Progress'
        new_shipment.save()
        response_data = {'status': 'success', 'message': 'Shipment saved successfully'}
        return JsonResponse(response_data)
    else:
        response_data = {'status': 'error', 'message': 'Error: Invalid data for creating a Shipment'}
        return JsonResponse(response_data)
        

@api_view(['POST'])
# @permission_classes([IsEmployee])
def create_transaction_to_consolidation_point(request):
    """
    Create transaction when shipment is delivered.
    """

    #Check shipment exist
    data = request.data
    try:
        shipment = Shipment.objects.get(shipment_id=data['shipment_id']) 
    except Exception:
        response_data = {'status': 'errror', 'message': 'Shipment does not exist'}
        return JsonResponse(response_data)
    
    #Check shipment are being delivered
    if Transaction.objects.filter(shipment=shipment, status='In Progress').exists():
        response_data = {'status': 'errror', 'message': 'Shipment has been in progress already.'}
        return JsonResponse(response_data)
    
    #Check position is transaction point
    print(shipment.current_pos.department_type)
    try:
        pos = Department.objects.get(department_id=shipment.current_pos.department_id, department_type='0') 
    except Exception:
        response_data = {'status': 'errror', 'message': 'Position is not transaction point.'}
        return JsonResponse(response_data)
    
    #Check destination is transaction point and exits
    try:
        des = Department.objects.get(department_id=data['des_id'], department_type='1') 
    except Exception:
        response_data = {'status': 'errror', 'message': 'Destination does not exist or position is not transaction point.'}
        return JsonResponse(response_data)

    
    if request.method == 'POST':

        #Update shipment status
        shipment.status = 'In Progress'
        shipment.save()

        #Create transaction
        transaction = Transaction(shipment=shipment, pos=pos, des=des, status='In Progress')
        transaction.save()

        response_data = {'status': 'success', 'message': 'Transaction saved successfully'}
        return JsonResponse(response_data)
    

    
@api_view(['POST'])
# @permission_classes([IsEmployee])
def confirm_shipment_from_consolidation_department(request):
    data = request.data
    #Check transaction
    try:
        transaction = Transaction.objects.get(transaction_id=data['transaction_id'])
    except Exception:
        response_data = {'status': 'error', 'message': 'Transaction doest not exist.'}
        return JsonResponse(response_data)
    
    #Check the transaction progress
    if transaction.status == 'Completed':
        response_data = {'status': 'error', 'message': 'Transaction was completed before.'}
        return JsonResponse(response_data) 
    
    #Check position is consolidation 
    if transaction.pos.department_type != '1':
        response_data = {'status': 'error', 'message': 'Position is not consolidation point'}
        return JsonResponse(response_data) 

    if request.method == 'POST':
        # Update shipment
        shipment = transaction.shipment
        shipment.current_pos = transaction.des
        shipment.save()
        # Update transaction
        transaction.status = 'Completed'
        transaction.save()

        response_data = {'status': 'success', 'message': 'Transaction status is updated successfully.'}
        return JsonResponse(response_data)

@api_view(['POST'])
# @permission_classes([IsEmployee])
def confirm_shipment_to_receiver(request):
    """
    Confirm shipment is delivered successfully to receiver. 
    """

    data = request.data

    #Check transaction id
    try:
        transaction = Transaction.objects.get(transaction_id=data['transaction_id'])
    except:
        response_data = {'status': 'error', 'message': 'Transaction does not exist.'}
        return JsonResponse(response_data)
    
    #Check position is transaction point
    if transaction.pos.department_type != '0':
        response_data = {'status': 'error', 'message': 'Position is not transaction point.'}
        return JsonResponse(response_data) 
    
    #Check status
    if transaction.status != 'In Progress':
        response_data = {'status': 'error', 'message': 'Transaction is not in progress.'}
        return JsonResponse(response_data)
    
    if request.method == 'POST':

        # Update shipment status
        shipment = transaction.shipment
        shipment.status = 'Completed'
        shipment.save()

        # Update transaction status
        transaction.status = 'Completed'
        transaction.save()

        response_data = {'status': 'success', 'message': 'Confirm shipment successfully.'}
        return JsonResponse(response_data)

@api_view(['POST'])
# @permission_classes([IsEmployee])
def confirm_failed_shipment_and_create_transaction(request):
    data = request.data

    #Check transaction id
    try:
        transaction = Transaction.objects.get(transaction_id=data['transaction_id'])
    except:
        response_data = {'status': 'error', 'message': 'Transaction does not exist.'}
        return JsonResponse(response_data)
    
    #Check status
    if transaction.status != 'In Progress':
        response_data = {'status': 'error', 'message': 'Transaction is not in progress.'}
        return JsonResponse(response_data)
    
    if request.method == 'POST':

        # Update shipment status
        shipment = transaction.shipment
        shipment.status = 'Pending'
        shipment.save()

        # Update transaction status
        transaction.status = 'Failed'
        transaction.save()

        # Create transaction to transaction point of sender
        transaction = Transaction(shipment=shipment, pos=transaction.pos, des=shipment.pos, status='In Progress')
        transaction.save()
        response_data = {'status': 'success', 'message': 'Confirm failed shipment successfully.'}
        return JsonResponse(response_data)
    
"""
Nhan vien giao dich
"""
@api_view(['POST'])
# @permission_classes([IsEmployee])
def create_transaction_to_target_consolidation_point(request):
    """
    Create transaction when shipment is delivered.
    """

    #Check shipment exist
    data = request.data
    try:
        shipment = Shipment.objects.get(shipment_id=data['shipment_id']) 
    except Exception:
        response_data = {'status': 'errror', 'message': 'Shipment does not exist'}
        return JsonResponse(response_data)
    
    #Check shipment are being delivered
    if Transaction.objects.filter(shipment=shipment, status='In Progress').exists():
        response_data = {'status': 'errror', 'message': 'Shipment has been in progress already.'}
        return JsonResponse(response_data)
    
    try:
        pos = Department.objects.get(department_id=shipment.current_pos.department_id, department_type='1') 
    except Exception:
        response_data = {'status': 'errror', 'message': 'Position is not consolidation point.'}
        return JsonResponse(response_data)
    
    #Check destination is consolidation point and exits
    try:
        des = Department.objects.get(department_id=data['des_id'], department_type='1') 
    except Exception:
        response_data = {'status': 'errror', 'message': 'Destination does not exist or position is not consolidation point.'}
        return JsonResponse(response_data)

    
    if request.method == 'POST':

        #Update shipment status
        shipment.status = 'In Progress'
        shipment.save()

        #Create transaction
        transaction = Transaction(shipment=shipment, pos=pos, des=des, status='In Progress')
        transaction.save()

        response_data = {'status': 'success', 'message': 'Transaction saved successfully'}
        return JsonResponse(response_data)
    
@api_view(['POST'])
# @permission_classes([IsEmployee])
def confirm_transaction_from_transaction_department(request):
    data = request.data
    #Check transaction
    try:
        transaction = Transaction.objects.get(transaction_id=data['transaction_id'])
    except Exception:
        response_data = {'status': 'error', 'message': 'Transaction doest not exist.'}
        return JsonResponse(response_data)
    
    #Check the transaction progress
    if transaction.status != 'In Progress':
        response_data = {'status': 'error', 'message': 'Transaction is not in progress.'}
        return JsonResponse(response_data) 
    
    #Check position is consolidation 
    if transaction.pos.department_type != '0':
        response_data = {'status': 'error', 'message': 'Position is not transaction point'}
        return JsonResponse(response_data) 

    if request.method == 'POST':

        #Update shipment
        shipment = transaction.shipment
        shipment.current_pos = transaction.des
        shipment.save()

        #Update transaction
        transaction.status = 'Completed'
        transaction.save()
        response_data = {'status': 'success', 'message': 'Transaction status is updated successfully.'}
        return JsonResponse(response_data)
    
@api_view(['POST'])
# @permission_classes([IsEmployee])
def confirm_transaction_from_other_consolidation_department(request):
    data = request.data
    #Check transaction
    try:
        transaction = Transaction.objects.get(transaction_id=data['transaction_id'])
    except Exception:
        response_data = {'status': 'error', 'message': 'Transaction doest not exist.'}
        return JsonResponse(response_data)
    
    #Check the transaction progress
    if transaction.status != 'In Progress':
        response_data = {'status': 'error', 'message': 'Transaction is not in progress.'}
        return JsonResponse(response_data) 
    
    #Check position is consolidation 
    if transaction.pos.department_type != '1':
        response_data = {'status': 'error', 'message': 'Position is not consolidation point'}
        return JsonResponse(response_data) 

    if request.method == 'POST':
        # Update shipment
        shipment = transaction.shipment
        shipment.current_pos = transaction.des
        shipment.save()

        #Update transaction
        transaction.status = 'Completed'
        transaction.save()
        response_data = {'status': 'success', 'message': 'Transaction status is updated successfully.'}
        return JsonResponse(response_data)
    
@api_view(['POST'])
# @permission_classes([IsEmployee])
def create_transaction_to_target_transaction_point(request):
    """
    Create transaction when shipment is delivered.
    """

    #Check shipment exist
    data = request.data
    try:
        shipment = Shipment.objects.get(shipment_id=data['shipment_id']) 
    except Exception:
        response_data = {'status': 'errror', 'message': 'Shipment does not exist'}
        return JsonResponse(response_data)
    
    #Check shipment are being delivered
    if Transaction.objects.filter(shipment=shipment, status='In Progress').exists():
        response_data = {'status': 'errror', 'message': 'Shipment has been in progress already.'}
        return JsonResponse(response_data)
    
    try:
        pos = Department.objects.get(department_id=shipment.current_pos.department_id, department_type='1') 
    except Exception:
        response_data = {'status': 'errror', 'message': 'Position is not consolidation point.'}
        return JsonResponse(response_data)
    
    if request.method == 'POST':

        #Update shipment status
        shipment.status = 'In Progress'
        shipment.save()

        #Create transaction
        transaction = Transaction(shipment=shipment, pos=pos, des=Department.objects.get(consolidation_point=shipment.current_pos), status='In Progress')
        transaction.save()

        response_data = {'status': 'success', 'message': 'Transaction saved successfully'}
        return JsonResponse(response_data)
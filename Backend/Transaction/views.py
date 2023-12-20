from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from Account.serializers import UserSerializer
from Account.permissions import IsLeader, IsManager, IsConsolidationEmployee, IsTransactionEmployee
from Account.models import User, Department
from Transaction.models import Shipment, Transaction, CustomerTransaction
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
@permission_classes([IsAuthenticated, IsTransactionEmployee]) 
def create_shipment(request):
    """
    Create shipment for customer from Transaction Department
    """
    #Create postion and current position for shipment
    pos = request.user.department.pk
    request.data['pos'] = pos
    request.data['current_pos'] = pos

    #Check and create target transaction deparment
    try:
        des_id = request.data['des_id']
        request.data['des'] = Department.objects.get(pk=des_id, department_type='0')
        request.data.pop('des_id')
    except Exception:
        Response(status=status.HTTP_400_BAD_REQUEST, 
                 data={"message": "Request does not have destination id or destination id does not exist or not transaction point."})

    # Convert json data to Shipment    
    serializer = ShipmentSerializer(data=request.data)
    
    # Check json data valid
    if serializer.is_valid():
        serializer.save()
        return Response(
            status=status.HTTP_201_CREATED,
            data={"message": "Shipment is created successfully."}
        )
    return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": serializer.errors})
        

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsTransactionEmployee])
def create_transaction_to_correspond_consolidation_point(request):
    """
    Create transaction when shipment is delivered.
    """

    # Load data
    data = request.data

    # Check request data has expected data
    shipment_id = request.date.get('shipment_id', None)
    if shipment_id is None:
        response_data = {
            'message': 'Your request does not have shipment_id'
        }
        return JsonResponse(
            response_data,
            status = status.HTTP_400_BAD_REQUEST
        )
    
    # Check shipment exist
    try:
        shipment = Shipment.objects.get(shipment_id=data['shipment_id']) 
    except Exception:
        response_data = {'message': 'Shipment ID does not exist.'}
        return JsonResponse(response_data, status=status.HTTP_404_NOT_FOUND)

    #Check shipment are being delivered
    transaction_list = (Transaction.objects.filter(shipment=shipment).order_by('-created_at'))
    if transaction_list[0].status == 'In Progress':
        response_data = {'status': 'errror', 'message': 'Shipment has been in progress already.'}
        return JsonResponse(response_data, status=status.HTTP_409_CONFLICT)
    
    #Check position is transaction point and match to employee transaction point
    try:
        pos = Department.objects.get(department_id=shipment.current_pos.department_id, department_type='0') 
        employee_department = request.user.department

        if pos.pk != employee_department.pk:
            response_data = {'message': 'Shipment current position and your position does not match.'}
            return JsonResponse(response_data, status=status.HTTP_409_CONFLICT)
    except Exception:
        response_data = {'message': 'Shipment position is not transaction point.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)
    

    if request.method == 'POST':

        #Update shipment status
        shipment.status = 'In Progress'
        shipment.save()

        #Create transaction
        des = employee_department.consolidation_point
        transaction = Transaction(shipment=shipment, pos=pos, des=des, status='In Progress')
        transaction.save()

        # Return success respond
        response_data = {'message': 'Transaction saved successfully'}
        return JsonResponse(response_data, status=status.HTTP_201_CREATED)
    

    
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsTransactionEmployee])
def confirm_shipment_from_correspond_consolidation_department(request):
    data = request.data
    #Check transaction
    try:
        transaction = Transaction.objects.get(transaction_id=data['transaction_id'])
    except Exception:
        response_data = {'message': 'Transaction doest not exist.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)
    
    #Check the transaction progress
    if transaction.status != 'In Progress':
        response_data = {'message': 'Transaction was not in progress.'}
        return JsonResponse(response_data, status=status.HTTP_409_CONFLICT) 
    
    #Check position is correspond consolidation 
    if transaction.pos.pk != request.user.department.consolidation_point.pk:
        response_data = {'message': 'Transaction is not from correspond consolidation department.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)

    # Check destination of transaction is employee department
    if transaction.des.pk != request.user.department.pk:
        response_data = {'message': 'Transaction destination does not match with your department.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == 'POST':
        # Update shipment
        shipment = transaction.shipment
        shipment.current_pos = transaction.des
        shipment.save()
        # Update transaction
        transaction.status = 'Completed'
        transaction.save()

        response_data = {'message': 'Transaction status is updated successfully.'}
        return JsonResponse(response_data, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsTransactionEmployee])
def create_transaction_to_receiver(request):
    '''
    Create transaction to send shipment from transaction point to receiver address
    '''

    data = request.data

    # Check shipment
    try:
        shipment = Shipment.objects.get(transaction_id=data['shipment_id'])
    except Exception:
        response_data = {'message': 'Shipment does not exist.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)

    # Check that shipment des have to be the same as employess department
    shipment_des = shipment.des
    employee_department = data.user.department
    if shipment_des != employee_department:
        response_data = {'message': 'Your department is not match with shipmet target transaction point.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)
    
    # Check that shipment are not in sending process to customer
    try:
        customer_transaction = CustomerTransaction.objects.get(shipment=shipment)
        response_data = {'message': 'Shipment is already delivering to receiver.'}
        return JsonResponse(response_data, status=status.HTTP_409_CONFLICT)
    except Exception:
        pass
    finally:
        transaction = CustomerTransaction(shipment)
        transaction.save()
        response_data = {'message': 'Customer transaction is created succesfully.'}
        return JsonResponse(response_data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsTransactionEmployee])
def confirm_complete_shipment(request):
    """
    Confirm complete customer transaction and shipment status
    """

    data = request.data

    # Check customer transaction exist
    try:
        customer_transaction = CustomerTransaction.objects.get(pk=data['customer_transaction_id'])
    except Exception:
        response_data = {'message': 'Customer transaction does not exist.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)

    # Customer transaction status have to be In Progress
    if customer_transaction.status != 'In Progress':
        response_data = {'message': 'Customer transaction status is not in progress.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)
    
    # Change transaction and shipment status
    customer_transaction.status = 'Completed'
    customer_transaction.save()
    shipment = customer_transaction.shipment
    shipment.status = 'Completed'
    shipment.save()

    response_data = {'message': 'Confirm completed shipment successfully.'}
    return JsonResponse(response_data, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsTransactionEmployee])
def confirm_failed_shipment_and_send_back(request):
    data = request.data

    # Check customer transaction exist
    try:
        customer_transaction = CustomerTransaction.objects.get(pk=data['customer_transaction_id'])
    except Exception:
        response_data = {'message': 'Customer transaction does not exist.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)

    # Customer transaction status have to be In Progress
    if customer_transaction.status != 'In Progress':
        response_data = {'message': 'Customer transaction status is not in progress.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)
    
    # Change transaction and shipment status
    customer_transaction.status = 'Failed'
    customer_transaction.save()
    shipment = customer_transaction.shipment
    shipment.status = 'Failed'
    shipment.save()

    # Create transaction to send back

    response_data = {'message': 'Confirm failed shipment successfully.'}
    return JsonResponse(response_data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsTransactionEmployee])
def list_complete_and_fail_shipment(request):
    department = request.user.department

    # Get customer transaction that completed and failed
    completed_shipment = list(Shipment.objects.filter(des=department, status='Completed'))
    failed_shipment = list(Shipment.objects.filter(des=department, status='Failed'))

    response_data = {
        'Completed_shipment': [x.to_json('completed') for x in completed_shipment],
        'Failed_shipment': [x.to_json('failed') for x in failed_shipment]
    }
    return JsonResponse(response_data, status=status.HTTP_200_OK)





    
"""
Nhan vien tap ket
"""
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsConsolidationEmployee])
def create_transaction_to_target_consolidation_point(request):
    """
    Create transaction to deliver shipment to consolidation point correspond to receiver address.
    """

    #Check shipment exist
    data = request.data
    try:
        shipment = Shipment.objects.get(shipment_id=data['shipment_id']) 
    except Exception:
        response_data = {'message': 'Shipment does not exist.'}
        return JsonResponse(response_data, status=status.HTTP_404_NOT_FOUND)
    
    #Check shipment are being delivered
    transaction_list = (Transaction.objects.filter(shipment=shipment).order_by('-created_at'))
    if transaction_list[0].status == 'In Progress':
        response_data = {'message': 'Shipment has been in progress already.'}
        return JsonResponse(response_data, status=status.HTTP_409_CONFLICT)
    
    #Check position is consolidation point and match to employee transaction point
    try:
        pos = Department.objects.get(department_id=shipment.current_pos.department_id, department_type='1') 
        employee_department = request.user.department

        if pos.pk != employee_department.pk:
            response_data = {'message': 'Shipment current position and your position does not match.'}
            return JsonResponse(response_data, status=status.HTTP_409_CONFLICT)
    except Exception:
        response_data = {'message': 'Shipment position is not transaction point or does not exist.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == 'POST':

        #Update shipment status
        shipment.status = 'In Progress'
        shipment.save()

        #Create transaction
        consolidation_des = shipment.des.consolidation_point
        transaction = Transaction(shipment=shipment, pos=request.user.department, des=consolidation_des, status='In Progress')
        transaction.save()

        response_data = {'message': 'Transaction is created successfully.'}
        return JsonResponse(response_data, status=status.HTTP_201_CREATED)
    
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsConsolidationEmployee])
def confirm_transaction_from_correspond_transaction_department(request):
    # Load data
    data = request.data

    #Check transaction id
    try:
        transaction = Transaction.objects.get(transaction_id=data['transaction_id'])
    except Exception:
        response_data = {'message': 'Transaction doest not exist.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)
    
    #Check the transaction progress
    if transaction.status != 'In Progress':
        response_data = {'message': 'Transaction was not in progress.'}
        return JsonResponse(response_data, status=status.HTTP_409_CONFLICT) 
    
    # Check destination of transaction is employee department
    if transaction.des.pk != request.user.department.pk:
        response_data = {'message': 'Transaction destination does not match with your department.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)
    
    #Check position is correspond transaction
    if transaction.pos.pk.consolidation_point != request.user.department:
        response_data = {'message': 'Transaction is not from correspond transaction department.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED) 

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
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsConsolidationEmployee])
def confirm_transaction_from_other_consolidation_department(request):
    data = request.data
    #Check transaction
    try:
        transaction = Transaction.objects.get(transaction_id=data['transaction_id'])
    except Exception:
        response_data = {'message': 'Transaction doest not exist.'}
        return JsonResponse(response_data, status=status.HTTP_404_NOT_FOUND)
    
    #Check the transaction progress
    if transaction.status != 'In Progress':
        response_data = {'message': 'Transaction is not in progress.'}
        return JsonResponse(response_data, status=status.HTTP_409_CONFLICT) 
    
    # Check destination of transaction is employee department
    if transaction.des.pk != request.user.department.pk:
        response_data = {'message': 'Transaction destination does not match with your department.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)
    
    #Check position is consolidation 
    if transaction.pos.department_type != '1':
        response_data = {'message': 'Position is not consolidation point'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED) 

    if request.method == 'POST':
        # Update shipment
        shipment = transaction.shipment
        shipment.current_pos = transaction.des
        shipment.save()

        #Update transaction
        transaction.status = 'Completed'
        transaction.save()
        response_data = {'message': 'Transaction status is updated successfully.'}
        return JsonResponse(response_data, status=status.HTTP_200_OK)
    
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsConsolidationEmployee])
def create_transaction_to_target_transaction_point(request):
    """
    Create transaction to correspond target transaction
    """

    #Check shipment exist
    data = request.data
    try:
        shipment = Shipment.objects.get(shipment_id=data['shipment_id']) 
    except Exception:
        response_data = {'message': 'Shipment does not exist'}
        return JsonResponse(response_data, statua=status.HTTP_404_NOT_FOUND)
    
    #Check shipment are being delivered
    transaction_list = (Transaction.objects.filter(shipment=shipment).order_by('-created_at'))
    if transaction_list[0].status == 'In Progress':
        response_data = {'message': 'Shipment has been in progress already.'}
        return JsonResponse(response_data, status=status.HTTP_409_CONFLICT)
    
    #Check position is consolidation point and match to employee transaction point
    try:
        pos = Department.objects.get(department_id=shipment.current_pos.department_id, department_type='1') 
        employee_department = request.user.department

        if pos.pk != employee_department.pk:
            response_data = {'message': 'Shipment current position and your position does not match.'}
            return JsonResponse(response_data, status=status.HTTP_409_CONFLICT)
    except Exception:
        response_data = {'message': 'Shipment position is not transaction point or does not exist.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)
    
    # Check detination consolidation point of shipment match the employee depaerment
    if shipment.des.consolidation_point != request.user.department:
        response_data = {'message': 'Shipment consolidation destimation is not your deparment \
                         so you can not send it to your correspond transaction point'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)  

    if request.method == 'POST':

        #Update shipment status
        shipment.status = 'In Progress'
        shipment.save()

        #Create transaction
        transaction = Transaction(shipment=shipment, pos=pos, des=shipment.des, status='In Progress')
        transaction.save()

        response_data = {'status': 'success', 'message': 'Transaction is created succcessfully.'}
        return JsonResponse(response_data)
    
### Khách hàng
    
@api_view(['GET'])
def search_shipment(request):

    shipment_code = request.GET.get('code', '')
    print(shipment_code)
    if shipment_code is not None:
        try:
            shipment = Shipment.objects.get(DHCode=shipment_code)
            transactions = list(Transaction.objects.filter(shipment=shipment).order_by('created_at'))
            response_data = {
                'transaction_list': [{
                    'pos': x.pos.call_name(),
                    'des': x.des.call_name(),
                    'status': x.status,
                    'date': x.created_at
                } for x in transactions
                ],
                'shipment_status': shipment.status,
                'shipment_pos': shipment.sender_address,
                'shipment_des': shipment.receiver_address,
                'shipment_type': shipment.good_type,
                'shipment_weight': shipment.weight
            }
            return JsonResponse(response_data, status = status.HTTP_200_OK) 
        except Exception as e: 
            response_data = {'message': 'Shipment code does not exist.'}
            return JsonResponse(response_data, status = status.HTTP_404_NOT_FOUND)
    else:
        response_data = {'message': 'Your DHCode is not correct.'}
        return JsonResponse(response_data, status = status.HTTP_400_BAD_REQUEST)


### Truong diem giao dich, tap ket
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsManager])
def list_shipment(request):

    manager = request.user
    department = manager.department

    # Take shipment of transaction that have des = manager.department and in progress
    coming_transaction = list(Transaction.objects.filter(des=department, status='In Progress'))    
    sending_transaction = list(Transaction.objects.filter(pos=department, status='In Progress'))
    sending_customer_transaction = list(CustomerTransaction.objects.filter(shipment__des=department, status='In Progress'))

    coming_shipment = [x.shipment for x in coming_transaction]
    sending_shipment = [x.shipment for x in sending_transaction + sending_customer_transaction]
    pending_shipment = [x for x in list(Shipment.objects.all()) if x.des == department and x not in sending_shipment]

    response_data = {
        'coming_shipment': [x.to_json('incoming') for x in coming_shipment], 
        'outgoing_shipment': [x.to_json('outgoing') for x in sending_shipment],
        'pending_shipment': [x.to_json('pending') for x in pending_shipment]
    }
    return JsonResponse (
        response_data,
        status = status.HTTP_200_OK
    )

### Lãnh đạo
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsLeader])
def list_department(request):
    department_list = Department.objects.all().values()
    response_data = {
        'department_list': [x.to_json() for x in department_list]
    }
    return JsonResponse(
        response_data,
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsLeader])
def list_manager(request):
    manager_list = list(User.objects.filter(role='1'))
    response_data = {
        'manager_list': [x.to_json() for x in manager_list]
    }

    return JsonResponse(
        response_data,
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsLeader])
def shipment_statistic(request):
    
    department_list = Department.objects.all().values()
    response_data = {
        
    }

    for i in department_list:
        response_data[i.call_name()] = {
            'coming_shipment': [],
            'sending_shipment': [],
            'pending_shipment': []
        }

    inprogress_transaction = list(Transaction.objects.filter(status='In Progress'))  
    inprogress_customer_transaction = list(CustomerTransaction.objects.filter(status='In Progress'))
    inprogress_shipment = [x.shipment for x in inprogress_transaction + inprogress_customer_transaction]
    pending_shipment = [x for x in list(Shipment.objects.all()) if x not in inprogress_shipment]

    for x in pending_shipment:
        department_name = x.current_pos.call_name()
        response_data[department_name]['pending_shipment'].append(x.to_json())

    for trans, _shipment in zip(inprogress_transaction, inprogress_shipment):
        des = trans.des.call_name()
        pos = trans.pos.call_name()
        data = _shipment.to_json()
        response_data[pos]['sending_shipmnet'].append(data)
        response_data[des]['coming_shipment'].append(data)

    return JsonResponse(
        response_data, 
        status=status.HTTP_200_OK
    )
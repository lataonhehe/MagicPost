from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from Account.serializers import UserSerializer
from Account.permissions import IsLeader, IsManager, IsEmployee, IsConsolidationEmployee, IsTransactionEmployee
from Account.models import User, Department
from Transaction.models import Shipment, Transaction, CustomerTransaction
from django import forms
from django.http import JsonResponse
from .serializers import ShipmentSerializer, TransactionSerializer
from django.db.models import Q, F

# Create your views here.

#---------------------------------------------------------------------------------
# Nhân viên giao dịch
#---------------------------------------------------------------------------------

# Define a view function for creating a shipment
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, IsTransactionEmployee])
def create_shipment(request):
    """
    Create a shipment for the customer from the Transaction Department.
    """

    # Print the request data for debugging purposes
    print(request.data)

    # Set the position and current position for the shipment
    pos = request.user.department.pk
    request.data['pos'] = pos
    request.data['current_pos'] = pos

    # Convert JSON data to a Shipment using the ShipmentSerializer
    serializer = ShipmentSerializer(data=request.data)

    # Check if the JSON data is valid
    if serializer.is_valid():
        # Save the serialized data as a new Shipment instance
        serializer.save()
        return Response(
            status=status.HTTP_201_CREATED,
            data={"message": "Shipment is created successfully."}
        )
    # Return a response indicating a bad request if the JSON data is not valid
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
    print(data)

    # Check request data has expected data
    shipment_ids = request.data.get('shipment_id', [])
    if not shipment_ids:
        response_data = {
            'message': 'Your request does not have shipment_id'
        }
        return JsonResponse(
            response_data,
            status=status.HTTP_400_BAD_REQUEST
        )

    # Process each shipment ID
    for shipment_id in shipment_ids:
        # Check shipment exist
        try:
            shipment = Shipment.objects.get(shipment_id=shipment_id)
        except Shipment.DoesNotExist:
            response_data = {'message': f'Shipment ID {shipment_id} does not exist.'}
            return JsonResponse(response_data, status=status.HTTP_404_NOT_FOUND)

        # Check other conditions and perform the necessary actions
        # Check shipment are being delivered
        transaction_list = (Transaction.objects.filter(shipment=shipment).order_by('-created_at'))
        if len(transaction_list) > 0:
            if transaction_list[0].status == 'In Progress':
                response_data = {'status': 'error', 'message': 'Shipment has been in progress already.'}
                return JsonResponse(response_data, status=status.HTTP_409_CONFLICT)
        
        # Check position is transaction point and match to employee transaction point
        try:
            pos = Department.objects.get(department_id=shipment.current_pos.department_id, department_type='0') 
            employee_department = request.user.department

            if pos.pk != employee_department.pk:
                response_data = {'message': 'Shipment current position and your position do not match.'}
                return JsonResponse(response_data, status=status.HTTP_409_CONFLICT)
        except Department.DoesNotExist:
            response_data = {'message': 'Shipment position is not a transaction point.'}
            return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)

        if request.method == 'POST':
            # Update shipment status
            shipment.status = 'In Progress'
            shipment.save()

            # Create transaction
            des = employee_department.consolidation_point
            transaction = Transaction(shipment=shipment, pos=pos, des=des, status='In Progress')
            transaction.save()

    # Return success response after processing all shipment IDs
    response_data = {'message': 'All transactions saved successfully'}
    return JsonResponse(response_data, status=status.HTTP_201_CREATED)
    

    
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsTransactionEmployee])
def confirm_shipment_from_correspond_consolidation_department(request):
    '''
    Confirm shipment from correspond consolidation point
    '''
    data = request.data

    # Check transaction exist
    try:
        transaction_list = []
        print(data)
        for id in data['transaction_id']:
            transaction_list.append(Transaction.objects.get(transaction_id=id))
    except Exception:
        response_data = {'message': 'Transaction doest not exist.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)
    
    for trans in transaction_list:
        #Check the transaction progress
        if trans.status != 'In Progress':
            response_data = {'message': 'Transaction was not in progress.'}
            return JsonResponse(response_data, status=status.HTTP_409_CONFLICT) 
        
        #Check position is correspond consolidation 
        if trans.pos.pk != request.user.department.consolidation_point.pk:
            response_data = {'message': 'Transaction is not from correspond consolidation department.'}
            return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)

        # Check destination of transaction is employee department
        if trans.des.pk != request.user.department.pk:
            response_data = {'message': 'Transaction destination does not match with your department.'}
            return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == 'POST':

        for trans in transaction_list:
            # Update shipment
            shipment = trans.shipment
            shipment.current_pos = trans.des
            shipment.save()
            # Update transaction
            trans.status = 'Completed'
            trans.save()

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

    for x in data['shipment_id']:
        # Check shipment
        try:
            shipment = Shipment.objects.get(shipment_id=x)
        except Exception:
            response_data = {'message': 'Shipment does not exist.'}
            return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)

        # Check that shipment des have to be the same as employess department
        shipment_des = shipment.des
        employee_department = request.user.department
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
            transaction = CustomerTransaction(shipment=shipment)
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
        customer_transaction_list = []
        for x in data['customer_transaction_id']:
            customer_transaction_list.append(CustomerTransaction.objects.get(pk=x))
    except Exception:
        response_data = {'message': 'Customer transaction does not exist.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)

    for trans in customer_transaction_list:
    # Customer transaction status have to be In Progress
        if trans.status != 'In Progress':
            response_data = {'message': 'Customer transaction status is not in progress.'}
            return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)
    
        # Change transaction and shipment status
        trans.status = 'Completed'
        trans.save()
        shipment = trans.shipment
        shipment.status = 'Completed'
        shipment.save()

    response_data = {'message': 'Confirm completed shipment successfully.'}
    return JsonResponse(response_data, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsTransactionEmployee])
def confirm_failed_shipment_and_send_back(request):
    '''
    Confirm shipment to receiver is failed and send it back to original transaction point
    '''
    data = request.data

    # Check customer transaction exist
    customer_transaction_list = []
    try:
        for x in data['customer_transaction_id']:
            customer_transaction_list.append(CustomerTransaction.objects.get(pk=x))
    except Exception:
        response_data = {'message': 'Customer transaction does not exist.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)

    for trans in customer_transaction_list:
    # Customer transaction status have to be In Progress
        if trans.status != 'In Progress':
            response_data = {'message': 'Customer transaction status is not in progress.'}
            return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)
    
        # Change transaction and shipment status
        trans.status = 'Failed'
        trans.save()
        shipment = trans.shipment
        shipment.status = 'Failed'
        shipment.des = shipment.pos
        shipment.pos = request.user.department
        shipment.current_pos = shipment.pos
        shipment.save()

        # Create transaction to send back
        pos = shipment.current_pos
        des = pos.consolidation_point
        transaction = Transaction(shipment=shipment, pos=pos, des=des, status='In Progress')
        transaction.save()
    response_data = {'message': 'Confirm failed shipment successfully.'}
    return JsonResponse(response_data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsTransactionEmployee])
def list_complete_and_fail_shipment(request):
    '''
    Get complete and fail shipment
    '''
    department = request.user.department

    # Get customer transaction that completed and failed
    completed_shipment = list(Shipment.objects.filter(pos=department, status='Completed'))
    failed_shipment = list(Shipment.objects.filter(pos=department, status='Failed'))

    response_data = {
        'Completed_shipment': [x.to_json('completed') for x in completed_shipment],
        'Failed_shipment': [x.to_json('failed') for x in failed_shipment]
    }
    return JsonResponse(response_data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsEmployee])
def get_coming_transaction_list(request):
    '''
    Get transactions that are delivering to department of
    employee send this request.
    '''
    department = request.user.department

    # Get coming transaction
    transaction_list = list(Transaction.objects.filter(des=department, status='In Progress'))

    consolidation_point = []
    transaction_point = []

    # Classify transaction from consolidation point and from transaction point
    for x in transaction_list:
        transaction_data = x.to_json()

        if x.pos.department_type == '0':
            transaction_point.append(transaction_data)
        else:
            consolidation_point.append(transaction_data)

    response_data = {
        'consolidation_point': consolidation_point,
        'transaction_point': transaction_point,
    }
    return JsonResponse(response_data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsEmployee])
def get_transaction(request):
    '''
    Get transactions that are being deliveried from employee department
    '''
    user_department = request.user.department
    transaction_list = list(Transaction.objects.filter(pos=user_department))

    consolidation_point = []
    transaction_point = []

    for x in transaction_list:
        transaction_data = x.to_json()

        if x.des.department_type == '0':
            transaction_point.append(transaction_data)
        else:
            consolidation_point.append(transaction_data)

    response_data = {
        'consolidation_point': consolidation_point,
        'transaction_point': transaction_point,
    }

    return JsonResponse(
        response_data,
        status=status.HTTP_200_OK
    )

# Define a view function to get a list of transaction departments
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsTransactionEmployee])
def get_transaction_department(request):
    user_department = request.user.department
    transaction_department_list = list(Department.objects.filter(department_type='0'))
    response_data = {
        'transaction_department_list': [
            {
                "name": x.call_name(), 
                "id": x.pk
            } for x in transaction_department_list if x != user_department
        ]
    }

    return JsonResponse(
        response_data,
        status=status.HTTP_200_OK
    )

# Define a view function to get a list of shipments in the user's department
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsEmployee])
def get_department_shipment_list(request):
    department = request.user.department

    # Get shipments in the department
    shipment_list = list(Shipment.objects.filter(Q(current_pos=department) & ~Q(des=F('current_pos'))))
    dep_shipment_list = []

    # Filter shipments based on status and ongoing transactions
    for x in shipment_list:
        if x.status == 'Pending':
            print(x)
            dep_shipment_list.append(x)
        else: 
            in_progress_transaction = list(Transaction.objects.filter(shipment=x, status='In Progress'))
            if len(in_progress_transaction) > 0:
                continue
            dep_shipment_list.append(x)
    consolidation_point = []
    transaction_point = []

    # Categorize shipments into consolidation and transaction points
    for x in dep_shipment_list:
        transaction_data = x.to_json()
        if x.des.consolidation_point == department:
            transaction_point.append(transaction_data)
        else:
            consolidation_point.append(transaction_data)

    response_data = {
        'consolidation_point': consolidation_point,
        'transaction_point': transaction_point,
    }

    return JsonResponse(response_data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsTransactionEmployee])
def get_department_customer_shipment_list(request):
    """
    Get shipments are going to deliver to receiver

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        JsonResponse: JSON response containing the list of in-progress customer transactions.
    """
    department = request.user.department

    # Get shipment in department
    shipment_list = list(Shipment.objects.filter(Q(current_pos=department) & Q(des=F('current_pos'))) \
                          .exclude(pk__in=CustomerTransaction.objects.values_list('shipment__pk', flat=True)))
    response_data = {
        'shipment_list': [
            x.to_json() for x in shipment_list
        ]
    }
    return JsonResponse(response_data, status=status.HTTP_200_OK)

# Define a view function to get a list of in-progress customer transactions
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsTransactionEmployee])
def get_customer_transaction(request):
    """
    Retrieve a list of in-progress customer transactions associated with the user's department.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        JsonResponse: JSON response containing the list of in-progress customer transactions.
    """
    user_department = request.user.department

    # Get in-progress customer transactions in the user's department
    inprogress_transaction = list(
        CustomerTransaction.objects.filter(
            shipment__current_pos=user_department,
            shipment__des=user_department,
            status='In Progress'
        )
    )

    # Convert customer transaction instances to JSON-like dictionaries
    response_data = {
        'inprogress_customer_transaction_list': [
            x.to_json() for x in inprogress_transaction
        ]
    }

    return JsonResponse(
        response_data,
        status=status.HTTP_200_OK
    )



    
#---------------------------------------------------------------------------------
# Nhân viên tập kết
#---------------------------------------------------------------------------------
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsConsolidationEmployee])
def create_transaction_to_target_consolidation_point(request):
    """
    Create transaction to deliver shipment to consolidation point correspond to receiver address.


    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        JsonResponse: JSON response containing the list of in-progress customer transactions.
    """

    #Check shipment exist
    data = request.data
    for shipment_id in data['shipment_id']:
        try:
            shipment = Shipment.objects.get(shipment_id=shipment_id) 
        except Exception:
            response_data = {'message': 'Shipment does not exist.'}
            return JsonResponse(response_data, status=status.HTTP_404_NOT_FOUND)
        
        #Check shipment are being delivered
        transaction_list = Transaction.objects.filter(shipment=shipment).order_by('-created_at')
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
    """
    Confirm transaction from correspond transaction department

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        JsonResponse: JSON response containing the list of in-progress customer transactions.
    """
    # Load data
    data = request.data

    #Check transaction id
    try:
        transaction_list = []
        for id in data['transaction_id']:
            transaction_list.append(Transaction.objects.get(transaction_id=id))
    except Exception:
        response_data = {'message': 'Transaction doest not exist.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)
    
    #Check the transaction progress

    for trans in transaction_list:
        if trans.status != 'In Progress':
            response_data = {'message': 'Transaction was not in progress.'}
            return JsonResponse(response_data, status=status.HTTP_409_CONFLICT) 
    
        # Check destination of transaction is employee department
        if trans.des.pk != request.user.department.pk:
            response_data = {'message': 'Transaction destination does not match with your department.'}
            return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)
        
        #Check position is correspond transaction
        if trans.pos.consolidation_point != request.user.department:
            response_data = {'message': 'Transaction is not from correspond transaction department.'}
            return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED) 

    if request.method == 'POST':
        
        for trans in transaction_list:
            #Update shipment
            shipment = trans.shipment
            shipment.current_pos = trans.des
            shipment.save()

            #Update transaction
            trans.status = 'Completed'
            trans.save()

        response_data = {'status': 'success', 'message': 'Transaction status is updated successfully.'}
        return JsonResponse(response_data)
    
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsConsolidationEmployee])
def confirm_transaction_from_other_consolidation_department(request):
    """
    Confirm transaction from other consolidation department.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        JsonResponse: JSON response containing the list of in-progress customer transactions.
    """
    data = request.data
    #Check transaction id
    try:
        transaction_list = []
        for id in data['transaction_id']:
            transaction_list.append(Transaction.objects.get(transaction_id=id))
    except Exception:
        response_data = {'message': 'Transaction doest not exist.'}
        return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)
    
    for trans in transaction_list:
        #Check the transaction progress
        if trans.status != 'In Progress':
            response_data = {'message': 'Transaction is not in progress.'}
            return JsonResponse(response_data, status=status.HTTP_409_CONFLICT) 
        
        # Check destination of transaction is employee department
        if trans.des.pk != request.user.department.pk:
            response_data = {'message': 'Transaction destination does not match with your department.'}
            return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)
        
        #Check position is consolidation 
        if trans.pos.department_type != '1':
            response_data = {'message': 'Position is not consolidation point'}
            return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED) 

    if request.method == 'POST':
        # Update shipment
        for trans in transaction_list:
            shipment = trans.shipment
            shipment.current_pos = trans.des
            shipment.save()

            #Update transaction
            trans.status = 'Completed'
            trans.save()
            response_data = {'message': 'Transaction status is updated successfully.'}
            return JsonResponse(response_data, status=status.HTTP_200_OK)
    
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsConsolidationEmployee])
def create_transaction_to_target_transaction_point(request):
    """
    Create transaction to correspond target transaction.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        JsonResponse: JSON response containing the list of in-progress customer transactions.
    """

    #Check shipment exist
    data = request.data
    for shipment_id in data['shipment_id']:
        try:
            shipment = Shipment.objects.get(shipment_id=shipment_id) 
        except Exception:
            response_data = {'message': 'Shipment does not exist.'}
            return JsonResponse(response_data, status=status.HTTP_404_NOT_FOUND)
        
        #Check shipment are being delivered
        transaction_list = Transaction.objects.filter(shipment=shipment).order_by('-created_at')
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


        #Update shipment status
        shipment.status = 'In Progress'
        shipment.save()

        #Create transaction
        transaction = Transaction(shipment=shipment, pos=pos, des=shipment.des, status='In Progress')
        transaction.save()

    response_data = {'message': 'Transaction is created successfully.'}
    return JsonResponse(response_data, status=status.HTTP_201_CREATED)
    
### Khách hàng
    
@api_view(['GET'])
def search_shipment(request):
    """
    Create transaction to correspond target transaction.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        JsonResponse: JSON response containing the information of shipment via DHCode.
    """

    # Get shipment code
    shipment_code = request.GET.get('code', '')

    # Check shipment code exists
    if shipment_code is not None:
        try:
            # Get shipment vid shipment code
            shipment = Shipment.objects.get(DHCode=shipment_code)
            transactions = list(Transaction.objects.filter(shipment=shipment).order_by('created_at'))

            # Prepare data to send
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
            # Return response if shipment does not exist
            response_data = {'message': 'Shipment code does not exist.'}
            return JsonResponse(response_data, status = status.HTTP_404_NOT_FOUND)
    else:
        # Return response if shipment code does not exist
        response_data = {'message': 'Your DHCode is not correct.'}
        return JsonResponse(response_data, status = status.HTTP_400_BAD_REQUEST)

#-----------------------------------------------------------------------------
# Truong diem giao dich, tap ket
#-----------------------------------------------------------------------------
# Define a view function to list shipments
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
# @permission_classes([IsManager])  # Uncomment this line when permission class is specified
def list_shipment(request):
    """
    Retrieve a list of shipments categorized as coming, outgoing, and pending.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        JsonResponse: JSON response containing the categorized shipment data.
    """
    manager = request.user
    department = manager.department

    # Get transactions associated with the manager's department
    coming_transaction = list(Transaction.objects.filter(des=department, status='In Progress'))
    sending_transaction = list(Transaction.objects.filter(pos=department, status='In Progress'))
    sending_customer_transaction = list(CustomerTransaction.objects.filter(shipment__des=department, status='In Progress'))

    # Extract shipments from transactions
    coming_shipment = [x.shipment for x in coming_transaction]
    sending_shipment = [x.shipment for x in sending_transaction + sending_customer_transaction]

    # Find pending shipments in the manager's department
    pending_shipment = [x for x in list(Shipment.objects.all()) if x.current_pos == department and x not in sending_shipment]

    # Convert shipment instances to JSON-like dictionaries
    response_data = {
        'coming_shipment': [x.to_json() for x in coming_shipment], 
        'outgoing_shipment': [x.to_json() for x in sending_shipment],
        'pending_shipment': [x.to_json() for x in pending_shipment]
    }

    return JsonResponse (
        response_data,
        status=status.HTTP_200_OK
    )
# --------------------------------------------------------------------------------
# Lãnh đạo
# --------------------------------------------------------------------------------
# Define a view function to list all departments
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsLeader])
def list_department(request):
    """
    Retrieve a list of all departments.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        JsonResponse: JSON response containing the list of departments.
    """
    department_list = list(Department.objects.all())
    response_data = {
        'department_list': [x.to_json() for x in department_list]
    }
    return JsonResponse(
        response_data,
        status=status.HTTP_200_OK
    )

# Define a view function to list all managers
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsLeader])
def list_manager(request):
    """
    Retrieve a list of all managers.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        JsonResponse: JSON response containing the list of managers.
    """
    manager_list = list(User.objects.filter(role='1'))
    response_data = {
        'manager_list': [x.to_json() for x in manager_list]
    }

    return JsonResponse(
        response_data,
        status=status.HTTP_200_OK
    )

# Define a view function to provide shipment statistics
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsLeader])
def shipment_statistic(request):
    """
    Retrieve shipment statistics categorized by departments.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        JsonResponse: JSON response containing shipment statistics.
    """
    department_list = list(Department.objects.all())
    response_data = {}

    # Initialize response_data dictionary with department names as keys
    for i in department_list:
        response_data[i.call_name()] = {
            'coming_shipment': [],
            'sending_shipment': [],
            'pending_shipment': []
        }

    # Get in-progress transactions and associated shipments
    inprogress_transaction = list(Transaction.objects.filter(status='In Progress'))  
    inprogress_customer_transaction = list(CustomerTransaction.objects.filter(status='In Progress'))
    inprogress_shipment = [x.shipment for x in inprogress_transaction + inprogress_customer_transaction]
    pending_shipment = [x for x in list(Shipment.objects.all()) if x not in inprogress_shipment]

    # Populate response_data with pending shipments
    for x in pending_shipment:
        department_name = x.current_pos.call_name()
        response_data[department_name]['pending_shipment'].append(x.to_json())

    # Populate response_data with incoming and outgoing shipments
    for trans, _shipment in zip(inprogress_transaction, inprogress_shipment):
        des = trans.des.call_name()
        pos = trans.pos.call_name()
        data = _shipment.to_json()
        response_data[pos]['sending_shipment'].append(data)
        response_data[des]['coming_shipment'].append(data)

    return JsonResponse(
        response_data, 
        status=status.HTTP_200_OK
    )
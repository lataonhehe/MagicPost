from rest_framework import serializers
from .models import Shipment,  Transaction

# Define a serializer for the Shipment model
class ShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = '__all__'

    def create(self, validated_data):
        """
        Create and return a new Shipment instance using the provided validated data.

        Args:
            validated_data (dict): Dictionary containing validated data for creating a new Shipment.

        Returns:
            Shipment: Newly created Shipment instance.
        """
        shipment = Shipment.objects.create(**validated_data)
        return shipment

# Define a serializer for the Transaction model
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

    def create(self, validated_data):
        """
        Create and return a new Transaction instance using the provided validated data.

        Args:
            validated_data (dict): Dictionary containing validated data for creating a new Transaction.

        Returns:
            Transaction: Newly created Transaction instance.
        """
        transaction = Transaction.objects.create(**validated_data)
        return transaction
    


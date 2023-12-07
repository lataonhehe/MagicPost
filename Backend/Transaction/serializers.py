from rest_framework import serializers
from .models import Shipment,  Transaction

class ShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = '__all__'

    def create(self, validated_data):
        shipment = Shipment.objects.create(**validated_data)
        return shipment
    
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

    def create(self, validated_data):
        transaction = Transaction.objects.create(**validated_data)
        return transaction
    


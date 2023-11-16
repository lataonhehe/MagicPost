# serializers.py
from rest_framework import serializers
from .models import Account

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['username', 'password', 'role', 'transaction_point', 'consolidation_point']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        account = Account.objects.create(
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data['role'],
            transaction_point=validated_data.get('transaction_point'),
            consolidation_point=validated_data.get('consolidation_point')
        )
        return account
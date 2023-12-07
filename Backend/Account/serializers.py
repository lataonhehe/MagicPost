from rest_framework import serializers
from .models import User, Department

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    department_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'department_id', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_department_id(self, value):
        department = Department.objects.filter(pk=value).first()
        if department is None:
            raise serializers.ValidationError("Department does not exist.")
            return False
        return True
    
    def is_valid(self, raise_exception=False):
        # Perform additional validation if needed
        is_valid = super().is_valid(raise_exception=raise_exception)

        # Check the custom validation result
        department_id_valid = self.validate_department_id(self.initial_data.get('department_id'))
        is_valid = is_valid and department_id_valid

        return is_valid

    def create(self, validated_data):
        department_id = validated_data.pop('department_id', None)

        # Validate department ID using the custom method
        if not self.validate_department_id(department_id):
            return False

        user = super().create(validated_data)

        if department_id is not None:
            department = Department.objects.get(pk=department_id)
            user.department = department
            user.save() 

        return True

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
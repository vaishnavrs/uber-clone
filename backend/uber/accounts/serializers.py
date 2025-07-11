from rest_framework import serializers
from accounts.models import User,DriverProfile



class SignUpSer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['phone','email','user_type']
        
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    


class OtpVerifySer(serializers.Serializer):
    phone = serializers.CharField(max_length=10)
    otp_input = serializers.CharField(max_length=4)

class LoginSer(serializers.Serializer):
    phone = serializers.CharField(max_length=10)


class DriverProfileSer(serializers.ModelSerializer):
    class Meta:
        model = DriverProfile
        fields = ['license_number','vehicle_registration_number']
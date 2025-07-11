from rest_framework import serializers



class PaasengerRideRequestSer(serializers.Serializer):
    # distance = serializers.FloatField()
    phone = serializers.CharField(max_length=10)
    source = serializers.JSONField()
    destination = serializers.JSONField()
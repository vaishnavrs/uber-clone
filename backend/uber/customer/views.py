from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import PaasengerRideRequestSer
from .utility import get_nearby_drivers
from accounts.models import RideRequest,User
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync



class CabRequestView(APIView):
    def post(self,request):
        ser_data = PaasengerRideRequestSer(data = request.data)
     
        if ser_data.is_valid():
            phone = ser_data.validated_data['phone']
            user = User.objects.get(phone=phone)
            # distance = ser_data.validated_data['distance']
            source = ser_data.validated_data['source']
            print(source)
            destination = ser_data.validated_data['destination']
            ride = RideRequest.objects.create(passenger=user,distance=10,
                                       pickup_lat=source['lat'],pickup_lng=source['longi'],
                                       destination_lat=destination['lat'],destination_lng=destination['longi'],
                                       )
            ride_id = ride.id
            drivers = get_nearby_drivers(source['lat'],source['longi'])
            print("drivers",drivers)

            channel_layer = get_channel_layer()
            for d_id in drivers:
                async_to_sync(channel_layer.group_send)(
                    f'driver_{d_id}',{
                        'type':'send_ride_request',
                        'data':{
                            'ride_id':ride_id,
                            'phone':phone,
                            'pickup':source,
                            'destination':destination,
                            'distance':10,
                            'passenger':user.name,
                            
                            'fare':100,
                        }
                    }
                )

            return Response({"msg":"request received","id":user.id},status=status.HTTP_200_OK)
        return Response({"msg":"failed"},status=status.HTTP_400_BAD_REQUEST)
    

        




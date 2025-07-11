from channels.consumer import AsyncConsumer
from channels.exceptions import StopConsumer
from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
from accounts.models import RideRequest,User,Ride
from channels.db import database_sync_to_async


class RideRequestConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        try:
            print('connected attempt')
            self.driver_id = self.scope['url_route']['kwargs']['driver_id']
            self.group_name = f'driver_{self.driver_id}'

            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            print('group added:', self.group_name)
            await self.accept()
            print('connection accepted')
        except Exception as e:
            print('WebSocket connection error:', str(e))
            await self.close()

    async def disconnect(self, close_code):
        print('disconnected')
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def send_ride_request(self, event):
        print('data is send to driver')
        await self.send_json(event['data'])


    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        
        if text_data_json.get('type') == 'driver_response':
            if text_data_json.get('response') == 'accept':
                ride_id = text_data_json.get('ride_id')
                driver_id = text_data_json.get('driver_id')
                fare = text_data_json.get('fare')

                if not all([ride_id, driver_id, fare]):
                    print("Missing ride_id, driver_id or fare")
                    return

                try:
                    ride = await database_sync_to_async(RideRequest.objects.get)(id=ride_id)

                    if ride.status == 'pending':
                        ride.status = 'accepted'
                        await database_sync_to_async(ride.save)()

                        try:
                            driver = await database_sync_to_async(User.objects.get)(id=driver_id)
                        except User.DoesNotExist:
                            print("Driver not found")
                            return

                    
                        passenger = await database_sync_to_async(lambda: ride.passenger)()
                        pickup_lat = ride.pickup_lat
                        pickup_lng = ride.pickup_lng
                        destination_lat = ride.destination_lat
                        destination_lng = ride.destination_lng
                        distance_km = ride.distance

                        # Create Ride instance
                        ride_instance = await database_sync_to_async(Ride.objects.create)(
                            passenger=passenger,
                            driver=driver,
                            pickup_lat=pickup_lat,
                            pickup_lng=pickup_lng,
                            destination_lat=destination_lat,
                            destination_lng=destination_lng,
                            distance_km=distance_km,
                            fare_amount=fare,
                            status='accepted'
                        )

                        print("Ride created successfully")

                        # Send ride details to passenger group
                        await self.channel_layer.group_send(
                            f"passenger_{passenger.id}",
                            {
                                "type": "notify_passenger",
                                "ride_id": ride_instance.id,
                                "pickup_lat": pickup_lat,
                                "pickup_lng": pickup_lng,
                                "destination_lat": destination_lat,
                                "destination_lng": destination_lng,
                                "driver_name": driver.name,
                                "fare": fare,
                                "status": 'accepted'
                            }
                        )
                    else:
                        print("Ride already accepted by another driver")

                except RideRequest.DoesNotExist:
                    print("Ride not found")



class PassengerConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.passenger_id = self.scope['url_route']['kwargs']['passenger_id']
        self.group_name = f'passenger_{self.passenger_id}'
        
        try:
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()
        except Exception as e:
            self.close()
    
    async def notify_passenger(self, event):
        await self.send_json({
            "type": "ride_update",
            "ride_id": event["ride_id"],
            "pickup_lat": event["pickup_lat"],
            "pickup_lng": event["pickup_lng"],
            "destination_lat": event["destination_lat"],
            "destination_lng": event["destination_lng"],
            "driver_name": event["driver_name"],
            "fare": event["fare"],
            "status": event["status"]
        })




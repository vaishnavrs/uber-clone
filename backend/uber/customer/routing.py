# customer/routing.py
from django.urls import path,re_path
from .consumers import RideRequestConsumer,PassengerConsumer

websocket_urlpatterns = [
    path("ws/ride-request/<str:driver_id>/", RideRequestConsumer.as_asgi()),
    re_path(r"ws/ride-response/(?P<passenger_id>\w+)/$", PassengerConsumer.as_asgi())

]

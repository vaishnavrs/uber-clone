from django.urls import path
from .views import CabRequestView

urlpatterns = [
    path('cab-request/',CabRequestView.as_view(),name='cab-request')
    
]
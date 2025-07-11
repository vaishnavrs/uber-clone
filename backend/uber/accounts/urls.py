from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('jtoken/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/',GenerateOtpView.as_view()),
    path('verify/',VerifyUser.as_view(),name='verfiy'),
    path('log-initiate/',LoginInitiateView.as_view(),name='initiate'),
    path('log-verify/',LoginVerificationView.as_view(),name='login'),
    path('driver-profile/',DriverProfileUpdateView.as_view(),name='driver_profile')
]
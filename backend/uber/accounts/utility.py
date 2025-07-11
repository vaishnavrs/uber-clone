import random
from rest_framework_simplejwt.tokens import RefreshToken
class GenerateOtp():
    def __init__(self):
        pass
    def generate():
        otp = random.randint(1000,9999)
        return otp
    

    def get_token_for_user(self,user):
        refresh = RefreshToken.for_user(user)
        return{
            'refresh' : str(refresh),
            'access' : str(refresh.access_token)
        }
    






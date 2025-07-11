from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import SignUpSer,OtpVerifySer,LoginSer,DriverProfileSer
from rest_framework import status
from .utility import GenerateOtp
from .models import User,Otp,DriverProfile
from rest_framework_simplejwt.authentication import JWTAuthentication




class GenerateOtpView(APIView):
    def post(self,request):
        serializer = SignUpSer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            otp = GenerateOtp.generate()
            print("signup otp",otp)
            if otp:
                user = User.objects.get(phone=serializer.validated_data['phone'])
                Otp.objects.create(user=user,otp_code = otp)
                return Response({"Message":"User created not validated "},status=status.HTTP_201_CREATED)
            return Response({"msg":"otp not generated"},status=status.HTTP_400_BAD_REQUEST)
        return Response({"error":serializer.errors},status=status.HTTP_400_BAD_REQUEST)




class VerifyUser(APIView):
    def post(self,request):
        serializer = OtpVerifySer(data = request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            otp_input = serializer.validated_data['otp_input']
            try:
                user = User.objects.get(phone=phone)
            except User.DoesNotExist:
                return Response({"msg":"User does not exist"},status=status.HTTP_404_NOT_FOUND)
            
            try:
                otp_obj = Otp.objects.filter(user=user).latest('created_at')
            except Otp.DoesNotExist:
                return Response({"msg":"otp not created"},status=status.HTTP_404_NOT_FOUND)
            
            if otp_obj.otp_code != otp_input:
                return Response({"Error":"Inavlid otp"},status=status.HTTP_400_BAD_REQUEST)
            
            if otp_obj.is_expired():
                User.objects.get(phone=phone).delete()
                return Response({"msg":"otp expired and user deleted"},status=status.HTTP_400_BAD_REQUEST)
            
            user.status = 'completed'
            user.save()
            tokens = GenerateOtp().get_token_for_user(user)
            return Response({
                "msg" : "signup completed",
                "tokens" : tokens
            },status=status.HTTP_200_OK)


class LoginInitiateView(APIView):
    def post(self,request):
        serializer = LoginSer(data = request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            try:
                user = User.objects.get(phone=phone)
                otp = GenerateOtp.generate()
                print("login otp",otp)
                if otp:
                    Otp.objects.create(user=user,otp_code = otp)
                    return Response({"msg":"otp generated"},status=status.HTTP_201_CREATED)
                return Response({"error":"otp generation failed"},status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                 return Response({"msg": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"error":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
            

class LoginVerificationView(APIView):
    def post(self, request):
        serializer = OtpVerifySer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            otp_input = serializer.validated_data['otp_input']

            try:
                user = User.objects.get(phone=phone)
                id = user.id
                user_type = user.user_type
            except User.DoesNotExist:
                return Response({"msg": "User not found"}, status=status.HTTP_404_NOT_FOUND)

            try:
                otp_obj = Otp.objects.filter(user=user).latest('created_at')
            except Otp.DoesNotExist:
                return Response({"msg": "OTP not found"}, status=status.HTTP_404_NOT_FOUND)


            if  otp_obj.is_expired():
                return Response({"msg": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)

            if otp_input != otp_obj.otp_code:
                return Response({"msg": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

            tokens = GenerateOtp().get_token_for_user(user)
            print('userid=',user.id)
            return Response({
                "msg": "Login successful",
                "tokens": tokens,
                'user_type':user_type,
                'id':id

            }, status=status.HTTP_200_OK)

        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)



class DriverProfileUpdateView(APIView):
    def post(self,request):
        ser = DriverProfileSer(data =request.data)
        if ser.is_valid():
            phone = request.data.get('phone')
            try:
                user = User.objects.get(phone=phone,user_type='driver')
                DriverProfile.objects.create(user=user,
                                             license_number=ser.validated_data['license_number'],
                                             vehicle_registration_number = ser.validated_data['vehicle_registration_number']
                                             )
                return Response({"msg":"profile updated"},status=status.HTTP_201_CREATED)
            except User.DoesNotExist:
                return Response({"msg":"user not found"},status=status.HTTP_404_NOT_FOUND)
        return Response({"msg":ser.errors},status=status.HTTP_400_BAD_REQUEST)   
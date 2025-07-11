from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.utils import timezone
from datetime import timedelta



class UserManager(BaseUserManager):
    
    def create_user(self, phone, user_type, **extra_fields):
        user = self.model(phone=phone, user_type=user_type, **extra_fields)
        user.set_unusable_password()
        user.save()
        return user

    def create_superuser(self, phone, user_type="admin", **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(phone, user_type, **extra_fields)



class User(AbstractBaseUser, PermissionsMixin):
    USER_TYPES = (
        ('passenger', 'Passenger'),
        ('driver', 'Driver'),
        ('admin', 'Admin'),
    )
    
    user_status = (
        ('pending','pending'),
        ('completed','completed')
    )

    phone = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPES)
    status = models.CharField(max_length=20,choices=user_status,default='pending')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['email', 'name', 'user_type']

    objects = UserManager()

    def __str__(self):
        return f"{self.name}"


class Otp(models.Model):
    otp_code = models.CharField(max_length=4)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=5)
    

class DriverProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'driver'})
    license_number = models.CharField(max_length=50, unique=True)
    vehicle_registration_number = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.user.name


class DriverCurrentLoc(models.Model):
    driver = models.ForeignKey( User,on_delete=models.CASCADE )
    latitude = models.FloatField()
    longitude = models.FloatField()
    updated_at = models.DateTimeField( auto_now= True)

    def __str__(self):
        return f"{self.driver.name}-{self.latitude},{self.longitude}"
    

class RideRequest(models.Model):
    passenger = models.ForeignKey(User,on_delete=models.CASCADE)
    distance = models.FloatField()
    pickup_lat = models.FloatField()
    pickup_lng = models.FloatField()
    destination_lat = models.FloatField()
    destination_lng = models.FloatField()
    RIDE_STATUS_CHOICES = (
        ('pending','pending'),
        ('accepted','accepted'),
        ('canceled','canceled')
    )
    status = models.CharField(max_length=20, choices=RIDE_STATUS_CHOICES, default='pending')


class Ride(models.Model):
    passenger = models.ForeignKey(User,on_delete=models.CASCADE,related_name='rides')
    driver = models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True,related_name='assigned_rides')
    pickup_lat = models.FloatField()
    pickup_lng = models.FloatField()
    destination_lat = models.FloatField()
    destination_lng = models.FloatField()
    distance_km = models.FloatField()
    fare_amount = models.DecimalField(max_digits=10,decimal_places=2)
    status = models.CharField(max_length=20,choices=[('requested','Reuqested'),('accpeted','Accepted')])
    created_at = models.DateTimeField(auto_now=True)
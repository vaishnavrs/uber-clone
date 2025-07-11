from geopy.distance import geodesic
from accounts.models import  DriverCurrentLoc

def get_nearby_drivers(pickup_lat, pickup_lng, radius_km=4):
    pickup_point = (pickup_lat, pickup_lng)
    nearby_drivers = []


    for location in DriverCurrentLoc.objects.select_related('driver'):
        driver = location.driver
        if driver.user_type != 'driver':
            continue

        driver_point = (location.latitude, location.longitude)
        distance = geodesic(pickup_point, driver_point).km
        if distance <= radius_km:
            nearby_drivers.append(driver.id)

    return nearby_drivers

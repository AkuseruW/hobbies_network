from fastapi import APIRouter
from geopy.geocoders import Nominatim
from pydantic import BaseModel
import requests

router = APIRouter(prefix="/api", tags=["geolocation"])

geolocator = Nominatim(user_agent="my_geocoder")

class Location(BaseModel):
    latitude: float
    longitude: float

@router.post("/detect-country/")
async def detect_city(location: Location):
    try:
        nominatim_url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={location.latitude}&lon={location.longitude}&zoom=10&addressdetails=1"
        response = requests.get(nominatim_url)
        data = response.json()
        city = data.get("address", {})
        return {"city": city}
    except Exception as e:
        return {"error": str(e)}
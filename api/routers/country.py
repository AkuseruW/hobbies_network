from fastapi import APIRouter
from geopy.geocoders import Nominatim
from pydantic import BaseModel
import requests

router = APIRouter(prefix="/api", tags=["geolocation"])
# Initialize a Nominatim geocoder with a user agent
geolocator = Nominatim(user_agent="my_geocoder")

class Location(BaseModel):
    latitude: float
    longitude: float


@router.post("/detect-country/")
async def detect_city(location: Location):
    try:
        # Build the Nominatim API URL with latitude and longitude
        nominatim_url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={location.latitude}&lon={location.longitude}&zoom=10&addressdetails=1"
        # Send a GET request to Nominatim to fetch location data
        response = requests.get(nominatim_url)
        data = response.json()
        # Extract the city information from the response data
        city = data.get("address", {})
        # Return the detected city
        return {"city": city}
    except Exception as e:
        return {"error": str(e)}

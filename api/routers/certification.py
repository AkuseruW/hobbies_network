from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from httpx import request

from dependencies.auth import get_current_active_user
import stripe

from dotenv import load_dotenv
import os

load_dotenv()
YOUR_DOMAIN = os.getenv("API_URL")
STRIPE_SECRET = os.getenv("STRIPE_SECRET")

router = APIRouter(prefix="/api", tags=["certification"])

stripe.api_key = STRIPE_SECRET


@router.post("/certification")
def create_certification():
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    "price": "price_1O35JtAdBPRBiTy5VrwSFzdI",
                    "quantity": 1,
                },
            ],
            mode="subscription",
            success_url=YOUR_DOMAIN + "?success=true&session_id={CHECKOUT_SESSION_ID}",
            cancel_url=YOUR_DOMAIN + "?canceled=true",
        )
        print(checkout_session.url)
        return {"checkout_url": checkout_session.url}       
    except Exception as e:
        print(e)
        return "Server error", 500

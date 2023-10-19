from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from httpx import request

from dependencies.auth import get_current_active_user
import stripe

from dotenv import load_dotenv
import os

load_dotenv()
YOUR_DOMAIN = os.getenv('API_URL')

router = APIRouter(
    prefix="/api", tags=["certification"]
)

Stripe_public = "pk_test_51MDxjEAdBPRBiTy5FvwJmzysA1ZLoY42rudTfxFGZwaoFbsYHFW2TpAMRVAbnRssDYnzAQBYrsLlfrrlqSEEG7jO00lZVWvJW9"
stripe_secret = "sk_test_51MDxjEAdBPRBiTy5oGSiNbySjt1NzaKvA1hAf94E6gwa0thQmV0GqzBZGmf4T9x2iPabz9YFvhRujL0futnfakZa00X51Zwl8b"

stripe.api_key = stripe_secret

@router.post("/certification")
def create_certification():
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    'price': "price_1O35JtAdBPRBiTy5VrwSFzdI",
                    'quantity': 1,
                },
            ],
            mode='subscription',
            success_url=YOUR_DOMAIN +
            '?success=true&session_id={CHECKOUT_SESSION_ID}',
            cancel_url=YOUR_DOMAIN + '?canceled=true',
        )
        return RedirectResponse(checkout_session.url, status_code=303) 
    except Exception as e:
        print(e)
        return "Server error", 500

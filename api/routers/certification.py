from fastapi import APIRouter, Depends, Header, Request
from dependencies.auth import get_current_active_user
import stripe
from sqlalchemy.orm import Session
from models import Subscription, User
from settings.database import get_session


from dotenv import load_dotenv
import os


load_dotenv()
YOUR_DOMAIN = os.getenv("CLIENT_URL")
STRIPE_SECRET = os.getenv("STRIPE_SECRET")

router = APIRouter(prefix="/api", tags=["certification"])

stripe.api_key = STRIPE_SECRET


@router.post("/certification")
def create_certification(current_user: User = Depends(get_current_active_user)):
    try:
        user_email = current_user.email
        user_id = current_user.id 
        
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    "price": "price_1O3R1rAdBPRBiTy51xgyDOaO",
                    "quantity": 1,
                },
            ],
            mode="subscription",
            success_url=YOUR_DOMAIN + "?success=true&session_id={CHECKOUT_SESSION_ID}",
            cancel_url=YOUR_DOMAIN + "?canceled=true",
            customer_email=user_email 
        )
        
        checkout_session.metadata = {
            "user_id": str(user_id)
        }

        checkout_session.url_options = {
            "customer_email": {
                "editable": False
            }
        }

        return {"checkout_url": checkout_session.url}       
    except Exception as e:
        print(e)
        return "Server error", 500


# def create_subscription(
#     db: Session,
#     user_id: int,
#     subscription_id: str,
#     current_period_start,
#     current_period_end
# ):
#     subscription = Subscription(
#         user_id=user_id,
#         subscription_id=subscription_id,
#         current_period_start=current_period_start,
#         current_period_end=current_period_end
#     )
#     db.add(subscription)
#     db.commit()
#     db.refresh(subscription)
#     return subscription

@router.post("/webhook")
async def webhook_received(request: Request, stripe_signature: str = Header(), db: Session = Depends(get_session)):
    endpoint_secret = 'whsec_DxJhwmxows8xhOcCUL7aPH0XnIfRwG6L'
    payload  = await request.body()
    try:
        event = stripe.Webhook.construct_event(
            payload,
            sig_header=stripe_signature, 
            secret=endpoint_secret
        )
    except stripe.error.SignatureVerificationError as e:
    # La signature n'a pas pu être vérifiée
        print("Signature verification failed:", str(e))
    except Exception as e:
        print(e)
        return e

    # Get the type of webhook event sent - used to check the status of PaymentIntents.
    event_type = event['type']
    data = event['data']['object']

    if event_type == 'checkout.session.completed':
        print('🔔 Payment succeeded!')
    # elif event_type == 'invoice.payment_succeeded':
    #     print(data)
    #     user_email = data.get('customer_email')
    #     invoice_pdf = data.get('invoice_pdf')
    #     user = db.query(User).filter(User.email == user_email).first()
    #     lines = data['lines']['data'][0]
    #     current_period_start = datetime.utcfromtimestamp(lines['period']['start'])
    #     current_period_end = datetime.utcfromtimestamp(lines['period']['end'])
    #     create_subscription(
    #         db,
    #         user.id,
    #         data.get('subscription'),
    #         current_period_start=current_period_start,
    #         current_period_end=current_period_end,
    #     )
        
    #     user.is_certified = True
    #     db.commit()
        
    elif event_type == 'customer.subscription.updated':
        cancellation_reason = event.data.object.cancellation_details.get("reason")
        if cancellation_reason == "cancellation_requested":
            print('Subscription created %s', event.id)
        
    if event.type == "customer.subscription.created":
        print('sub', data)

        
    elif event_type == 'customer.subscription.deleted':
        print('Subscription canceled: %s', event.id)
        subscription_id = data.get('id')
        print(subscription_id)
        user_email = data.get('customer_email')
        user = db.query(User).filter(User.email == user_email).first()

        if user:
            user.is_certified = False
            
            db.commit()
        

    return {'status': 'success'}


@router.post('/create-portal-session')
def create_portal_session(db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    user = db.query(User).filter(User.id == current_user.id).first()

    if not user.subscriptions:
        # Handle the case where the user has no subscriptions or the subscription does not exist
        return {"error": "No subscriptions found for the user."}

    # Retrieve the subscription ID from the user's subscriptions
    subscription_id = user.subscriptions[0].subscription_id

    # Retrieve the Checkout Session associated with the subscription
    checkout_session = stripe.Subscription.retrieve(subscription_id)

    return_url = YOUR_DOMAIN

    portalSession = stripe.billing_portal.Session.create(
        customer=checkout_session.customer,
        return_url=return_url,
    )
    print("\t", portalSession.url)
    return {"url": portalSession.url}

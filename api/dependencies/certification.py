from models import Subscription,StatusChoice
from sqlalchemy.orm import Session


def create_subscription(
    db: Session,
    user_id: int,
    subscription_id: str,
    current_period_start,
    current_period_end
):
    # Create a new Subscription object with the provided details
    subscription = Subscription(
        user_id=user_id,
        subscription_id=subscription_id,
        status= StatusChoice.active,
        current_period_start=current_period_start,
        current_period_end=current_period_end
    )
    # Add the new subscription to the database
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    return subscription

def cancel_subscription(
    db: Session,
    subscription_id: str
):
    # Query the subscription by its subscription_id
    subscription = db.query(Subscription).filter(Subscription.subscription_id == subscription_id).first()
    # Update the subscription status to "canceled"
    subscription.status = StatusChoice.canceled
    # Commit the changes to the database
    db.commit()
    return subscription
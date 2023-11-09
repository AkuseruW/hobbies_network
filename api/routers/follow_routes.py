from fastapi import HTTPException, Depends, APIRouter, Request
from typing import List
from models import User, Follower, Notification
from sqlalchemy.orm import Session
from settings.database import get_session
from dependencies.auth import get_current_active_user
from models.schemas.userSchemas import PublicUserData
from sockets import ws_manager

router = APIRouter(
    prefix="/api", tags=["follow"], dependencies=[Depends(get_current_active_user)]
)


@router.post("/follow_or_unfollow_user/{user_id}")
async def follow_or_unfollow_user(
    user_id: int,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    try:
        # Fetch the user to follow/unfollow
        user_to_follow = db.query(User).filter_by(id=user_id).first()

        if not user_to_follow:
            raise HTTPException(status_code=404, detail="User not found.")

        # Check if the user is already being followed
        existing_follower = (
            db.query(Follower)
            .filter_by(follower_id=current_user.id, following_id=user_id)
            .first()
        )

        if existing_follower:
            # If the user is already followed, unfollow
            db.delete(existing_follower)
            db.commit()
            return {"message": "You have unfollowed this user."}
        else:
            # If the user is not followed, follow
            follower = Follower(follower_id=current_user.id, following_id=user_id)

            notification = Notification(
                title="Follow",
                sender_id=current_user.id,
                receiver_id=user_to_follow.id,
                content=f"{current_user.user_name} vous a follow",
            )

            db.add_all([follower, notification])
            db.commit()
            db.refresh(notification)
            
            notification_ws = {
                "action": "notification",
                "data": {
                    "id": notification.id,
                    "title": notification.title,
                    "content": notification.content,
                    "message_room_id": notification.message_room_id,
                    "is_read": notification.is_read,
                    "user": {
                        "id": notification.sender.id,
                        "first_name": notification.sender.firstname,
                        "last_name": notification.sender.lastname,
                        "profile_picture": notification.sender.profile_picture
                    }
                }
            }
            # Send a notification using WebSockets
            await ws_manager.send_notification(notification=notification_ws, receiver_id=user_to_follow.id)

            return {"message": "You have followed this user."}

    except HTTPException as he:
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="An error occurred while updating the follow status.",
        )
    finally:
        db.close()


@router.get("/following", response_model=List[PublicUserData])
async def get_following(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
):
    current_user = db.query(User).get(current_user.id)
    return current_user.following_list


@router.get("/followers", response_model=List[PublicUserData])
async def get_followers(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
):
    current_user = db.query(User).get(current_user.id)
    return current_user.followers_list

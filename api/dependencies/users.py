from dependencies.mailer import send_mail
from models import Ban, User
from models.schemas.userSchemas import UserRead
from typing import Dict, List
from sqlalchemy.orm import Session
from dependencies.uploads import upload_image_to_cloudinary
from datetime import datetime, timedelta
from sqlalchemy import or_, func


def get_total_pages(total_items: int, items_per_page: int) -> int:
    return total_items + items_per_page - 1


def filter_query_by_search(query, search):
    # Check if a search term is provided
    if search:
        # Create a search pattern with '%' as wildcards to match any characters before and after the search term.
        search_term = f"%{search}%"
        # Construct a filter condition using the SQLAlchemy 'ilike' operator to perform case-insensitive search.
        query = query.filter(
            or_(
                User.firstname.ilike(search_term),
                User.lastname.ilike(search_term),
                func.concat(User.firstname, " ", User.lastname).ilike(search_term),
            )
        )
    return query


def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_users(
    db: Session, skip: int = 0, limit: int = 100, exclude_user: User = None
) -> List[UserRead]:
    users = db.query(User).offset(skip).limit(limit).all()
    return [UserRead.from_orm(user) for user in users]


async def set_up_profile(user_data, current_user: UserRead, db: Session):
    # Get the user by email from the database
    user = get_user_by_email(db, current_user.email)
    # Check if the user exists
    if user:
        # Get the profile picture from the user data
        profile_picture = user_data.get("profile_picture")
        # If a profile picture is provided, upload it to Cloudinary
        if profile_picture:
            file = await upload_image_to_cloudinary(
                file=profile_picture, directory="profil"
            )
            # Update the user's profile picture and public ID

            user.profile_picture = file["secure_url"]
            user.public_id = file["public_id"]
        else:
            # If no profile picture is provided, use a default image URL
            user.profile_picture = "https://res.cloudinary.com/dsvvipx0f/image/upload/v1694564364/hobbies_profil/userprofile_dnwymx.png"

        # Update user information from the provided data
        user.firstname = user_data.get("firstname")
        user.lastname = user_data.get("lastname")
        user.bio = user_data.get("bio")

        db.commit()
        db.refresh(user)

        return user


MESSAGE_UNBAN = "Vous avez été débanni. Bienvenue de nouveau !"


async def unban_users(db: Session):
    now = datetime.utcnow()
    # Query all bans that have expired
    unban = db.query(Ban).filter(Ban.expires_at <= now).all()

    # Iterate through the expired bans
    for ban in unban:
        db.delete(ban)
        send_mail(email=ban.user.email, subject="Unban", message=MESSAGE_UNBAN)

    db.commit()

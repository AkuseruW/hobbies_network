from models import User
from models.schemas.userSchemas import UserRead
from typing import Dict, List
from sqlalchemy.orm import Session
from settings.database import engine, redis_client
from dependencies.uploads import upload_image_to_cloudinary


def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100, exclude_user: User = None) -> List[UserRead]:
    users = db.query(User).offset(skip).limit(limit).all()
    return [UserRead.from_orm(user) for user in users]


async def set_up_profile(user_data, current_user: UserRead, db: Session):
    user = get_user_by_email(db, current_user.email)
    if user:
        profile_picture = user_data.get("profile_picture")
        if profile_picture:
            file = await upload_image_to_cloudinary(file=profile_picture, directory="profil")
            user.profile_picture = file["secure_url"]
            user.public_id = file["public_id"]
        else:
            user.profile_picture = 'https://res.cloudinary.com/dsvvipx0f/image/upload/v1694564364/hobbies_profil/userprofile_dnwymx.png'

        user.firstname = user_data.get('firstname')
        user.lastname = user_data.get('lastname')
        user.bio = user_data.get('bio')

        db.commit()
        db.refresh(user)

        return user

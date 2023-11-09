import json
from typing import Optional, List, Union

from dependencies.uploads import upload_image_to_cloudinary, delete_image
from models import User, UserToHobby, Post, Follower, Ban
from models.schemas.userSchemas import (
    ReadAllUsersResponse,
    UserProfileSetupResponse,
    UserRead,
    PublicUserData,
    PrivateUserData,
)
from settings.database import get_session
from dependencies.auth import get_current_active_user
from sqlalchemy.orm import Session
from dependencies.users import filter_query_by_search, set_up_profile, unban_users
from fastapi.encoders import jsonable_encoder
from dependencies.auth import get_current_user
from fastapi.security import OAuth2PasswordBearer
from fastapi import APIRouter, Depends, Request, Query, HTTPException
from sqlalchemy import desc
from dependencies.post import create_post_info_dict
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
import asyncio
from dependencies.mailer import send_mail

router = APIRouter(
    prefix="/api", tags=["users"], dependencies=[Depends(get_current_user)]
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


@router.get("/users")
def read_users(
        page: int = Query(1, description="page"),
        per_page: int = Query(10, description="per_page"),
        search: str = Query(None, description="search"),
        db: Session = Depends(get_session),
        current_user: User = Depends(get_current_active_user),
):
    per_page = 10
    skip = (page - 1) * per_page
    query = db.query(User).filter(User.id != current_user.id)
    query = filter_query_by_search(query, search)

    users = query.offset(skip).limit(per_page).all()
    current_user = db.query(User).filter(User.id == current_user.id).one_or_none()
    users_with_status = []
    for user in users:
        if user.firstname is not None or user.lastname is not None:
            user_data = PublicUserData(
                id=user.id,
                firstname=user.firstname,
                lastname=user.lastname,
                profile_picture=user.profile_picture,
                is_certified=user.is_certified,
                bio=user.bio,
            )
            users_with_status.append(user_data)
    
        
    # check if the end of the list
    total_users = query.count() - 1
    is_end_of_list = (page * per_page) >= total_users

    return {"users": users_with_status, "is_end_of_list": is_end_of_list}



@router.get("/all-users", response_model=ReadAllUsersResponse)
def read_all_users(
        page: int = Query(1, description="Page number"),
        search: str = Query(None, description="search"),
        query: str = Query(None, description="q"),
        db: Session = Depends(get_session),
        current_user: User = Depends(get_current_active_user),
):
    limit = 10
    skip = (page - 1) * limit
    query_filter = query
    
    query = db.query(User)
    query = filter_query_by_search(query, search)
    
    if query_filter and current_user.role.value == "ROLE_ADMIN":
        if query_filter == "certified":
            query = query.filter(User.is_certified == True)
        elif query_filter == "banned":
            query = query.filter(User.bans.any())
    else:
        HTTPException(status_code=403, detail="You are not authorized to perform this action.")

    total_users = query.count()
    total_pages = (total_users + limit - 1) // limit

    users = query.offset(skip).limit(limit).all()

    users_with_status = []

    for user in users:
        if all((user.firstname, user.lastname, user.profile_picture)):
            user_data = PrivateUserData(
                id=user.id,
                bio=user.bio,
                firstname=user.firstname,
                lastname=user.lastname,
                user_name=user.user_name,
                email=user.email,
                role=user.role,
                profile_picture=user.profile_picture,
                is_certified=user.is_certified,
                is_banned=user.is_banned,
            )
            users_with_status.append(user_data)

    return {
        "users": users_with_status,
        "total_users": total_users,
        "total_pages": total_pages,
    }


@router.get("/user/{user_id}", response_model=None)
async def get_user_by_id(
        user_id: int,
        page: int = 1,
        db: Session = Depends(get_session),
        current_user: User = Depends(get_current_active_user),
):
    # Retrieve the user from the database based on user_id
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        # If the user is not found, raise an HTTP 404 Not Found exception
        raise HTTPException(status_code=404, detail="User not found")

    # Check if the current user is following the user
    is_following = (
            db.query(Follower)
            .filter(
                Follower.follower_id == current_user.id, Follower.following_id == user.id
            )
            .first()
            is not None
    )

    # Pagination
    per_page = 10
    offset = (page - 1) * per_page

    # Get the user's posts
    posts_query = db.query(Post).filter(Post.user_id == user_id)
    total_posts = posts_query.count()
    posts = (
        posts_query.order_by(desc(Post.created_at))
        .slice(offset, offset + per_page)
        .all()
    )
    # Determine which posts the user has liked
    liked_post_ids = {post.id for post in user.liked_posts}
    # Extract the user's hobbies and related counts
    hobbies = [hobby.hobby for hobby in user.hobbies]
    count_hobbies = len(hobbies)
    count_followers = len(user.followers_list)
    count_following = len(user.following_list)
    
    # Prepare user information with posts
    user_with_posts = {
        "user": UserRead(**jsonable_encoder(user)),
        "is_following": is_following,
        "total_posts": total_posts,
        "hobbies": hobbies,
        "count_hobbies": count_hobbies,
        "count_followers": count_followers,
        "count_following": count_following,
        "posts": []
        if not posts
        else [create_post_info_dict(post, liked_post_ids) for post in posts],
    }

    return user_with_posts


@router.post("/user/add_or_delete_hobby/{hobby_id}", response_model=None)
async def add_or_delete_hobby(
        hobby_id: int,
        db: Session = Depends(get_session),
        current_user: User = Depends(get_current_active_user),
):
    # Check if the user already has this hobby
    existing_relationship = (
        db.query(UserToHobby)
        .filter(
            UserToHobby.user_id == current_user.id, UserToHobby.hobby_id == hobby_id
        )
        .first()
    )

    if existing_relationship:
        # If the relationship exists, delete it
        db.delete(existing_relationship)
    else:
        # If the relationship does not exist, add it
        user_hobby = UserToHobby(user_id=current_user.id, hobby_id=int(hobby_id))
        db.add(user_hobby)

    db.commit()

    return {"success": True}


@router.post("/ban_user/{user_id}/{duration}", response_model=None)
async def ban_user(
        user_id: int,
        duration: int,
        request: Request,
        db: Session = Depends(get_session),
        current_user: User = Depends(get_current_active_user),
):
    if current_user.user_role != "ROLE_ADMIN":
        # Check if the user is an admin
        raise HTTPException(
            status_code=403, detail="Vous n'êtes pas autorisé à effectuer cette action."
        )

    # Check if the duration of the ban is at least 1 day (1440 minutes)
    if duration < 1440:
        raise HTTPException(
            status_code=400,
            detail="La durée du bannissement doit être supérieure à 1 minute",
        )

    # Parse the request body to get the ban reason
    request_body = await request.body()
    request_data = json.loads(request_body)
    ban_reason = request_data.get("reason")

    # Query the user to be banned from the database
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    # Check if the user is already banned
    existing_ban = (
        db.query(Ban)
        .filter(Ban.user_id == user_id, Ban.expires_at > datetime.utcnow())
        .first()
    )
    # Create a new ban or update an existing one
    ban_duration_days = duration // 1440

    message = f"{user.firstname} {user.lastname} a été banni pour {ban_reason}. Votre compte sera désactivé pour une durée de {ban_duration_days} jours."

    # Update an existing ban or create a new one
    if existing_ban:
        existing_ban.ban_duration_minutes = duration
        existing_ban.ban_reason = ban_reason
        existing_ban.expires_at = datetime.utcnow() + timedelta(minutes=duration)
    else:
        new_ban = Ban(
            user_id=user.id,
            ban_duration_minutes=duration,
            ban_reason=ban_reason,
            banned_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(minutes=duration),
        )
        db.add(new_ban)
        send_mail(email=user.email, subject="Ban", message=message)

    db.commit()
    return {"message": "Utilisateur banni"}


@router.patch("/users/setup", response_model=UserProfileSetupResponse)
async def setup_user_profile(
        request: Request,
        db: Session = Depends(get_session),
        current_user: User = Depends(get_current_active_user),
):
    # Get the form data and extract the first name, last name, bio, and profile picture
    form_data = await request.form()
    first_name = form_data.get("firstName")
    last_name = form_data.get("lastName")
    bio = form_data.get("bio")
    hobbies = form_data.getlist("hobbies")
    profile_picture = form_data.get("profile_picture")

    user_data = {
        "firstname": first_name,
        "lastname": last_name,
        "bio": bio,
        "hobbies": hobbies,
        "profile_picture": profile_picture,
    }
    # Update the user's profile
    user_updated = await set_up_profile(user_data, current_user, db)

    # Update the user's hobbies
    user_hobbies = [
        UserToHobby(user_id=user_updated.id, hobby_id=int(hobby_id))
        for hobby_id in hobbies
    ]
    db.add_all(user_hobbies)
    db.commit()

    user_dict = {
        "id": current_user.id,
        "email": current_user.email,
        "firstname": user_updated.firstname,
        "lastname": user_updated.lastname,
        "profile_picture": user_updated.profile_picture,
        "role": current_user.user_role,
    }

    return user_dict


@router.patch("/users/update-profile", response_model=None)
async def update_user_profile_data(request: Request, db: Session = Depends(get_session),
                                   current_user: User = Depends(get_current_active_user)):
    profile_data = await request.body()
    json_data = json.loads(profile_data)
    bio = json_data.get("bio")
    firstname = json_data.get("firstname")
    lastname = json_data.get("lastname")

    # Check if the user exists
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not firstname or not lastname:
        raise HTTPException(status_code=400, detail="Les données de profil ne sont pas valides")

    # Update the user's profile
    user.bio = bio if bio else ""
    user.firstname = firstname
    user.lastname = lastname
    db.commit()

    user_info = {
        "id": user.id,
        "firstname": user.firstname,
        "lastname": user.lastname,
        "profile_picture": user.profile_picture,
        "role": user.user_role,
    }

    return {"success": True, "user_info": user_info}


@router.patch("/users/update-profile-picture", response_model=None)
async def change_profile_picture(
        request: Request, db: Session = Depends(get_session),
        current_user: User = Depends(get_current_active_user),
):
    form_data = await request.form()
    profile_picture = form_data.get("file")
    
    #  Check if the user exists
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete the old profile picture
    await delete_image(user.public_id)
    # Upload the new profile picture
    file = await upload_image_to_cloudinary(
        file=profile_picture, directory="profil"
    )

    # Update the user's profile picture and public ID
    user.profile_picture = file["secure_url"]
    user.public_id = file["public_id"]

    db.commit()
    db.refresh(user)

    return {"success": True, "profile_picture": user.profile_picture}


@router.delete("/unban_user/{user_id}", response_model=None)
async def unban_user(
        user_id: int,
        db: Session = Depends(get_session),
        current_user: User = Depends(get_current_active_user),
):
    if current_user.user_role != "ROLE_ADMIN":
        raise HTTPException(
            status_code=403, detail="Vous n'êtes pas autorisé à effectuer cette action."
        )
    # Query the ban record for the user
    ban = db.query(Ban).filter(Ban.user_id == user_id).first()

    if not ban:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    db.delete(ban)
    db.commit()
    messageUnban = "Vous avez été débanni. Bienvenue de nouveau !"
    send_mail(email=ban.user.email, subject="Unban", message=messageUnban)

    return {"message": "Utilisateur unban"}

#  Define a scheduler to schedule the unban process
scheduler = BackgroundScheduler() 
scheduler.start()


# Define a function to schedule the unban process at regular intervals
def schedule_unban_users():
    db = next(get_session())
    asyncio.run(unban_users(db))


# Schedule the unban process to run every 360 minutes (6 hours)
# scheduler.add_job(schedule_unban_users, "interval", minutes=360)
scheduler.add_job(schedule_unban_users, "cron", hour="0-1", minute=0)

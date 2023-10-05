import json
from models import User, UserToHobby, Post, Follower, Ban
from models.schemas.userSchemas import UserRead, UpdateProfile, PublicUserData, PrivateUserData
from settings.database import get_session
from dependencies.auth import get_current_active_user
from sqlalchemy.orm import Session
from dependencies.users import set_up_profile
from fastapi.encoders import jsonable_encoder
from dependencies.auth import get_current_user
from fastapi.security import OAuth2PasswordBearer
from fastapi import APIRouter, Depends, Request, Query, HTTPException
from sqlalchemy import desc
from sqlalchemy import or_, func
from dependencies.post import create_post_info_dict
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
import asyncio
from dependencies.mailer import send_mail

router = APIRouter(
    prefix="/api", tags=["users"], dependencies=[Depends(get_current_user)])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")



def get_total_pages(total_items: int, items_per_page: int) -> int:
    return (total_items + items_per_page - 1)


def filter_query_by_search(query, search):
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                User.firstname.ilike(search_term),
                User.lastname.ilike(search_term),
                func.concat(User.firstname, ' ',
                            User.lastname).ilike(search_term)
            )
        )
    return query


@router.get("/users", response_model=dict)
def read_users(page: int = Query(1, description="page"),
               per_page: int = Query(10, description="per_page"),
               search: str = Query(None, description="search"),
               db: Session = Depends(get_session),
               current_user: User = Depends(get_current_active_user)) -> dict:
    per_page = 10
    skip = (page - 1) * per_page

    query = db.query(User).filter(User.id != current_user.id)
    query = filter_query_by_search(query, search)

    users = query.offset(skip).limit(per_page).all()

    current_user = db.query(User).filter(
        User.id == current_user.id).one_or_none()
    current_user_hobbies = set([hobby.hobby for hobby in current_user.hobbies])
    users_with_status = []
    for user in users:
        if user.firstname is not None or user.lastname is not None:
            user_hobbies = set([hobby.hobby for hobby in user.hobbies])
            common_hobbies = current_user_hobbies.intersection(user_hobbies)
            common_hobbies_count = len(
                current_user_hobbies.intersection(user_hobbies))
            user_data = PublicUserData(
                id=user.id,
                firstname=user.firstname,
                lastname=user.lastname,
                profile_picture=user.profile_picture,
                is_certified=user.is_certified,
                hobbies=common_hobbies,
                common_hobbies_count=common_hobbies_count,
                bio=user.bio,
            )
            users_with_status.append(user_data)

    return {"users": users_with_status}


@router.get("/all-users", response_model=dict)
def read_all_users(
    page: int = Query(1, description="Page number"),
    search: str = Query(None, description="search"),
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
) -> dict:
    limit = 10
    skip = (page - 1) * limit

    query = db.query(User)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                User.firstname.ilike(search_term),
                User.lastname.ilike(search_term),
                func.concat(User.firstname, ' ',
                            User.lastname).ilike(search_term)
            )
        )

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
                is_banned=user.is_banned
            )
            users_with_status.append(user_data)

    return {"users": users_with_status, "total_users": total_users, "total_pages": total_pages}


@router.patch("/users/setup", response_model=None)
async def setup_user_profile(
    request: Request,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    form_data = await request.form()
    first_name = form_data.get('firstName')
    last_name = form_data.get('lastName')
    bio = form_data.get('bio')
    hobbies = form_data.getlist('hobbies')
    profile_picture = form_data.get('profile_picture')

    user_data = {
        'firstname': first_name,
        'lastname': last_name,
        'bio': bio,
        'hobbies': hobbies,
        'profile_picture': profile_picture
    }

    user_updated = await set_up_profile(user_data, current_user, db)

    user_hobbies = [UserToHobby(user_id=user_updated.id, hobby_id=int(
        hobby_id)) for hobby_id in hobbies]
    db.add_all(user_hobbies)
    db.commit()

    user_dict = {
        "id": current_user.id,
        "email": current_user.email,
        "firstname": user_updated.firstname,
        "lastname": user_updated.lastname,
        "profile_picture": user_updated.profile_picture,
        "role": current_user.user_role
    }

    return user_dict


@router.get("/user/{user_id}", response_model=None)
async def get_user_by_id(user_id: int, page: int = 1, db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):

    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if the current user is following the user
    is_following = db.query(Follower).filter(
        Follower.follower_id == current_user.id,
        Follower.following_id == user.id
    ).first() is not None

    # Pagination
    per_page = 10
    offset = (page - 1) * per_page

    # Get the user's posts
    posts_query = db.query(Post).filter(Post.user_id == user_id)
    total_posts = posts_query.count()
    posts = posts_query.order_by(desc(Post.created_at)).slice(
        offset, offset + per_page).all()
        
    liked_post_ids = {post.id for post in user.liked_posts}
    
    hobbies = [hobby.hobby for hobby in user.hobbies]

    user_with_posts = {
        "user": UserRead(**jsonable_encoder(user)),
        "is_following": is_following,
        "total_posts": total_posts,
        "hobbies": hobbies,
        "posts": [] if not posts else [create_post_info_dict(post, liked_post_ids) for post in posts]
    }

    return user_with_posts


@router.post("/user/add_or_delete_hobby/{hobby_id}", response_model=None)
async def add_or_delete_hobby(hobby_id: int, db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    # Check if the user already has this hobby
    existing_relationship = db.query(UserToHobby).filter(
        UserToHobby.user_id == current_user.id,
        UserToHobby.hobby_id == hobby_id
    ).first()

    if existing_relationship:
        # If the relationship exists, delete it
        db.delete(existing_relationship)
    else:
        # If the relationship does not exist, add it
        user_hobby = UserToHobby(
            user_id=current_user.id, hobby_id=int(hobby_id))
        db.add(user_hobby)

    db.commit()
    
    return {"success": True}


@router.patch("/users/update-profile", response_model=None)
async def update_user_profile_data(
        profile_data: UpdateProfile,
        db: Session = Depends(get_session),
        current_user: User = Depends(get_current_active_user)
):
    # Check if the user exists
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update the user's profile
    user.bio = profile_data.bio
    user.firstname = profile_data.firstname
    user.lastname = profile_data.lastname
    db.commit()

    user_info = {
        "id": user.id,
        "firstname": user.firstname,
        "lastname": user.lastname,
        "profile_picture": user.profile_picture,
        "role": user.user_role
    }

    return user_info


@router.post("/ban_user/{user_id}/{duration}", response_model=None)
async def ban_user(user_id: int, duration: int, request: Request, db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    if current_user.user_role != "ROLE_ADMIN":
        raise HTTPException(
            status_code=403, detail="Vous n'êtes pas autorisé à effectuer cette action.")

    # Check if the duration of the ban is at least 1 day (1440 minutes)
    if duration < 1440:
        raise HTTPException(
            status_code=400, detail="La durée du bannissement doit être supérieure à 1 minute")

    # Parse the request body to get the ban reason
    request_body = await request.body()
    request_data = json.loads(request_body)
    ban_reason = request_data.get("reason")

    # Query the user to be banned from the database
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    # Check if the user is already banned
    existing_ban = db.query(Ban).filter(
        Ban.user_id == user_id,
        Ban.expires_at > datetime.utcnow()
    ).first()

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
            expires_at=datetime.utcnow() + timedelta(minutes=duration)
        )
        db.add(new_ban)
        send_mail(email=user.email, subject="Ban", message=message)

    db.commit()
    return {"message": "Utilisateur banni"}


messageUnban = "Vous avez été débanni. Bienvenue de nouveau !"


@router.delete("/unban_user/{user_id}", response_model=None)
async def unban_user(user_id: int, db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):

    if current_user.user_role != "ROLE_ADMIN":
        raise HTTPException(
            status_code=403, detail="Vous n'êtes pas autorisé à effectuer cette action.")

    # Query the ban record for the user
    ban = db.query(Ban).filter(Ban.user_id == user_id).first()

    if not ban:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    db.delete(ban)
    db.commit()

    send_mail(email=ban.user.email, subject="Unban", message=messageUnban)

    return {"message": "Utilisateur unban"}


async def unban_users(db: Session):
    now = datetime.utcnow()
    # Query all bans that have expired
    unban = db.query(Ban).filter(Ban.expires_at <= now).all()

    # Iterate through the expired bans
    for ban in unban:
        db.delete(ban)
        send_mail(email=ban.user.email, subject="Unban", message=messageUnban)

    db.commit()


scheduler = BackgroundScheduler()
scheduler.start()

# Define a function to schedule the unban process at regular intervals
def schedule_unban_users():
    db = next(get_session())
    asyncio.run(unban_users(db))


# Schedule the unban process to run every 360 minutes (6 hours)
# scheduler.add_job(schedule_unban_users, "interval", minutes=360)
scheduler.add_job(schedule_unban_users, "cron", hour='0-1', minute=0)


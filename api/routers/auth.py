from datetime import datetime, timedelta
import json
import random
import string
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm
import stripe
from models.ResetPassword import PasswordReset

from settings.database import get_session
from dependencies.auth import (
    get_current_active_user,
    verify_password,
    create_user_info,
    github_callback,
    google_callback,
    authenticate_user,
    create_access_token,
    get_password_hash,
)
from models import Post, User, Role, LikesTable
from dependencies.mailer import send_mail
from models.schemas.userSchemas import (
    SignInRequest,
    Token,
    GetSession,
    UserIn,
    UserCreated,
)
from models.schemas.authSchemas import UserUpdatePassword
from starlette.responses import RedirectResponse
from dotenv import load_dotenv
import os

load_dotenv()

github_client = os.getenv("GITHUB_CLIENT")
github_secret = os.getenv("GITHUB_SECRET")
google_client = os.getenv("GOOGLE_CLIENT")
google_secret = os.getenv("GOOGLE_SECRET")
STRIPE_SECRET = os.getenv("STRIPE_SECRET")


router = APIRouter(prefix="/api/auth", tags=["auth"])

ACCESS_TOKEN_EXPIRE_MINUTES = 43200
access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
github_client_id = github_client
github_client_secret = github_secret
SCOPE = "https://www.googleapis.com/auth/userinfo.email"
REDIRECT_URI = "http://localhost:3000/connexion/callback"
stripe.api_key = STRIPE_SECRET


@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Check if the user exists
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"email": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/signin", response_model=None)
def login_for_access_token(signin_request: SignInRequest):
    # Check if the user exists
    user = authenticate_user(signin_request.email, signin_request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if user.bans:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Votre compte a été banni",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(
        data={"email": user.email}, expires_delta=access_token_expires
    )
    # Create user info
    user_info = create_user_info(user, access_token)
    return user_info


@router.get("/users/me")
def read_users_me(db: Session = Depends(get_session),current_user: User = Depends(get_current_active_user)):
    current_user = db.query(User).get(current_user.id)
    # Check if the user is banned
    if current_user.is_banned:
        raise HTTPException(status_code=401, detail="Your account is banned.")
    
    has_subscription = bool(current_user.subscriptions)
    
    user_session = {
        "id": current_user.id,
        "email": current_user.email,
        "firstname": current_user.firstname,
        "lastname": current_user.lastname,
        "profile_picture": current_user.profile_picture,
        "bio": current_user.bio,
        "has_subscription": has_subscription
    }

    return {"status_code": 200, "detail": "Sucess", "data": user_session}


@router.post("/signup")
async def sign_up(user_data: UserIn, session: Session = Depends(get_session)):
    email = user_data.email
    password = user_data.password

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required.")

    # Check if the email already exists
    existing_user = session.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already exists.")

    hashed_password = get_password_hash(password)
    new_user = User(email=email, password=hashed_password)
    # Set default role
    new_user.role = Role.ROLE_USER

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # Send an email
    send_mail(email=new_user.email, subject="Bienvenu sur hobbies", message="Bonjour !")

    return {
        "status_code": 201, 
        "detail": "User created successfully", 
        "user": UserCreated(id=new_user.id, email=new_user.email, role=new_user.role.value)
    }


@router.patch("/update-password")
async def update_password(
    request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
):
    data = await request.body()
    data = json.loads(data)

    current_password = data.get("current_password")
    new_password = data.get("new_password")
    
    user = db.query(User).get(current_user.id)
    
    # Check if the current password is correct
    if not verify_password(current_password, user.password):
        raise HTTPException(status_code=400, detail="Mot de passe incorrect")

    # Update the user's password
    hashed_password = get_password_hash(new_password)
    user.password = hashed_password
    db.commit()

    return {"detail": "Mot de passe mis a jour"}


@router.get("/login/github")
async def login_github():
    authorize_url = (
        f"https://github.com/login/oauth/authorize?client_id={github_client_id}"
    )
    return RedirectResponse(authorize_url, status_code=302)


@router.get("/login/google")
async def google_auth():
    authorize_url = f"https://accounts.google.com/o/oauth2/v2/auth?scope={SCOPE}&redirect_uri={REDIRECT_URI}&response_type=code&client_id={google_client}"
    return RedirectResponse(authorize_url, status_code=302)


@router.get("/callback_github")
async def login_github_callback(code: str, db: Session = Depends(get_session)):
    params = {
        "client_id": github_client_id,
        "client_secret": github_client_secret,
        "code": code,
        "scope": "user:email",
    }

    user = await github_callback(params, db)

    access_token = create_access_token(
        data={"git_id": user.github_id}, expires_delta=access_token_expires
    )

    user_info = create_user_info(user, access_token)

    return user_info


@router.get("/callback_google")
async def login_google_callback(code: str, db: Session = Depends(get_session)):
    data = {
        "code": code,
        "client_id": google_client,
        "client_secret": google_secret,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    user = await google_callback(data, db)
    access_token = create_access_token(
        data={"email": user.email}, expires_delta=access_token_expires
    )

    user_info = create_user_info(user, access_token)
    return user_info


@router.delete("/delete_account", response_model=None)
def delete_user_with_posts_and_likes(
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    user_to_delete = db.query(User).get(current_user.id)
    
    # Delete all subscriptions associated with the user
    subscription_id = user_to_delete.subscription_id
    if subscription_id:
        stripe.Subscription.delete(subscription_id)
    
    # Delete all likes associated with the user
    db.query(LikesTable).filter(LikesTable.user_id == user_to_delete.id).delete(synchronize_session=False)

    # Delete all posts associated with the user
    db.query(Post).filter(Post.user_id == user_to_delete.id).delete(synchronize_session=False)

    # Delete user
    db.delete(current_user)
    db.commit()

    return {"message": "Utilisateur supprimé avec succès."}

@router.post("/forgot_password", response_model=None)
async def forgot_password(request: Request, db: Session = Depends(get_session)):
    data = await request.body()
    data = json.loads(data)
    email = data.get("email")

    user = db.query(User).filter_by(email=email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    token_already_exists = db.query(PasswordReset).filter_by(email=email).first()
    
    if token_already_exists:
        db.delete(token_already_exists)
        db.commit()

    # Generate a reset token and set the expiration time
    reset_token = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(32))
    expiration = datetime.utcnow() + timedelta(hours=1)
    
    # Save the reset token in the database
    token = PasswordReset(
        email=email,
        token=reset_token,
        reset_token_expiration=expiration,
        user_id=user.id
    )
    
    db.add(token)
    db.commit()
    
    # Send the email
    send_mail(email=user.email, subject="Mot de passe oublie", message=f"Cliquez sur ce lien pour reinitialiser votre mot de passe : http://localhost:3000/forgot-password/{reset_token}")

    return {"message": "Password reset email sent"}

@router.post("/reset_password", response_model=None)
async def reset_password(request: Request, db: Session = Depends(get_session)):
    data = await request.body()
    data = json.loads(data)
    token = data.get("token")
    new_password = data.get("password")
    
    # Check if the token is valid
    password_reset = db.query(PasswordReset).filter_by(token=token).first()
    if not password_reset or password_reset.reset_token_expiration < datetime.utcnow() or password_reset != token:
        raise HTTPException(status_code=400, detail="Le token est invalide ou a expiré")

    user = db.query(User).filter_by(id=password_reset.user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update the user's password
    user.password = get_password_hash(new_password)

    # Delete the password reset token
    db.delete(password_reset)
    db.commit()

    return {"detail": "Mot de passe mis à jour avec succes"}
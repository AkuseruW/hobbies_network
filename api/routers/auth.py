from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm

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
from models import User, Role
from dependencies.mailer import send_mail
from models.schemas.userSchemas import SignInRequest, Token, GetSession, UserIn, UserCreated
from models.schemas.authSchemas import UserUpdatePassword
from starlette.responses import RedirectResponse
from dotenv import load_dotenv
import os

load_dotenv()

github_client = os.getenv('GITHUB_CLIENT')
github_secret = os.getenv('GITHUB_SECRET')
google_client = os.getenv('GOOGLE_CLIENT')
google_secret = os.getenv('GOOGLE_SECRET')

router = APIRouter(prefix="/api/auth", tags=["auth"])

ACCESS_TOKEN_EXPIRE_MINUTES = 43200
access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
github_client_id = github_client
github_client_secret = github_secret
SCOPE = 'https://www.googleapis.com/auth/userinfo.email'
REDIRECT_URI = 'http://localhost:3000/connexion/callback'


@router.post("/token", response_model=Token)
def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends()
):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"email": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/signin", response_model=None)
def login_for_access_token(
        signin_request: SignInRequest
):
    user = authenticate_user(signin_request.email, signin_request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"email": user.email}, expires_delta=access_token_expires
    )
    user_info = create_user_info(user, access_token)
    return user_info


@router.get("/users/me", response_model=GetSession)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    user = GetSession(
        id=current_user.id,
        firstname=current_user.firstname,
        lastname=current_user.lastname,
        profile_picture=current_user.profile_picture)
    return user


@router.post("/signup", response_model=UserCreated)
def sign_up(user_data: UserIn, session: Session = Depends(get_session)):
    email = user_data.email
    password = user_data.password

    if not email or not password:
        raise HTTPException(
            status_code=400, detail="Email and password are required.")

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
    
    send_mail(email=new_user.email, subject='Bienvenu sur hobbies', message='Bonjour !')

    return UserCreated(
        id=new_user.id,
        email=new_user.email,
        role=new_user.role.value
    )


@router.patch("/update-password", response_model=None)
async def update_password(
    password_data: UserUpdatePassword,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session)
):
    user = db.query(User).get(current_user.id)
    # Check if the current password is correct
    if not verify_password(password_data.current_password, user.password):
        raise HTTPException(
            status_code=400, detail="Current password is incorrect")

    # Update the user's password
    hashed_password = get_password_hash(password_data.new_password)
    user.password = hashed_password
    db.commit()

    return {"message": "Password updated successfully"}


@router.get("/login/github")
async def login_github():
    authorize_url = f"https://github.com/login/oauth/authorize?client_id={github_client_id}"
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
        'code': code,
        'client_id': google_client,
        'client_secret': google_secret,
        'redirect_uri': REDIRECT_URI,
        'grant_type': 'authorization_code'
    }

    user = await google_callback(data, db)
    access_token = create_access_token(
        data={"email": user.email}, expires_delta=access_token_expires
    )

    user_info = create_user_info(user, access_token)
    return user_info

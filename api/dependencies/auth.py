from typing import Optional
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
import httpx
from dependencies.mailer import send_mail


from settings.database import engine
from models import User

from dotenv import load_dotenv
import os

load_dotenv()
secret_key = os.getenv('SECRET_KEY')
algorithm = os.getenv('ALGORITHM')

SECRET_KEY = secret_key
ALGORITHM = algorithm

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(email: str, password: str):
    # Authenticate a user by querying the database for the provided email
    with Session(engine) as session:
        results = session.query(User).filter(User.email == email)
        user = results.first()
        # Check if the user exists and the password is valid
        if not user or not verify_password(password, user.password):
            return None

        return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    # Create an access token based on the provided user data and optional expiration time
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    # Encode the JWT token with the provided data and return it
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(token: str = Depends(oauth2_scheme)):
    # Define an exception to handle credentials validation errors
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decode the JWT token and extract email and GitHub ID if available
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: Optional[str] = payload.get("email")
        git_id: Optional[int] = payload.get("git_id")

        if email is None and git_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    with Session(engine) as session:
        query = session.query(User)
        # Query the user based on email or GitHub ID
        if email:
            user = query.filter(User.email == email).first()
        elif git_id:
            user = query.filter(User.github_id == git_id).first()

        if user is None:
            raise credentials_exception

    return user


def get_current_active_user(current_user: User = Depends(get_current_user)):
    return current_user


def create_user_info(user, access_token):
    return {
        "token": access_token,
        "token_type": "bearer",
        "id": user.id,
        "firstname": user.firstname,
        "lastname": user.lastname,
        "profile_picture": user.profile_picture,
        "role": user.user_role
    }


async def github_callback(params, db):
    headers = {"Accept": "application/json"}
    async with httpx.AsyncClient() as client:
        response = await client.post(url="https://github.com/login/oauth/access_token", params=params, headers=headers)
        access_token = response.json()["access_token"]
        headers.update({"Authorization": f"Bearer {access_token}"})
        response = await client.get("https://api.github.com/user", headers=headers)
        data = response.json()
        
        user = db.query(User).filter(User.email == data["email"]).first()

        if user:
            return user

        else:
            if data["email"]:
                new_user = User(email=data["email"])

                db.add(new_user)
                db.commit()
                db.refresh(new_user)

                return new_user
            else:
                raise HTTPException(status_code=404, detail="Impossible de récupérer l'utilisateur")


async def google_callback(data, db):
    # Create an asynchronous HTTP client using httpx
    async with httpx.AsyncClient() as client:
        # Send a POST request to the Google OAuth token endpoint with the provided data
        response = await client.post('https://oauth2.googleapis.com/token', data=data)
        response_data = response.json()
        # Check if the response contains an 'access_token'
        if 'access_token' in response_data:
            # Prepare headers with the access token for making authorized requests
            headers = {
                "Authorization": f"Bearer {response_data['access_token']}"}
            req_uri = 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json'
            # Send an authorized GET request to fetch user information from Google
            async with httpx.AsyncClient() as client:
                response = await client.get(req_uri, headers=headers)
                data = response.json()
                
                # Query the database for a user with the same email
                user = db.query(User).filter(
                    User.email == data['email']).first()
                if user:
                    # If the user exists, return the user
                    return user
                else:
                    # If the user doesn't exist, create a new user with the email
                    new_user = User(email=data["email"])

                    db.add(new_user)
                    db.commit()
                    db.refresh(new_user)

                    return new_user

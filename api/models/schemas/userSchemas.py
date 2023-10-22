from typing import Optional, List, Union
from pydantic import BaseModel
from models.User import Role


class UserIn(BaseModel):
    email: str
    password: str

    class Config:
        orm_mode = True


class UserCreated(BaseModel):
    id: int
    email: str
    role: str

    class Config:
        orm_mode = True


class UserRead(BaseModel):
    id: int
    firstname: Optional[str]
    lastname: Optional[str]
    email: Optional[str]
    profile_picture: Optional[str]
    is_certified: bool
    bio: Optional[str]

    class Config:
        orm_mode = True


class SignInRequest(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class GetSession(BaseModel):
    id: str
    email: str
    firstname: str
    lastname: str
    bio: Optional[str]
    profile_picture: Optional[str]


class SetSession(GetSession):
    token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class PublicUserData(BaseModel):
    id: int
    firstname: str
    lastname: str
    profile_picture: str
    is_certified: Optional[Union[bool, int, str]]

    class Config:
        orm_mode = True


class PrivateUserData(PublicUserData):
    user_name: str
    email: str
    role: Role
    is_banned: Optional[Union[bool, int, str]]

    class Config:
        orm_mode = True


class UpdateProfile(BaseModel):
    bio: Optional[str]
    firstname: str
    lastname: str


class UserListResponse(BaseModel):
    id: int
    firstname: str
    lastname: str
    profile_picture: str
    is_certified: bool
    bio: Optional[str]


class ReadAllUsersResponse(BaseModel):
    users: List[PrivateUserData]
    total_users: int
    total_pages: int


class UserProfileSetupResponse(BaseModel):
    id: int
    email: str
    firstname: str
    lastname: str
    profile_picture: str
    role: str

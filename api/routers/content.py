from fastapi import APIRouter, Depends
from dependencies.auth import get_current_active_user
from models import User
from models.schemas.userSchemas import UserRead

router = APIRouter(
    prefix="/api", tags=["users"], dependencies=[Depends(get_current_active_user)]
)


@router.get("/profile", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    user = UserRead(
        id=current_user.id,
        username=current_user.email,
        email=current_user.email,
        firstname=current_user.firstname,
        lastname=current_user.lastname,
        profile_picture=current_user.profile_picture,
    )
    return user

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from models.Notification import AdminNotification
from settings.database import get_session
from models import Hobby, Post, User, Report
from dependencies.auth import get_current_active_user

router = APIRouter(
    prefix="/api", tags=["dashboard"], dependencies=[Depends(get_current_active_user)]
)

@router.get("/dashboard")
def dashboard(db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    # Check if the current user has admin role
    if current_user.role.value != "ROLE_ADMIN":
        HTTPException(
            status_code=403, detail="You are not authorized to perform this action."
        )
 
    users = db.query(User).count()
    posts = db.query(Post).count()
    hobbies = db.query(Hobby).count()
    admin_notifications = db.query(AdminNotification).filter(AdminNotification.is_read == False).count()
    reports = db.query(Report).filter(Report.is_read == False).count()
        
    return {
        "users": users,
        "posts": posts,
        "hobbies": hobbies,
        "adminNotifications": admin_notifications,
        "reports": reports
    }
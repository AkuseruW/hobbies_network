from typing import Dict, List, Union
from fastapi import APIRouter, HTTPException, Depends, Request, Query
from sqlalchemy.orm import Session
from models import Notification
from models.Notification import AdminNotification
from models.schemas.notifications_schemas import AdminNotificationSchema, NotificationSchema
from settings.database import get_session
from models import User, Report
from dependencies.auth import get_current_active_user


router = APIRouter(
    prefix="/api", tags=["Notifications"], dependencies=[Depends(get_current_active_user)])


class ReportsQueryParams:
    def __init__(self, page: int = Query(1, description="page"), per_page: int = Query(10, description="per_page"), search: str = Query(None, description="search")):
        self.page = page
        self.per_page = per_page
        self.search = search

@router.get("/admin_notifications", response_model=Dict[str, Union[List[AdminNotificationSchema], int]])
def read_admin_notifications(params: ReportsQueryParams = Depends(), db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):

    # Check if the current user has the "ROLE_ADMIN"
    if current_user.role.value != "ROLE_ADMIN":
        raise HTTPException(
            status_code=403, detail="You are not authorized to perform this action.")

    offset = (params.page - 1) * params.per_page
    total_notifications = db.query(AdminNotification).count()
    total_pages = (total_notifications + params.per_page - 1) // params.per_page
    
    # Ensure that the page parameter is within valid bounds
    if params.page < 1:
        params.page = 1
    elif params.page > total_pages:
        return {"notifications": [], "totalPages": total_pages}

    count_new_notifications = db.query(AdminNotification).filter_by(is_read=False).count()
    # Query for admin notifications that are not marked as read
    admin_notifications = db.query(AdminNotification).filter_by(is_read=False).offset(offset).limit(params.per_page).all()

    admin_notifications_data = []
    for notification in admin_notifications:
        admin_notification_data = {
            "id": notification.id,
            "content": notification.content,
            "is_read": notification.is_read,
            "timestamp": notification.timestamp,
            "notification_type": notification.notification_type,
            "report_id": notification.report_id,
            "user": {
                "id": notification.sender.id,
                "first_name": notification.sender.firstname,
                "last_name": notification.sender.lastname,
                "profile_picture": notification.sender.profile_picture
            }
        }
        admin_notifications_data.append(admin_notification_data)


    return {"notifications": admin_notifications_data, "count_new_notifications": count_new_notifications, "totalPages": total_pages}


@router.get("/notifications", response_model=Dict[str, Union[List[NotificationSchema], int]])
def read_notifications(params: ReportsQueryParams = Depends(), db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    
    offset = (params.page - 1) * params.per_page
    total_notifications = db.query(Notification).count()
    total_pages = (total_notifications + params.per_page - 1) // params.per_page
    
    # Ensure that the page parameter is within valid bounds
    if params.page < 1:
        params.page = 1
    elif params.page > total_pages:
        return {"notifications": [], "totalPages": total_pages}

    count_new_notifications = db.query(Notification).filter_by(receiver_id=current_user.id, is_read=False).count()
     
    # Query for admin notifications that are not marked as read
    notifications = db.query(Notification).filter_by(receiver_id=current_user.id, is_read=False).offset(offset).limit(params.per_page).all() 
    
    notifications_data = []
    for notification in notifications:
        admin_notification_data = {
            "id": notification.id,
            "content": notification.content,
            "is_read": notification.is_read,
            "timestamp": notification.timestamp,
            "notification_type": notification.notification_type,
            "user": {
                "id": notification.sender.id,
                "first_name": notification.sender.firstname,
                "last_name": notification.sender.lastname,
                "profile_picture": notification.sender.profile_picture
            }
        }
        notifications_data.append(admin_notification_data)
    
    return {"notifications": notifications_data, "count_new_notifications": count_new_notifications, "totalPages": total_pages}


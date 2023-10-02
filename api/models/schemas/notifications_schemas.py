from datetime import datetime
from uuid import UUID
from pydantic import BaseModel

class UserSchema(BaseModel):
    id: int
    first_name: str
    last_name: str
    profile_picture: str

class NotificationSchema(BaseModel):
    id: int
    content: str
    is_read: bool
    timestamp: datetime
    user: UserSchema

    class Config:
        orm_mode = True


class AdminNotificationSchema(NotificationSchema):
    notification_type: str
    report_id: int
    
    class Config:
        orm_mode = True

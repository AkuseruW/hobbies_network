from datetime import datetime
from sqlalchemy import Boolean, CheckConstraint, Column, Integer, ForeignKey, String, Text, DateTime
from settings.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    message_room_id = Column(UUID(as_uuid=True), nullable=True)
    content = Column(Text)
    is_read = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    receiver = relationship("User", back_populates="received_notifications", foreign_keys=[receiver_id])
    sender = relationship("User", back_populates="sent_notifications", foreign_keys=[sender_id])
    
    __table_args__ = (
        CheckConstraint(title.in_(['Follow', 'Like', 'Comment', 'Message'])),
    )

    @property
    def sender_full_name(self):
        return f"{self.sender.first_name} {self.sender.last_name}"
    
    @property
    def sender_profile_picture(self):
        return f"{self.sender.profile_picture}"

class AdminNotification(Base):
    __tablename__ = "admin_notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    is_read = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    notification_type = Column(String)
    report_id = Column(Integer)
    report_id_post = Column(UUID(as_uuid=True), nullable=True)
    report_id_user = Column(Integer, nullable=True)
    
    __table_args__ = (
        CheckConstraint(notification_type.in_(['reports', 'requests'])),
    )
    
    sender = relationship("User", back_populates="sent_admin_notifications", foreign_keys=[sender_id])

    @property
    def firstname(self):
        return self.sender.firstname

    @property
    def lastname(self):
        return self.sender.lastname
    
    @property
    def profile_picture(self):
        return f"{self.sender.profile_picture}"
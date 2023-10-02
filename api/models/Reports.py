import enum
from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime, Enum, CheckConstraint, String,Boolean
from sqlalchemy.orm import relationship
from settings.database import Base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

class ReportType(enum.Enum):
    POST = 'POST'
    USER = 'USER'

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    reported_id = Column(UUID(as_uuid=True), nullable=False)
    reported_type = Column(Enum(ReportType))
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=func.now())
    reason = Column(String)
    content = Column(Text)
    is_read = Column(Boolean, default=False)
    is_pinned = Column(Boolean, default=False)
    is_process = Column(Boolean, default=False)
    
    __table_args__ = (
        CheckConstraint(reported_type.in_(['POST', 'USER'])),
    )

    user = relationship("User", back_populates="reports")

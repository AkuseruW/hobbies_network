from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from settings.database import Base
from enum import Enum
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy.schema import UniqueConstraint
from sqlalchemy import Enum as SQLAlchemyEnum


class StatusChoice(str, Enum):
    active = "active"
    canceled = "canceled"
    incomplete = "incomplete"
    incomplete_expired = "incomplete_expired"
    past_due = "past_due"
    unpaid = "unpaid"


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True, unique=True)
    subscription_id = Column(String, unique=True, nullable=False)
    status = Column(SQLAlchemyEnum(StatusChoice, native_enum=False), nullable=False)
    current_period_start = Column(DateTime, nullable=True)
    current_period_end = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="subscriptions")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'subscription_id', name='unique_user_subscription'),
    )

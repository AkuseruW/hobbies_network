from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from settings.database import Base


class Ban(Base):
    __tablename__ = "bans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    ban_duration_minutes = Column(Integer)
    ban_reason = Column(Text)
    banned_at = Column(DateTime)
    expires_at = Column(DateTime)

    user = relationship("User", back_populates="bans", lazy="joined")

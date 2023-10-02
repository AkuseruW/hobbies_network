from sqlalchemy import Column, Integer, ForeignKey, Boolean
from settings.database import Base
from sqlalchemy.orm import relationship

class Status(Base):
    __tablename__ = "status"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    vip = Column(Boolean, default=False)
    certification = Column(Boolean, default=False)
    second_sess = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="status",  uselist=False)

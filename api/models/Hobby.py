from sqlalchemy import Column, ForeignKey, Integer, String, Text, Boolean
from sqlalchemy.orm import relationship
from settings.database import Base


class UserToHobby(Base):
    __tablename__ = "users_to_hobbies"

    user_id = Column(ForeignKey("users.id"), primary_key=True, nullable=False)
    hobby_id = Column(ForeignKey("hobbies.id"), primary_key=True, nullable=False)

    user = relationship("User", back_populates="hobbies")
    hobby = relationship("Hobby", back_populates="users")
    @property
    def first_name(self):
        return self.user.firstname

    @property
    def last_name(self):
        return self.user.lastname

    @property
    def profile_picture(self):
        return self.user.profile_picture

class Hobby(Base):
    __tablename__ = "hobbies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    public_id_black = Column(String, unique=True, nullable=False)
    public_id_white = Column(String, unique=True, nullable=False)
    icone_black = Column(String)
    icone_white = Column(String)
    description = Column(Text)
    slug = Column(String, unique=True, nullable=False)

    users = relationship("UserToHobby", back_populates="hobby", cascade="all, delete-orphan")
    posts = relationship("Post", back_populates="hobby")



class ProposedHobby(Base):
    __tablename__ = "proposed_hobbies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    is_approved = Column(Boolean, default=False)

    user = relationship("User", back_populates="proposed_hobbies")
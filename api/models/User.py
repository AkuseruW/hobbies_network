import enum
from sqlalchemy import Column, Integer, String, Text, Enum, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from settings.database import Base
from sqlalchemy.dialects.postgresql import UUID
from models.Follower import Follower


class LikesTable(Base):
    __tablename__ = "likes_table"

    post_id = Column(UUID(as_uuid=True), ForeignKey(
        "posts.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)


class Role(enum.Enum):
    ROLE_USER = 'ROLE_USER'
    ROLE_ADMIN = 'ROLE_ADMIN'
    ROLE_MODERATOR = 'ROLE_MODERATOR'


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    firstname = Column(String)
    lastname = Column(String)
    email = Column(String, unique=True, index=True)
    github_id = Column(Integer, unique=True, nullable=True)
    google_id = Column(String, unique=True, nullable=True)
    password = Column(String)
    bio = Column(Text)
    profile_picture = Column(String, nullable=True)
    public_id = Column(String, unique=True, nullable=True)
    role = Column(Enum(Role), default=Role.ROLE_USER)
    is_certified = Column(Boolean, default=False)
    
    bans = relationship("Ban", back_populates="user", cascade="all, delete-orphan")
    hobbies = relationship("UserToHobby", back_populates="user", cascade="all, delete-orphan")
    posts = relationship("Post", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")
    
    sent_notifications = relationship("Notification", back_populates="sender", foreign_keys="Notification.sender_id", cascade="all, delete-orphan")
    received_notifications = relationship("Notification", back_populates="receiver", foreign_keys="Notification.receiver_id", cascade="all, delete-orphan")
    sent_admin_notifications = relationship("AdminNotification", back_populates="sender", foreign_keys="AdminNotification.sender_id", cascade="all, delete-orphan")
    liked_posts = relationship("Post", secondary=LikesTable.__table__, viewonly=True, cascade="all, delete-orphan")
    
    sent_messages = relationship("ChatRoom", back_populates="user_a", foreign_keys='ChatRoom.user_a_id')
    received_messages = relationship("ChatRoom", back_populates="user_b", foreign_keys='ChatRoom.user_b_id')
    messages=relationship("MessageHistory", back_populates="user", foreign_keys="MessageHistory.user_id")
    
    followers = relationship("Follower", foreign_keys=[Follower.following_id], back_populates="following", lazy="dynamic", cascade="all, delete-orphan")
    following = relationship("Follower", foreign_keys=[Follower.follower_id], back_populates="follower", lazy="dynamic", cascade="all, delete-orphan")
    
    proposed_hobbies = relationship("ProposedHobby", back_populates="user", cascade="all, delete-orphan")


    @property
    def user_name(self):
        return f"{self.firstname} {self.lastname}"

    @property
    def user_hobbies(self):
        return self.hobbies

    @property
    def user_role(self):
        return self.role.value

    @property
    def followers_list(self):
        return [follower.follower for follower in self.followers]

    @property
    def following_list(self):
        return [following.following for following in self.following]

    @property
    def is_following(self, user):
        return user in self.following.all()

    @property
    def is_banned(self):
        return bool(self.bans)



from sqlalchemy import Column, ForeignKey, Integer, String, Text, DateTime, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from settings.database import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    content = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    hobby_id = Column(ForeignKey("hobbies.id"), nullable=True)
    
    hobby = relationship("Hobby", back_populates="posts")
    likes = relationship("User", secondary="likes_table", overlaps="liked_posts")
    user = relationship("User", back_populates="posts")
    post_images = relationship("PostImage", back_populates="post")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")

    @property
    def post_images_urls(self):
        return [image.url for image in self.post_images]

    def user_name(self):
        return f"{self.user.firstname} {self.user.lastname}"
    
    def is_certified(self):
        return self.user.is_certified

    def user_profile_picture(self):
        return f"{self.user.profile_picture}"

    def total_comments(self):
        return len(self.comments)
    
    def total_likes(self):
        return len(self.likes)

    def add_like(self, user):
        if user not in self.likes:
            self.likes.append(user)

    def remove_like(self, user):
        if user in self.likes:
            self.likes.remove(user)
            
    @property
    def userHasLiked(self, current_user):
        return any(like.id == current_user.id for like in self.likes)


class PostImage(Base):
    __tablename__ = "post_images"

    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(String, unique=True, nullable=False) 
    url = Column(String)
    width = Column(Integer)
    height = Column(Integer)
    post_id = Column(UUID(as_uuid=True), ForeignKey("posts.id"), nullable=True)

    post = relationship("Post", back_populates="post_images")

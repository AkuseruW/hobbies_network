from datetime import datetime
from sqlalchemy import UUID, Column, Integer, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from settings.database import Base


class ChatRoom(Base):
    __tablename__ = "chat_room"

    id = Column(Integer, primary_key=True, index=True)
    room_uuid = Column(UUID(as_uuid=True), unique=True, index=True)
    user_a_id = Column(Integer, ForeignKey('users.id'))
    user_b_id = Column(Integer, ForeignKey('users.id'))

    user_a = relationship(
        "User", back_populates="sent_messages", foreign_keys=[user_a_id])
    user_b = relationship(
        "User", back_populates="received_messages", foreign_keys=[user_b_id])
    message_history = relationship("MessageHistory", back_populates="chat_room")


class MessageHistory(Base):
    __tablename__ = "message_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    message_id = Column(Integer, ForeignKey('chat_room.id'))
    timestamp = Column(DateTime, default=datetime.utcnow)
    content = Column(Text)

    chat_room = relationship("ChatRoom", back_populates="message_history")
    user = relationship("User", back_populates="messages")


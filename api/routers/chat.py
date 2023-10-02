import json
import uuid
from models import User, ChatRoom, MessageHistory
from fastapi import HTTPException, Request, APIRouter, Depends, WebSocket
from dependencies.auth import get_current_active_user
from sockets import ws_manager
from sqlalchemy.orm import Session
from settings.database import get_session

router = APIRouter(prefix="/api")


@router.get("/conversations/start/{user_id}", response_model=None)
def start_conversation(user_id: int, db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    conversation = db.query(ChatRoom).filter(
        (
            (ChatRoom.user_a_id == user_id) & (
                ChatRoom.user_b_id == current_user.id)
        ) | (
            (ChatRoom.user_a_id == current_user.id) & (
                ChatRoom.user_b_id == user_id)
        )
    ).first()

    if conversation:
        # Convert the UUID to string before returning
        return str(conversation.room_uuid)

    # Generate a new UUID for the conversation room
    room_uuid = uuid.uuid4()

    new_conversation = ChatRoom(
        room_uuid=str(room_uuid),
        user_a_id=current_user.id,
        user_b_id=user_id
    )
    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)

    return str(room_uuid)


@router.get("/conversations/{room_uuid}", response_model=None)
def get_conversation(room_uuid: str, db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    conversation = db.query(ChatRoom).filter(
        ChatRoom.room_uuid == room_uuid).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    message_history = db.query(MessageHistory).filter(
        MessageHistory.message_id == conversation.id).all()

    return message_history


@router.post("/conversations/{room_uuid}/message", response_model=None)
async def send_message(
    room_uuid: str,
    request: Request,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)):
    
    data = await request.json()
    content = data.get("content")
    conversation = db.query(ChatRoom).filter(
        ChatRoom.room_uuid == room_uuid).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    user_a = conversation.user_a
    user_b = conversation.user_b
    

    if current_user.id == user_a.id:
        sender = user_a
        receiver = user_b
    elif current_user.id == user_b.id:
        sender = user_b
        receiver = user_a
    else:
        raise HTTPException(status_code=403, detail="Current user is not part of this conversation")
    
    message = MessageHistory(
        message_id=conversation.id,
        user_id=current_user.id,
        content=content,
        chat_room=conversation
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    message_ws = {
        "type": "message",
        "data": {
            "content": content,
            "sender_id": current_user.id
        }
    }

    await ws_manager.send_personal_message(message_ws, sender.id, receiver.id)
    return

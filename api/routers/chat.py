import json
import uuid
from models import User, ChatRoom, MessageHistory
from fastapi import HTTPException, Request, APIRouter, Depends, WebSocket
from dependencies.auth import get_current_active_user
from sockets import ws_manager
from sqlalchemy.orm import Session
from settings.database import get_session

router = APIRouter(prefix="/api")


@router.get("/conversations/start/{user_id}")
def start_conversation(user_id: int, db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    # Find the user by their ID
    user = db.query(User).filter(User.id == user_id).first()

    # Check if the user exists, return a 404 error if not
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if a conversation already exists between the two users
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

    # Create a new conversation with the generated UUID
    new_conversation = ChatRoom(
        room_uuid=str(room_uuid),
        user_a_id=current_user.id,
        user_b_id=user_id
    )
    # Add the new conversation to the database, commit, and refresh
    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)

    return str(room_uuid)


@router.get("/conversations/{room_uuid}")
def get_conversation(room_uuid: str, db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    # Fetch the conversation by its room_uuid
    conversation = db.query(ChatRoom).filter(
        ChatRoom.room_uuid == room_uuid).first()
    
    # Check if the conversation exists, return a 404 error if not
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Check if the current user is one of the participants in the conversation
    if current_user.id not in [conversation.user_a.id, conversation.user_b.id]:
        raise HTTPException(status_code=403, detail="Access denied")
        
    # Fetch the message history for the conversation
    message_history = db.query(MessageHistory).filter(
        MessageHistory.message_id == conversation.id).all()
    
    # Create a list to store the messages with user info
    messages_with_user_info = []
    
    for message in message_history:
        # Get user information for the sender of the message
        sender_user = message.user
        
        # Create a dictionary with message and user info
        message_with_user = {
            "content": message.content,
            "sender_id": sender_user.id,
            "sender_name": sender_user.user_name,
            "sender_profile_picture": sender_user.profile_picture
        }
        
        # Add the message to the list
        messages_with_user_info.append(message_with_user)

    return messages_with_user_info


@router.post("/conversations/{room_uuid}/message")
async def send_message(
    room_uuid: str,
    request: Request,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)):
    
    # Parse the JSON data from the request
    data = await request.json()
    content = data.get("content")
    # Find the conversation by its room_uuid
    conversation = db.query(ChatRoom).filter(
        ChatRoom.room_uuid == room_uuid).first()

    # Check if the conversation exists, return a 404 error if not
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Determine the sender and receiver of the message
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
    
    # Create a new message and associate it with the conversation
    message = MessageHistory(
        message_id=conversation.id,
        user_id=current_user.id,
        content=content,
        chat_room=conversation
    )

    # Add the message to the database, commit, and refresh
    db.add(message)
    db.commit()
    db.refresh(message)

    # Prepare the WebSocket message
    message_ws = {
        "type": "message",
        "data": {
            "content": content,
            "sender_id": current_user.id
        }
    }

    # Send the message via WebSocket to the receiver
    await ws_manager.send_personal_message(message_ws, sender.id, receiver.id)
    
    return {"success": True}

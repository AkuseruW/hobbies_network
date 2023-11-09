import json
from typing import Dict, List
from fastapi import WebSocket
from sqlalchemy.orm import Session

from models import Follower, User
from models.Hobby import UserToHobby


def get_mutually_following_users(current_user_id: int, db: Session) -> List[User]:
    # Get the current user
    current_user = db.get(User, current_user_id)

    # Get the followers of the current user
    followers_of_current_user = current_user.followers_list

    # Filter mutually following users
    mutually_following_users = [
        user
        for user in followers_of_current_user
        if User.are_users_mutually_following(current_user, user, db)
    ]

    return mutually_following_users

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[WebSocket, User] = {}
        self.user_to_websocket: Dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, current_user, db: Session):
        await websocket.accept()
        self.active_connections[websocket] = current_user.id

        # Get the mutually following users of the current user
        mutually_following_users = get_mutually_following_users(current_user.id, db)

        # Notify all other connected users who are mutually following the new user
        for connection, user in self.active_connections.items():
            # Check if the user's ID is in the list of mutually following users
            if user != current_user.id and user in [u.id for u in mutually_following_users]:
                message = {
                    "action": "new_user_connected",
                    "user_info": {
                        "username": current_user.user_name,
                        "user_id": current_user.id,
                        "profile_picture": current_user.profile_picture,
                    }
                }
                await connection.send_json(message)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            del self.active_connections[websocket]

    async def notify_disconnect(self, current_user, db: Session):
        mutually_following_users = get_mutually_following_users(current_user.id, db)

        for connection, user in self.active_connections.items():
            if user != current_user.id and user in [u.id for u in mutually_following_users]:
                message = {
                    "action": "user_disconnected",
                    "user_info": {
                        "user_id": current_user.id,
                    }
                }
                await connection.send_json(message)

    async def send_post_events(self, post_dict: dict):
        for connection in list(self.active_connections):
            await connection.send_json(post_dict)
            
    async def send_new_post_to_followers(self, new_posts_data: dict, hobby_id: int,user_id: int, db: Session):
        # Get the list of users following the hobby associated with the post
        users_following_hobby = db.query(User).join(UserToHobby, User.id == UserToHobby.user_id).filter(UserToHobby.hobby_id == hobby_id).all()
        # Get the list of users who follow the current user
        current_user_followers = db.query(User).join(Follower, User.id == Follower.follower_id).filter(Follower.following_id == user_id).all()
        # Combine the two lists to get all the target users
        target_users = set(users_following_hobby) | set(current_user_followers)
        # Create a message for the new post
        message = {
            "type": "post",
            "data": new_posts_data
        }

        # Send the message to users following the hobby
        for user in target_users:
            for connection, user_id in self.active_connections.items():
                if user_id == user.id:
                    await connection.send_json(message)

    async def send_new_comment(self, comment_dict: dict):
        # Send a new comment to all active WebSocket connections
        for connection in list(self.active_connections):
            await connection.send_json(comment_dict)

    def get_active_connections(self, db: Session):
        # Get active connections and associated user info
        return {
            websocket: User.get_user_by_id(user_id, db)
            for websocket, user_id in self.active_connections.items()
        }

    def get_active_user_info(self, current_user_id, db: Session):
        # Get user info for active connections that are mutually following the current user
        active_connections = self.get_active_connections(db)
        mutually_following_users = get_mutually_following_users(current_user_id, db)

        users = []

        for user in active_connections.values():
            if user.id != current_user_id and user in mutually_following_users:
                user_info = {
                    "action": "user_info",
                    "profile_picture": user.profile_picture,
                    "user_id": user.id,
                    "username": user.user_name,
                }
                users.append(user_info)

        return users
    
    async def send_personal_message(self, message, sender_id, receiver_id):
        # Send a personal message to the sender and receiver
        sender_connection = self.get_connection_by_user_id(sender_id)
        receiver_connection = self.get_connection_by_user_id(receiver_id)

        if sender_connection and receiver_connection:
            print(sender_connection, sender_id, "sender")
            print(receiver_connection, receiver_id, "receiver")
            try:
                if not isinstance(message, str):
                    message = json.dumps(message)
                await sender_connection.send_text(message)
                await receiver_connection.send_text(message)
            except Exception as e:
                print(f"Error sending message to sender {sender_id} and receiver {receiver_id}: {e}")


    def get_connection_by_user_id(self, user_id: int) -> WebSocket:
        # Get a WebSocket connection by user ID
        for connection, user in self.active_connections.items():
            if user == user_id:
                return connection
        return None
    
    async def send_notification(self, notification, receiver_id):
        # Send a notification to the specified receiver's WebSocket connection
        receiver_connection = self.get_connection_by_user_id(receiver_id)
        if receiver_connection:
            try:
                await receiver_connection.send_json(notification)
            except Exception as e:
                print(f"Error sending notification to receiver {receiver_id}: {e}")
        
        



ws_manager = WebSocketManager()

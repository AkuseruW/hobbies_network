from typing import Dict, List
from fastapi import WebSocket
from sqlalchemy.orm import Session

from models import User


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

    async def connect(self, websocket: WebSocket, current_user, db: Session):
        await websocket.accept()
        self.active_connections[websocket] = current_user.id

        # Get the mutually following users of the current user
        mutually_following_users = get_mutually_following_users(current_user.id, db)

        # Notify all other connected users who are mutually following the new user
        for connection, user in self.active_connections.items():
            # Check if the user's ID is in the list of mutually following users
            if user != current_user.id and user in [u.id for u in mutually_following_users]:
                print(f"Sending new user connected message to user {user}")
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

    async def send_new_comment(self, comment_dict: dict):
        for connection in list(self.active_connections):
            await connection.send_json(comment_dict)

    def get_active_connections(self, db: Session):
        return {
            websocket: User.get_user_by_id(user_id, db)
            for websocket, user_id in self.active_connections.items()
        }

    def get_active_user_info(self, current_user_id, db: Session):
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


ws_manager = WebSocketManager()

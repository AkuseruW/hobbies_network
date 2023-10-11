from typing import Dict
from fastapi import WebSocket
from sqlalchemy.orm import Session
from models import User


class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[WebSocket, User] = {}

    async def connect(self, websocket: WebSocket, current_user):
        await websocket.accept()
        self.active_connections[websocket] = current_user.id

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            del self.active_connections[websocket]

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
        current_user = db.get(User, current_user_id)
        followers_of_current_user = current_user.followers_list
        mutually_following_users = [
            user
            for user in followers_of_current_user
            if User.are_users_mutually_following(current_user, user, db)
        ]
        users = []

        for user in active_connections.values():
            if user.id != current_user_id and mutually_following_users:
                user_info = {
                    "action": "user_info",
                    "profile_picture": user.profile_picture,
                    "user_id": user.id,
                    "username": user.user_name,
                    "user_email": user.email,
                }
                users.append(user_info)

        return users


ws_manager = WebSocketManager()

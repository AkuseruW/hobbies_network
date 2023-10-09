from typing import Set, Dict
from fastapi import WebSocket, WebSocketDisconnect, Depends
import json
from sqlalchemy.orm import Session

from models import User
from settings.database import get_session


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
            user for user in followers_of_current_user if User.are_users_mutually_following(current_user, user, db)
        ]
        users = []

        print(mutually_following_users)

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

#
#
# class WebSocketManager:
#     def __init__(self):
#         self.active_connections: Set[WebSocket] = set()
#
#     async def connect(self, websocket: WebSocket):
#         await websocket.accept()
#         self.active_connections.add(websocket)

#     async def send_personal_message(self, message: str, websocket: WebSocket):
#         try:
#             await websocket.send_text(message)
#         except Exception:
#             self.active_connections.remove(websocket)
#
#     async def broadcast_message(self, message: str):
#         for connection in list(self.active_connections):
#             try:
#                 await connection.send_text(message)
#             except Exception:
#                 self.active_connections.remove(connection)
#
#     async def disconnect(self, websocket: WebSocket):
#         if websocket in self.active_connections:
#             await websocket.close()
#             self.active_connections.remove(websocket)
#
#     async def handle_client_message(self, websocket: WebSocket, message: str):
#         try:
#             message_dict = json.loads(message)
#             message_type = message_dict.get('type')
#
#             if message_type == 'get_online_users':
#                 online_users = [connection.user for connection in self.active_connections]
#                 response_message = {'type': 'online_users', 'users': online_users}
#
#                 try:
#                     await websocket.send_json(response_message)
#                 except WebSocketDisconnect:
#                     pass
#         except json.JSONDecodeError:
#             pass
#
#
# ws_manager = WebSocketManager()

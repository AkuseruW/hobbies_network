from typing import Set
from fastapi import WebSocket, WebSocketDisconnect
import json  # Import the json module for message parsing

class WebSocketManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        
    async def send_post_events(self, post_dict: dict):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(post_dict)
            except Exception:
                self.active_connections.remove(connection)
                
    async def send_new_comment(self, comment_dict: dict):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(comment_dict)
            except Exception as e:
                print(f"Error sending comment to WebSocket: {str(e)}")
                self.active_connections.remove(connection)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except Exception:
            self.active_connections.remove(websocket)
            
    async def broadcast_message(self, message: str):
        for connection in list(self.active_connections):
            try:
                await connection.send_text(message)
            except Exception:
                self.active_connections.remove(connection)
                
    async def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            await websocket.close()
            self.active_connections.remove(websocket)
            
    async def handle_client_message(self, websocket: WebSocket, message: str):
        try:
            message_dict = json.loads(message)
            message_type = message_dict.get('type')

            if message_type == 'get_online_users':
                online_users = [connection.user for connection in self.active_connections]
                response_message = {'type': 'online_users', 'users': online_users}

                try:
                    await websocket.send_json(response_message)
                except WebSocketDisconnect:
                    pass
        except json.JSONDecodeError:
            pass



            
ws_manager = WebSocketManager()
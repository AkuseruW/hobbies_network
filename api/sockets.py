from typing import Set
from fastapi import WebSocket
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
            
ws_manager = WebSocketManager()
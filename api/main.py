from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware


from models.Comment import Base as Comment
from models.Follower import Base as Follower
from models.Hobby import Base as Hobby
from models.Messages import Base as ChatRoom
from models.Post import Base as Post
from models.User import Base as User
from models.Reports import Base as Report
from models.Notification import Base as Notification
from routers import (auth, chat, comments, content,
                     follow_routes, hobbies, post, users, report, country, notifications)
from settings.database import engine
from sockets import ws_manager

app = FastAPI()

# List of model classes
model_classes = [User, Hobby, Post, Comment, Follower, ChatRoom, Report, Notification]
# Create tables for each model class
for model_class in model_classes:
    model_class.metadata.create_all(bind=engine)

# List of routers
routers = [auth.router, users.router, content.router, post.router, comments.router,
           follow_routes.router, hobbies.router, chat.router,
           report.router, country.router, notifications.router]
# Include all routers
for router in routers:
    app.include_router(router)


origins = [
    "http://localhost:3000",
    "http://localhost:3000/",
]
app.add_middleware(SessionMiddleware,
                   secret_key="d0f75c01f47d53050dad60158c9f98840b6e22f3dce028a9a1d1e229286a236a")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.websocket("/ws/")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

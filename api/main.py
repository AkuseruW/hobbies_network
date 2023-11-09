import json
from typing import Annotated

from fastapi import FastAPI, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from dependencies.auth import get_current_user
from models.Comment import Base as Comment
from models.Follower import Base as Follower
from models.Hobby import Base as Hobby
from models.Messages import Base as ChatRoom
from models.Post import Base as Post
from models.User import Base as User
from models.Reports import Base as Report
from models.Notification import Base as Notification
from models.Subscription import Base as Subscription
from models.ResetPassword import Base as PasswordReset
from routers import (
    auth,
    chat,
    comments,
    content,
    follow_routes,
    hobbies,
    post,
    users,
    report,
    country,
    notifications,
    certification,
    seed,
    dashboard
)
from settings.database import engine, get_session
from sockets import ws_manager
from sqlalchemy.orm import Session

from fastapi import Cookie, Depends, Query, WebSocket, status
from starlette.exceptions import WebSocketException

app = FastAPI()

# List of model classes
model_classes = [User, Hobby, Post, Comment, Follower, ChatRoom, Report, Notification, PasswordReset, Subscription]
# Create tables for each model class
for model_class in model_classes:
    model_class.metadata.create_all(bind=engine)

# List of routers
routers = [
    auth.router,
    users.router,
    content.router,
    post.router,
    comments.router,
    follow_routes.router,
    hobbies.router,
    chat.router,
    report.router,
    country.router,
    notifications.router,
    certification.router,
    dashboard.router,
    seed.router,
]
# Include all routers
for router in routers:
    app.include_router(router)



app.add_middleware(
    SessionMiddleware,
    secret_key="d0f75c01f47d53050dad60158c9f98840b6e22f3dce028a9a1d1e229286a236a",
)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_cookie_or_token(
    session: Annotated[str | None, Cookie()] = None,
    token: Annotated[str | None, Query()] = None,
):
    if session is None and token is None:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)
    return session or token


@app.websocket("/ws/")
async def websocket_endpoint(
    websocket: WebSocket,
    cookie_or_token: Annotated[str, Depends(get_cookie_or_token)],
    db: Session = Depends(get_session),
):
    current_user = get_current_user(cookie_or_token)
    await ws_manager.connect(websocket, current_user, db)

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            if message.get("action") == "get_online_users":
                online_users = ws_manager.get_active_user_info(current_user.id, db)
                await websocket.send_json(online_users)

    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
        await ws_manager.notify_disconnect(current_user, db)

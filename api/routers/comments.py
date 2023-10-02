from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from settings.database import get_session
from models.schemas.commentSchemas import CommentSchema
from dependencies.auth import get_current_active_user
from models import Comment, User
from uuid import UUID
from sockets import ws_manager
from dependencies.comments import comment_to_database

router = APIRouter(
    prefix="/api", tags=["comments"], dependencies=[Depends(get_current_active_user)])


@router.post("/add-comment", response_model=None)
async def create_comment(
    request: Request,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    comment_data = await request.json()
    new_comment = await comment_to_database(db, content=comment_data["content"], user_id=current_user.id, post_id=comment_data["post_id"])

    new_comment_data = {
        "type": "comment",
        "data": {
            "id": str(new_comment.id),
            "post_id": str(new_comment.post_id),
            "content": new_comment.content,
            "user": {
                "user_id": new_comment.user_id,
                "user_name": new_comment.user_name,
                "user_profile_picture": new_comment.user_profile_picture,
            }
        }
    }
    await ws_manager.send_new_comment(new_comment_data)
    return new_comment


@router.get("/post/{post_id}/comments", response_model=None)
def get_comments_for_post(
        post_id: UUID,
        offset: int = 0,
        limit: int = 10,
        db: Session = Depends(get_session)
):
    comments = db.query(Comment).filter(Comment.post_id ==
                                        post_id).offset(offset).limit(limit).all()

    comment_list = []
    for comment in comments:
        comment_dict = {
            "id": comment.id,
            "content": comment.content,
            "post_id": comment.post_id,
            "user": {
                "id": comment.user_id,
                "username": comment.user_name,
                "profile_picture": comment.user_profile_picture,
            }
        }
        comment_list.append(comment_dict)

    return comment_list

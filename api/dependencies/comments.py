from sqlalchemy.orm import Session
from models import Comment, Post, User
from typing import List, Type


def get_comments_for_post(post_id: int, offset: int, limit: int, db: Session) -> list[Type[Comment]]:
    comments = db.query(Comment).filter(Comment.post_id == post_id).offset(offset).limit(limit).all()
    return comments


async def comment_to_database(db: Session, content: str, user_id: int, post_id: int) -> Type[Comment]:
    post = db.query(Post).get(post_id)
    user = db.query(User).get(user_id)
    
    new_comment = Comment(content=content, user_id=user_id, post_id=post_id)
    post.comments.append(new_comment)
    user.comments.append(new_comment)
    
    db.add(new_comment)
    db.commit()
    return new_comment
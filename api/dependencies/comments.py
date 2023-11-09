from sqlalchemy.orm import Session
from models import Comment, Post, User
from typing import List, Type


def get_comments_for_post(post_id: int, offset: int, limit: int, db: Session) -> list[Type[Comment]]:
    # Query comments for the specified post, applying pagination
    comments = db.query(Comment).filter(Comment.post_id == post_id).offset(offset).limit(limit).all()
    return comments


async def comment_to_database(db: Session, content: str, user_id: int, post_id: int) -> Type[Comment]:
    # Retrieve the post and user by their respective IDs
    post = db.query(Post).get(post_id)
    user = db.query(User).get(user_id)
    # Create a new Comment object with the provided content, user_id, and post_id
    new_comment = Comment(content=content, user_id=user_id, post_id=post_id)
    # Associate the comment with the post and user
    post.comments.append(new_comment)
    user.comments.append(new_comment)
    
    # Add the new comment to the database
    db.add(new_comment)
    db.commit()
    return new_comment
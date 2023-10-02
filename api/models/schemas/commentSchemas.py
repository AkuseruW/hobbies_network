from typing import Optional
from pydantic import BaseModel
from uuid import UUID


class CommentSchemaCreate(BaseModel):
    content: str
    post_id: UUID


class CommentSchema(CommentSchemaCreate):
    user_id: int
    user_name: str
    user_profile_picture: Optional[str]

    class Config:
        orm_mode = True

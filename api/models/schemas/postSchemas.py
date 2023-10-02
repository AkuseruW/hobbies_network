from typing import Optional, List
from pydantic import BaseModel
from uuid import UUID


class NewRole(BaseModel):
    name: str


class NewPostSchema(BaseModel):
    user_id: int
    content: str
    images: Optional[List[str]] = None


class PostSchemaCreated(BaseModel):
    id: UUID
    content: str
    post_images_urls: Optional[List[str]] = None

    class Config:
        orm_mode = True
        
class PostRead(PostSchemaCreated):
    user_id: int
    created_at: str
    user_name: str
    user_profile_picture:str
    total_comments: int

class PostSchema(BaseModel):
    id: UUID
    content: str
    user_name: str
    user_profile_picture: Optional[str]
    post_images_urls: Optional[List[str]] = None
    created_at: str
    user_id: int

    class Config:
        orm_mode = True

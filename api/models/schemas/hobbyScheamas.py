from pydantic import BaseModel


class NewHobby(BaseModel):
    name: str
    slug: str
    description: str
    banner: str
    
    class Config:
        orm_mode = True
from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile, Depends


class NewHobby(BaseModel):
    name: str
    slug: str
    description: str
    banner: str
    
    class Config:
        orm_mode = True
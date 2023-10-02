from pydantic import BaseModel

class UserUpdatePassword(BaseModel):
    current_password: str
    new_password: str

from pydantic import BaseModel
import datetime

class ShortBase(BaseModel):
    id: str
    url: str

class ShortCreate(ShortBase):
    creator_name: str

class Short(ShortCreate):
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    hashed_password: str
    shorts: list[Short] = []

    class Config:
        from_attributes = True
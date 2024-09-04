from pydantic import BaseModel
import datetime

class ShortBase(BaseModel):
    id: str
    url: str

class ShortCreate(ShortBase):
    pass

class Short(ShortCreate):
    created_at: datetime.datetime

    class Config:
        from_attributes = True
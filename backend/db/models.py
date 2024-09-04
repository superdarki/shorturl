from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from .database import Base

class Short(Base):
    __tablename__ = "short"

    id = Column(String, primary_key=True)
    url = Column(String)
    creator_name = Column(String, ForeignKey("users.username"))
    created_at = Column(DateTime, server_default=func.now())

    creator = relationship("User", back_populates="shorts")

class User(Base):
    __tablename__ = "users"

    username = Column(String, primary_key=True)
    hashed_password = Column(String)

    shorts = relationship("Short", back_populates="creator")
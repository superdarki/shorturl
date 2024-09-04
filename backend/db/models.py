from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func

from .database import Base

class Short(Base):
    __tablename__ = "short"

    id = Column(String, primary_key=True)
    url = Column(String)
    created_at = Column(DateTime, server_default=func.now())
from sqlalchemy.orm import Session

from . import models, schemas

def get(db: Session, id: str):
    return db.query(models.Short).filter(models.Short.id == id).first()

def getall(db: Session):
    return db.query(models.Short).all()

def add(db: Session, short: schemas.Short):
    db_short = models.Short(**short.model_dump())
    db.add(db_short)
    db.commit()
    db.refresh(db_short)
    return db_short
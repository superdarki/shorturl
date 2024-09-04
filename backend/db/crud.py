from sqlalchemy.orm import Session
import datetime

from . import models, schemas

def get(db: Session, id: str):
    return db.query(models.Short).filter(models.Short.id == id).first()

def get_all_from_user(db: Session, creator_name: str):
    return db.query(models.Short).filter(models.Short.creator_name == creator_name).all()

def get_all(db: Session):
    return db.query(models.Short).all()

def add(db: Session, short: schemas.Short):
    db_short = models.Short(**short.model_dump())
    db.add(db_short)
    db.commit()
    db.refresh(db_short)
    return db_short

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(username=user.username, hashed_password=user.hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_old_records(db: Session):
    print("Deleting old records")

    delta = datetime.datetime.now() - datetime.timedelta(days=10)

    try:
        db.query(models.Short).filter(models.Short.created_at < delta).delete()
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"An error occurred: {e}")
    finally:
        db.close()
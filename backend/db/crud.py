from sqlalchemy.orm import Session
import datetime

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

def delete_old_records(db: Session):
    print("Deleting old records")

    one_month_ago = datetime.datetime.now() - datetime.timedelta(minutes=2)

    try:
        db.query(models.Short).filter(models.Short.created_at < one_month_ago).delete()
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"An error occurred: {e}")
    finally:
        db.close()
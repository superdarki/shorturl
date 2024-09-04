# DB
from sqlalchemy.orm import Session
from db import crud, models, schemas
from db.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# # AUTODELETE
# from apscheduler.schedulers.background import BackgroundScheduler
# scheduler = BackgroundScheduler()
# scheduler.add_job(crud.delete_old_records, args=(get_db()), trigger='interval', days=1)
# scheduler.start()

# API
from fastapi import Depends, FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from secrets import token_urlsafe

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
async def root() -> str:
    return "Hello World"

@app.get("/links")
async def list(request: Request, db: Session = Depends(get_db)) -> list[schemas.Short]:
    res = crud.getall(db)
    return res

@app.post("/create")
async def create(url: str, request: Request, db: Session = Depends(get_db)) -> schemas.Short:
    id = token_urlsafe(8)
    while (crud.get(db, id)):
        id = token_urlsafe(8)
    res = crud.add(db, schemas.ShortCreate(id=id, url=url))
    return res

@app.get("/{id}")
async def redirect(id: str, db: Session = Depends(get_db)) -> str:
    short = crud.get(db, id=id)
    if short is None:
        raise HTTPException(status_code=404, detail="Link not found")
    return short.url

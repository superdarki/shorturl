from secrets import token_urlsafe
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi_login import LoginManager
from sqlalchemy.orm import Session
from os import getenv
from datetime import timedelta
from passlib.context import CryptContext
import logging

from db import crud, schemas
from db.database import SessionLocal, engine

# Configuration
SECRET_KEY = getenv("JWT_SECRET_KEY", "mysupersecretkey1234")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing setup
logging.getLogger('passlib').setLevel(logging.ERROR)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create the FastAPI app
app = FastAPI(root_path=getenv("API_ROOT_PATH", ""))

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LoginManager
manager = LoginManager(SECRET_KEY, token_url='/login', use_cookie=True)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Utility functions for password hashing
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# User authentication
@manager.user_loader
def load_user(username: str):
    db = SessionLocal()
    try:
        user = crud.get_user_by_username(db, username=username)
    finally:
        db.close()
    return user

# Routes
@app.get("/")
async def root(request: Request) -> RedirectResponse:
    return RedirectResponse(url="docs", status_code=302)

@app.post("/login")
async def login(data: schemas.UserCreate, db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=data.username)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    access_token = manager.create_access_token(data={"sub": user.username}, expires=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register")
async def register(form_data: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=form_data.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_password = get_password_hash(form_data.password)
    user_in = schemas.User(username=form_data.username, hashed_password=hashed_password)
    crud.create_user(db=db, user=user_in)

    return {"msg": "User registered successfully"}

@app.get("/check-auth")
async def check_auth(current_user: Annotated[schemas.User, Depends(manager)]):
    return {"status": "authenticated", "user": current_user.username}

@app.post("/logout")
async def logout(current_user: Annotated[schemas.User, Depends(manager)]):
    # Invalidate the access token
    # In this case, we rely on token expiration. Consider implementing a token blacklist for immediate logout.
    return {"msg": "Successfully logged out"}

@app.get("/mylinks")
async def list_links(current_user: Annotated[schemas.User, Depends(manager)], db: Session = Depends(get_db)):
    res = crud.get_all_from_user(db, current_user.username)
    return res

@app.get("/links")
async def list_all_links(current_user: Annotated[schemas.User, Depends(manager)], db: Session = Depends(get_db)):
    if current_user.username != 'admin':
        raise HTTPException(status_code=403, detail='Access denied')
    res = crud.get_all(db)
    return res

@app.post("/create")
async def create_link(url: str, current_user: Annotated[schemas.User, Depends(manager)], db: Session = Depends(get_db)):
    id = token_urlsafe(8)
    while crud.get(db, id):
        id = token_urlsafe(8)
    res = crud.add(db, schemas.ShortCreate(id=id, url=url, creator_name=current_user.username))
    return res

@app.get("/{id}")
async def redirect_link(id: str, db: Session = Depends(get_db)) -> str:
    short = crud.get(db, id=id)
    if short is None:
        raise HTTPException(status_code=404, detail="Link not found")
    return short.url

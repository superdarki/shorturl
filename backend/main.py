from fastapi import Body, Depends, FastAPI, HTTPException, Request
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
import starlette.status as status
from sqlalchemy.orm import Session
from os import getenv
from typing import Annotated
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from secrets import token_urlsafe
import logging

from db import crud, models, schemas
from db.database import SessionLocal, engine

# Constants for JWT
SECRET_KEY = getenv("JWT_SECRET_KEY", "mysupersecretkey1234")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing setup
logging.getLogger('passlib').setLevel(logging.ERROR)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

models.Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

ROOT_PATH = getenv("API_ROOT_PATH", "")

app = FastAPI(root_path=ROOT_PATH)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Utility functions for password hashing and JWT token creation
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# User authentication and authorization
async def get_current_user(token: Annotated[str, Body(embed=True)], db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = crud.get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    return user

# Routes
@app.get("/")
async def root(request: Request) -> str:
    return RedirectResponse(url="docs", status_code=status.HTTP_302_FOUND)

@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register")
async def register(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Check if the username is already taken
    db_user = crud.get_user_by_username(db, username=form_data.username)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
    
    # Hash the password
    hashed_password = get_password_hash(form_data.password)
    
    # Create a new user record
    user_in = schemas.User(username=form_data.username, hashed_password=hashed_password)
    crud.create_user(db=db, user=user_in)

    return {"msg": "User registered successfully"}

@app.get("/mylinks")
async def list_links(current_user: Annotated[schemas.User, Depends(get_current_user)], db: Session = Depends(get_db)) -> list[schemas.Short]:
    res = crud.get_all_from_user(db, current_user.username)
    return res

@app.get("/links")
async def list_links(current_user: Annotated[schemas.User, Depends(get_current_user)], db: Session = Depends(get_db)) -> list[schemas.Short]:
    if (current_user.username != 'admin'):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Access denied')
    res = crud.get_all(db)
    return res

@app.post("/create")
async def create_link(url: str, current_user: Annotated[schemas.User, Depends(get_current_user)], db: Session = Depends(get_db)) -> schemas.Short:
    id = token_urlsafe(8)
    while crud.get(db, id):
        id = token_urlsafe(8)
    res = crud.add(db, schemas.ShortCreate(id=id, url=url, creator_name=current_user.username))
    return res

@app.get("/{id}")
async def redirect_link(id: str, db: Session = Depends(get_db)) -> str:
    short = crud.get(db, id=id)
    if short is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Link not found")
    return short.url
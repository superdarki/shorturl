from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from secrets import token_urlsafe

from lib.db import DB

db = DB("short.db")
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
async def root():
    return "Hello World"

@app.get("/links")
async def list(request: Request):
    res = []
    l = db.getall()
    for o in l:
        print(o)
        res.append({
            "origin": o[1],
            "short": str(request.base_url) + o[0],
            "created_at": o[2]
        })
    return {
        "data": res
    }

@app.post("/create")
async def create(url: str, request: Request):
    id = token_urlsafe(8)
    while (db.get(id)):
        id = token_urlsafe(8)
    db.add(id, url)
    return {
        "data": {
            "origin": url,
            "short": str(request.base_url) + id
        }
    }

@app.get("/{id}")
async def redirect(id: str):
    url = db.get(id)
    if not url:
        raise HTTPException(status_code=404, detail="Short URL does not exists")
    return RedirectResponse(url, 302)

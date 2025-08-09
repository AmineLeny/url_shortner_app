from app.database import Base, engine
from app.models import URL
from fastapi import FastAPI
from app.routers import url
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all( bind = engine)
app = FastAPI(title="URL Shortener API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Or specify ["http://localhost:3000"] for your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(url.router)




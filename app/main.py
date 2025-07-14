from app.database import Base, engine
from app.models import URL
from fastapi import FastAPI
from app.routers import url


Base.metadata.create_all( bind = engine)
app = FastAPI(title="URL Shortener API")
app.include_router(url.router)




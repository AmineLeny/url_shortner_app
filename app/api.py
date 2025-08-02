from sqlalchemy.orm import Session
from app import models, schemas
from app.utils import generate_short_code
from app.redis import redis_client
import json


def create_url(db : Session , url: schemas.URLCreate):
    while True:
        short_code = generate_short_code()
        # Check if this short_code already exists in the DB
        existing = db.query(models.URL).filter(models.URL.short_url == short_code).first()
        if not existing:
            break  # Found a unique code

    db_url = models.URL(short_url=short_code, original_url = url.original_url)
    db.add(db_url)
    db.commit()
    db.refresh(db_url)
    obj_dict = {
            "id": db_url.id,
            "short_url": db_url.short_url,
            "original_url": db_url.original_url,
            "access_count": db_url.access_count
        }
    redis_client.set(short_code,json.dumps(obj_dict))
    return db_url


def get_url_by_short_code(db: Session, short_code: str):
    try:
        cached_obj = redis_client.get(short_code)
    except Exception:
        cached_obj = None
    if cached_obj:
        data = json.loads(cached_obj)
        return models.URL(**data)
    url_obj = db.query(models.URL).filter(models.URL.short_url == short_code).first()
    if url_obj:
        obj_dict = {
            "id": url_obj.id,
            "short_url": url_obj.short_url,
            "original_url": url_obj.original_url,
            "access_count": url_obj.access_count
        }
        redis_client.set(short_code, json.dumps(obj_dict), ex=3600)
    return url_obj

def increment_access_count(db:Session , db_url: models.URL):
    db_url.access_count += 1
    db.commit()
    db.refresh(db_url)
    return db_url

def update_url(db: Session , short_code: str , new_url: str):
    db_url = get_url_by_short_code(db,short_code)
    if db_url : 
        db_url.original_url = new_url
        db.commit()
        db.refresh(db_url)
        obj_dict = {
            "id": db_url.id,
            "short_url": db_url.short_url,
            "original_url": db_url.original_url,
            "access_count": db_url.access_count
        }
        redis_client.set(short_code, json.dumps(obj_dict), ex=3600)
    return db_url

def delete_url(db: Session , short_code: str):
    db_url = get_url_by_short_code(db, short_code)
    if db_url:
        db.delete(db_url)
        db.commit()
        redis_client.delete(short_code)

    return db_url
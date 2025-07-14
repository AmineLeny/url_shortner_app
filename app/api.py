from sqlalchemy.orm import Session
from app import models, schemas
from app.utils import generate_short_code

def create_url(db : Session , url: schemas.URLCreate):
    short_code = generate_short_code()
    db_url = models.URL(short_url=short_code, original_url = url.original_url)
    db.add(db_url)
    db.commit()
    db.refresh(db_url)
    return db_url


def get_url_by_short_code(db: Session, short_code: str ):
    return db.query(models.URL).filter(models.URL.short_url==short_code).first()

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
    return db_url

def delete_url(db: Session , short_code: str):
    db_url = get_url_by_short_code(db, short_code)
    if db_url:
        db.delete(db_url)
        db.commit()
    return db_url
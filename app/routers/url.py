from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas,api,database

router = APIRouter(prefix="/urls" , tags=["urls"] )


def get_db():
    db= database.SessionLocal()
    try:
        yield db
    finally : 
        db.close()


@router.post("/", response_model=schemas.URLResponse)
def create_short_url(url: schemas.URLCreate, db: Session= Depends(get_db)):
    return api.create_url(db,url)


@router.get("/{short_code}", response_model=schemas.URLResponse)
def redirect_url(short_code: schemas.URLCreate, db: Session= Depends(get_db)):

    db_url=  api.get_url_by_short_code(db,short_code)
    if db_url :
        return db_url
    raise HTTPException(status_code=404, detail="URL not found")


@router.put("/{short_code}", response_model = schemas.URLResponse)
def update_url(short_code: str, url: schemas.URLCreate, db: Session= Depends(get_db)):
    db_url = api.update_url(db,url)
    if not db_url :
        raise HTTPException(status_code=404, detail ="URL not found")
    return db_url


@router.delete("/{short_code}")
def delete_url(short_code : str, db: Session = Depends(get_db)):
    db_url = api.delete_url(db,short_code)
    if not db_url:
        raise HTTPException(status_code=404, detail ="URL not found")
    return {"message": "URL deleted successfully"} 
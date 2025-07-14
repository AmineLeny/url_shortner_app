from pydantic import BaseModel

class URLCreate(BaseModel):
    original_url: str

class URLResponse(BaseModel):
    id: int
    short_url: str
    original_url: str
    access_count: int

    class Config:
        orm_mode = True

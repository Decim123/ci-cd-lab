from typing import Optional
from pydantic import Field
from app.models.base import ItemBase, ItemUpdate

class BookBase(ItemBase):
    author: str = Field(..., max_length=50)
    pages: int = Field(..., gt=0)

class BookCreate(BookBase):
    pass

class BookUpdate(ItemUpdate):
    author: Optional[str] = Field(None, max_length=50)
    pages: Optional[int] = Field(None, gt=0)
from pydantic import BaseModel, Field
from typing import Optional

class ItemBase(BaseModel):
    name: str = Field(..., max_length=100)
    price: float = Field(..., gt=0)
    description: Optional[str] = None

class ItemUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    price: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None
from typing import Optional
from pydantic import Field
from app.models.base import ItemBase, ItemUpdate

class ClothingBase(ItemBase):
    size: str = Field(..., pattern="^(S|M|L|XL)$")
    material: str

class ClothingCreate(ClothingBase):
    pass

class ClothingUpdate(ItemUpdate):
    size: Optional[str] = Field(None, pattern="^(S|M|L|XL)$")
    material: Optional[str] = None
from typing import Optional
from pydantic import Field
from app.models.base import ItemBase, ItemUpdate

class ElectronicsBase(ItemBase):
    voltage: int = Field(..., ge=5, le=240)
    warranty: int = Field(..., ge=0)

class ElectronicsCreate(ElectronicsBase):
    pass

class ElectronicsUpdate(ItemUpdate):
    voltage: Optional[int] = Field(None, ge=5, le=240)
    warranty: Optional[int] = Field(None, ge=0)
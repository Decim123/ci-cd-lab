from typing import Dict, Union
from app.models.book import BookCreate
from app.models.clothing import ClothingCreate
from app.models.electronics import ElectronicsCreate

fake_db: Dict[int, Union[BookCreate, ClothingCreate, ElectronicsCreate]] = {}
counter = 0

def get_next_id():
    global counter
    counter += 1
    return counter
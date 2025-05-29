from typing import Union
from fastapi import APIRouter, HTTPException
from app.database import fake_db, get_next_id
from app.models.book import BookCreate, BookUpdate
from app.models.clothing import ClothingCreate, ClothingUpdate
from app.models.electronics import ElectronicsCreate, ElectronicsUpdate

router = APIRouter()

# Примеры товаров
initial_items = [
    BookCreate(
        name="Война и мир", 
        price=25.99, 
        author="Л. Толстой", 
        pages=1225
    ),
    ClothingCreate(
        name="Футболка", 
        price=15.50, 
        size="M", 
        material="Хлопок"
    ),
    ElectronicsCreate(
        name="Смартфон", 
        price=299.99, 
        voltage=5, 
        warranty=24
    )
]

# Инициализация БД
if not fake_db:
    for item in initial_items:
        item_id = get_next_id()
        fake_db[item_id] = item

@router.post("/books/", status_code=201)
def create_book(book: BookCreate):
    book_id = get_next_id()
    fake_db[book_id] = book
    return {"id": book_id, **book.model_dump()}

@router.post("/clothing/", status_code=201)
def create_clothing(clothing: ClothingCreate):
    clothing_id = get_next_id()
    fake_db[clothing_id] = clothing
    return {"id": clothing_id, **clothing.model_dump()}

@router.post("/electronics/", status_code=201)
def create_electronics(electronics: ElectronicsCreate):
    electronics_id = get_next_id()
    fake_db[electronics_id] = electronics
    return {"id": electronics_id, **electronics.model_dump()}

@router.get("/items/{item_id}")
def read_item(item_id: int):
    if item_id not in fake_db:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"id": item_id, "data": fake_db[item_id]}

@router.patch("/items/{item_id}")
def update_item(
    item_id: int, 
    update_data: Union[BookUpdate, ClothingUpdate, ElectronicsUpdate]
):
    if item_id not in fake_db:
        raise HTTPException(status_code=404, detail="Item not found")
    
    item = fake_db[item_id]
    update_dict = update_data.model_dump(exclude_unset=True)
    
    for key, value in update_dict.items():
        if hasattr(item, key):
            setattr(item, key, value)
    
    return {"id": item_id, "updated": item}

@router.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int):
    if item_id not in fake_db:
        raise HTTPException(status_code=404, detail="Item not found")
    del fake_db[item_id]
    return None

@router.get("/items/", summary="Получить все товары")
def read_items():
    return fake_db
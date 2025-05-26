from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, ValidationError
from typing import List, Dict, Optional
from datetime import date

app = FastAPI()
templates = Jinja2Templates(directory="templates")

class InputData(BaseModel):
    string_field: str
    int_field: int
    float_field: float
    bool_field: bool
    #list_field: List[int]
    #dict_field: Dict[str, int]
    date_field: date
    optional_field: Optional[str] = None

@app.get("/", response_class=HTMLResponse)
def get_form(request: Request):
    return templates.TemplateResponse("form.html", {"request": request, "result": None})

@app.post("/", response_class=HTMLResponse)
async def submit_form(request: Request, form_data: InputData = Form(...)):
    try:
        result = {"success": True, "data": form_data.dict()}
    except ValidationError as e:
        result = {"success": False, "error": str(e)}
    
    return templates.TemplateResponse("form.html", {"request": request, "result": result})
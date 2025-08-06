from Controller.Classes_controller import create_classroom
from fastapi import APIRouter, Depends, File, Form, Header, UploadFile
from sqlalchemy.orm import Session
from Database.connection import connect_databse

router=APIRouter()


@router.post("/create_your_classroom")
def create_classroom_as_professor(
    class_title : str =Form(...),
    class_capacity:int = Form(...) ,
    class_field  : str =Form(...)  ,
    description : str =Form(...),
    classroom_password : str =Form(...),
    classroom_picture :UploadFile = File(...),
    authorization: str | None = Header(None),
    db: Session = Depends(connect_databse)):
    
    return create_classroom(
    class_title,
    class_capacity ,
    class_field ,
    description,
    classroom_password,
    classroom_picture,
    authorization,
    db)
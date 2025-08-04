from Controller.Professor_controller import register_professor,login_professor,view_profile
from Database.connection import connect_databse
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, File, Form, Header, UploadFile
from Schemas.professor_schema import professor_login
router=APIRouter()

@router.post("/professor_registration")
def register_as_professor( first_name: str = Form(...),
    last_name: str = Form(...),
    phone_number: int = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    country: str = Form(...),
    educational_field: str = Form(...),
    description: str = Form(...),  
    profile_picture: UploadFile = File(...),
    db: Session = Depends(connect_databse),):
    
    return register_professor( first_name,
    last_name,
    phone_number,
    email,
    password,
    country,
    educational_field,
    description,  
    profile_picture,
    db)
    
@router.post("/professor_login") 
def login_as_professor(payload:professor_login,db:Session=Depends(connect_databse)):
    return login_professor(payload,db)
    

    
@router.post("/professor_profile")
def view_profile_as_professor(authorization: str | None = Header(None),db: Session = Depends(connect_databse)):
    return view_profile(authorization,db)
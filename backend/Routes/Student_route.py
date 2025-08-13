from Models.Students import Student
from fastapi import File, Form,Depends,APIRouter, Header, UploadFile
from sqlalchemy.orm import Session
from Database.connection import connect_databse
from Schemas.student_schema import studentlogin
from Utils.Cloudinary_Uploader import upload_user_profile_image
from Utils.hash_password import hash_password
from Controller.Student_controller import register_student,login_student,view_profile


router=APIRouter()

@router.post("/register_student")

def register_as_student(first_name:str=Form(...),
    last_name:str=Form(...),
    email:str=Form(...),
    password:str=Form(...),
    phone_number:str=Form(...),
    academic_level:str=Form(...),
    profile_image: UploadFile = File(...),
    country:str=Form(...),
    descritpion:str=Form(...),
    db:Session=Depends(connect_databse)):
    
    return register_student(first_name,
    last_name,
    email,
    password,
    phone_number,
    academic_level,
    profile_image,
    country,
    descritpion,
    db)
    
    
@router.post("/login_student")
def login_as_student(payload:studentlogin,db:Session=Depends(connect_databse)):
    return login_student(payload,db)


@router.get("/view_profile")
def view_profile_as_student(authorization: str | None = Header(None),db: Session = Depends(connect_databse)):
    return view_profile(authorization,db)
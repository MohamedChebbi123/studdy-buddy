from Models.Students import Student
from fastapi import File, Form,Depends, Header, UploadFile,HTTPException,status
from sqlalchemy.orm import Session
from Database.connection import connect_databse
from Utils.Cloudinary_Uploader import upload_user_profile_image
from Utils.hash_password import hash_password, verify_password
from Schemas.student_schema import studentlogin
from Utils.jwt_logic import create_access_token, verify_access_token

def register_student( 
    first_name:str=Form(...),
    last_name:str=Form(...),
    email:str=Form(...),
    password:str=Form(...),
    phone_number:str=Form(...),
    academic_level:str=Form(...),
    profile_image: UploadFile = File(...),
    country:str=Form(...),
    descritpion:str=Form(...),
    db:Session=Depends(connect_databse)
    ):
    
    image_url=upload_user_profile_image(profile_image)
    
    hashed_password=hash_password(password)
    
    new_student=Student(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=hashed_password,
        phone_number=phone_number,
        academic_level=academic_level,
        profile_image=image_url,
        country=country,
        descritpion=descritpion
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return{
        "message":"user registered successfully"
    }
    
    
def login_student(payload:studentlogin,db:Session=Depends(connect_databse)):
    found_student=db.query(Student).filter(Student.email==payload.email).first()
    
    if not found_student :
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="email not found")
    
    if not verify_password(payload.password, found_student.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="email not found")
    
    token=create_access_token({"sub": str(found_student.student_id)})
    
    return{
        "token": token,
        "token_type": "bearer",
        "message": "student logged in succesfully"
    }


def view_profile(authorization: str | None = Header(None),db: Session = Depends(connect_databse)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    payload = verify_access_token(token)

    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    student_id = payload["sub"]
    
    found_student=db.query(Student).filter(Student.student_id==student_id).first()
    
    return {
        "first_name": found_student.first_name,
        "last_name": found_student.last_name,
        "email": found_student.email,
        "password": found_student.password,
        "phone_number": found_student.phone_number,
        "academic_level": found_student.academic_level,
        "profile_image": found_student.profile_image,
        "country": found_student.country,
        "descritpion": found_student.descritpion,
        "joined_at": found_student.joined_at
    }
    
    
def edit_your_profile(first_name:str=Form(...),
    last_name:str=Form(...),
    email:str=Form(...),
    phone_number:str=Form(...),
    academic_level:str=Form(...),
    profile_image: UploadFile = File(...),
    country:str=Form(...),
    descritpion:str=Form(...),
    authorization: str | None = Header(None),
    db:Session=Depends(connect_databse)):
    
        
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    payload = verify_access_token(token)

    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    student_id = payload["sub"]
    
    
    found_student=db.query(Student).filter(Student.student_id==student_id).first()

    image_url=upload_user_profile_image(profile_image)
    
    found_student.first_name=first_name
    found_student.last_name=last_name
    found_student.email=email
    found_student.phone_number=phone_number
    found_student.academic_level=academic_level
    found_student.profile_image=image_url
    found_student.country=country
    found_student.descritpion=descritpion
    
    db.commit()
    db.refresh(found_student)
    
    
    return{"message":"user profile has been updated"}



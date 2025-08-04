from fastapi import APIRouter, Depends, Form, File, Header, UploadFile, HTTPException,status
from grpc import Status
from sqlalchemy.orm import Session
from Database.connection import connect_databse
from Models.Proffessor import Proffessor
from Utils.Cloudinary_Uploader import upload_user_profile_image
from Utils.hash_password import hash_password,verify_password
from Schemas.professor_schema import professor_login
from Utils.jwt_logic import create_access_token, verify_access_token



router = APIRouter()


def register_professor(
    first_name: str = Form(...),
    last_name: str = Form(...),
    phone_number: int = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    country: str = Form(...),
    educational_field: str = Form(...),
    description: str = Form(...),  
    profile_picture: UploadFile = File(...),
    db: Session = Depends(connect_databse),
):
    image_url = upload_user_profile_image(profile_picture)

    hashed_pw = hash_password(password)

    new_professor = Proffessor(
        first_name=first_name,
        last_name=last_name,
        phone_number=phone_number,
        email=email,
        password=hashed_pw,
        country=country,
        educational_field=educational_field,
        description=description,
        profile_picture=image_url,
    )

    
    db.add(new_professor)
    db.commit()
    db.refresh(new_professor)
   
    return {"message": "Professor registered successfully"}


def login_professor(payload: professor_login, db: Session = Depends(connect_databse)):
    found_user = db.query(Proffessor).filter(Proffessor.email == payload.email).first()

    if not found_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="no user with is email found")

    
    if not verify_password(payload.password, found_user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="incorrect password")

    token = create_access_token({"sub": str(found_user.id)})

    return {
        "token": token,
        "token_type": "bearer",
        "message": "user logged in succesfully"
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

    professor_id = payload["sub"]
    
    user_profile=db.query(Proffessor).filter(Proffessor.id==professor_id).first()
    
    return {
        "first_name": user_profile.first_name,
        "last_name": user_profile.last_name,
        "phone_number": user_profile.phone_number,
        "email": user_profile.email,
        "country": user_profile.country,
        "educational_field": user_profile.educational_field,
        "description": user_profile.description,
        "joined_at": user_profile.joined_at,
        "profile_picture": user_profile.profile_picture
    }
    
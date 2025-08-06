from Utils.Cloudinary_Uploader import upload_user_profile_image
from fastapi import Depends, Form, HTTPException, Header
from Utils.jwt_logic import verify_access_token
from Database.connection import connect_databse
from sqlalchemy.orm import Session
from Models.Classes import Classes

from fastapi import Form, File, UploadFile

def create_classroom(
    class_title: str = Form(...),
    class_capacity: int = Form(...),
    class_field: str = Form(...),
    description: str = Form(...),
    classroom_password: str = Form(...),
    classroom_picture: UploadFile = File(...),
    authorization: str | None = Header(None), 
    db: Session = Depends(connect_databse)
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    payload = verify_access_token(token)

    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    professor_id = payload["sub"]

    image_url = upload_user_profile_image(classroom_picture)

    new_class = Classes(
        professor_id=professor_id,
        class_title=class_title,
        class_capacity=class_capacity,
        class_field=class_field,
        description=description,
        classroom_password=classroom_password,
        classroom_picture=image_url
    )
    db.add(new_class)
    db.commit()
    db.refresh(new_class)
    return {"message": "Classroom created successfully"}

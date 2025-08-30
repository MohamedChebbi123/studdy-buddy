from sqlalchemy import and_
from Utils.Cloudinary_Uploader import upload_user_profile_image
from fastapi import Depends, Form, HTTPException, Header
from Utils.jwt_logic import verify_access_token
from Database.connection import connect_databse
from sqlalchemy.orm import Session
from Models.Classes import Classes
from Models.Classroom_Content import ClassroomContent
from Models.Enrolled_classes import Enrolled_classes
from fastapi import Form, File, UploadFile
from Schemas.EnrolledInCourse import EnrolledInCourse
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



def view_your_classes(
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
    found_classrooms = db.query(Classes).filter(Classes.professor_id == professor_id).all()

    return [
        {
            "class_id":classroom.class_id,
            "class_title": classroom.class_title,
            "class_capacity": classroom.class_capacity,
            "class_field": classroom.class_field,
            "description": classroom.description,
            "classroom_picture": classroom.classroom_picture,
            "classroom_password": classroom.classroom_password,
            "created_at": classroom.created_at
        }
        for classroom in found_classrooms
    ]


def view_class_by_id(
    class_id: int,
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

    found_class = db.query(Classes).filter(
        and_(
            Classes.professor_id == professor_id,
            Classes.class_id == class_id
        )
    ).first()



    return {
        #"class_id":f
        "class_title": found_class.class_title,
        "class_capacity": found_class.class_capacity,
        "class_field": found_class.class_field,
        "description": found_class.description,
        "classroom_picture": found_class.classroom_picture,
        "classroom_password": found_class.classroom_password,
        "created_at": found_class.created_at
    }
    
def fetch_classes(
    authorization: str | None = Header(None),
    db: Session = Depends(connect_databse)):
    
    
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    payload = verify_access_token(token)

    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    classrooms=db.query(Classes).all()
    
    return[
        {
            "class_id":classroom.class_id,
            "class_title": classroom.class_title,
            "class_capacity": classroom.class_capacity,
            "class_field": classroom.class_field,
            "description": classroom.description,
            "classroom_picture": classroom.classroom_picture,
            "created_at": classroom.created_at
        }
        
        for classroom in classrooms
    ]
    
    
    
def enroll_in_a_classroom(
    enrollment_data: EnrolledInCourse,  
    authorization: str | None = Header(None),
    db: Session = Depends(connect_databse)
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    token_payload = verify_access_token(token)  

    if not token_payload or "sub" not in token_payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    student_id = token_payload["sub"] 

    classroom = db.query(Classes).filter(
        Classes.classroom_password == enrollment_data.classroom_password
    ).first()
    if not classroom:
        raise HTTPException(status_code=401, detail="Invalid classroom password")

    existing_enrollment = db.query(Enrolled_classes).filter(
        Enrolled_classes.enrolled_student_id == student_id,
        Enrolled_classes.enrolled_class_id == enrollment_data.class_id
    ).first()
    
    if existing_enrollment:
        raise HTTPException(status_code=400, detail="Already enrolled in this class")

    new_enrollment = Enrolled_classes(
        enrolled_student_id=student_id,
        enrolled_class_id=enrollment_data.class_id
    )
    db.add(new_enrollment)
    db.commit()

    return {
        "message": "Course enrolled successfully"
    }
    
    
    
    
def fetch_enrolled_classes(authorization: str | None = Header(None),
    db: Session = Depends(connect_databse)):
    
    
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    token_payload = verify_access_token(token)  

    if not token_payload or "sub" not in token_payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    student_id = token_payload["sub"] 
    
    enrolled_classes=db.query(Classes).join(Enrolled_classes,Enrolled_classes.enrolled_class_id==Classes.class_id).filter(Enrolled_classes.enrolled_student_id==student_id).all()
    
    
    return[
        {
            "class_id":enrolled_class.class_id,
            "title": enrolled_class.class_title,
            "field": enrolled_class.class_field,
            "capacity": enrolled_class.class_capacity,
            "description": enrolled_class.description,
            "picture": enrolled_class.classroom_picture,
            "created_at": enrolled_class.created_at,
        }
        
        for enrolled_class in enrolled_classes
    ]
    
    

def fetch_enrolled_classes_by_id(class_id:int,authorization: str | None = Header(None),
    db: Session = Depends(connect_databse)):
    
    
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    token_payload = verify_access_token(token)  

    if not token_payload or "sub" not in token_payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    student_id = token_payload["sub"] 
    
    enrolled_classes=db.query(Classes).join(Enrolled_classes,Enrolled_classes.enrolled_class_id==Classes.class_id).join(ClassroomContent,ClassroomContent.classroom_id==Classes.class_id).filter(Enrolled_classes.enrolled_student_id==student_id).all()
    
    return[
        {
            "class_id":enrolled_class.class_id,
            "title": enrolled_class.class_title,
            "field": enrolled_class.class_field,
            "capacity": enrolled_class.class_capacity,
            "description": enrolled_class.description,
            "picture": enrolled_class.classroom_picture,
            "created_at": enrolled_class.created_at,
        }
        
        for enrolled_class in enrolled_classes
    ]
    
def fetch_enrolled_classes_content_by_id(class_id:int,authorization: str | None = Header(None),
    db: Session = Depends(connect_databse)):
    
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    token_payload = verify_access_token(token)  

    if not token_payload or "sub" not in token_payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    
    
    
    enrolled_classes_content=db.query(ClassroomContent).filter(ClassroomContent.classroom_id==class_id).all()
    
    return[
        {
        "file":content.filename ,
        "filecontent":content.cloudinary_public_id,
        "description":content.description ,
        "upload_date":content.uploaded_at ,
        }
        for content in enrolled_classes_content
    ]
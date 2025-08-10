from fastapi import Depends, Form, Header, UploadFile, File,APIRouter
from Database.connection import connect_databse
from sqlalchemy.orm import Session
from Controller.FileUploader_controller import upload_pdf_in_classroom,fetch_classroom_content,download_document

router=APIRouter()

@router.post("/upload_your_pdf")

def upload_courses_as_professor(classroom_id: str = Form(...),  # Get from form data
    description: str = Form(...),   # Get from form data
    file: UploadFile = File(...),  
    authorization: str | None = Header(None),
    db: Session = Depends(connect_databse)):
    
    return upload_pdf_in_classroom(
    classroom_id,  # Get from form data
    description,   # Get from form data
    file,  
    authorization,
    db
    )
@router.get("/view_classroom_content_as_professor/{class_id}")
def view_classroom_content_as_professor(class_id: int, authorization: str | None = Header(None),
    db: Session = Depends(connect_databse)):
    
    return fetch_classroom_content(class_id, authorization, db)


@router.get("/download_pdf/{class_id}/content/{classroom_content_id}")
def download_content_as_professor(
    class_id: int,
    classroom_content_id: int,
    authorization: str | None = Header(None),
    db: Session = Depends(connect_databse),
):
    return download_document(class_id,
    classroom_content_id,
    authorization,
    db)
                  
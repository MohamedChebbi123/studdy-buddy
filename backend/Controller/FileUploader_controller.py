from fastapi import Depends, HTTPException, Header, UploadFile, File, Form
from Database.connection import connect_databse
from Utils.File_Uploader import upload_your_files
from sqlalchemy.orm import Session
from Utils.jwt_logic import verify_access_token
from Models.Classroom_Content import ClassroomContent



def upload_pdf_in_classroom(
    classroom_id: str = Form(...),  # Get from form data
    description: str = Form(...),   # Get from form data
    file: UploadFile = File(...),  
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

    # Upload the PDF to Cloudinary
    cloudinary_url = upload_your_files(file)
    filename = file.filename

    # Create the DB record
    new_classroom_content = ClassroomContent(
        classroom_id=classroom_id,
        filename=filename,
        cloudinary_public_id=cloudinary_url,
        description=description
    )

    db.add(new_classroom_content)
    db.commit()
    db.refresh(new_classroom_content)

    return {
        "message": "File uploaded and classroom content saved successfully.",
    }
    
    
def fetch_classroom_content(class_id: int,authorization: str | None = Header(None),
    db: Session = Depends(connect_databse)):
    
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    token_payload = verify_access_token(token)

    if not token_payload or "sub" not in token_payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    classroom_contents = (
    db.query(ClassroomContent)
    .filter(ClassroomContent.classroom_content_id == class_id)
    .all()
)    
    return [
    {
        
        "filename": content.filename,
        "cloudinary_public_id": content.cloudinary_public_id,
        "description": content.description,
        "uploaded_at": content.uploaded_at
    }
    for content in classroom_contents
]
    
    
def download_document(class_id: int,
    classroom_content_id: int,
    authorization: str | None = Header(None),
    db: Session = Depends(connect_databse)):
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    token_payload = verify_access_token(token)
    if not token_payload or "sub" not in token_payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    download_content = db.query(ClassroomContent).filter(
        ClassroomContent.classroom_id == class_id,
        ClassroomContent.classroom_content_id == classroom_content_id
    ).first()

    if not download_content:
        raise HTTPException(status_code=404, detail="Content not found")

    file_url = f"https://res.cloudinary.com/djxerkcjl/raw/upload/{download_content.cloudinary_public_id}.pdf"
    
    return {"url": file_url}

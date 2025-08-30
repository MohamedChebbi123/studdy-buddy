from Controller.Pdf_analyzer_controller import pdfanalyzer
from fastapi import APIRouter, Depends, File, Header, UploadFile
from sqlalchemy.orm import Session
from Database.connection import connect_databse
from Controller.pdfuploader import upload_your_pdf,fetch_your_pdfs,view_pdf_by_id,chat_with_your_pdf
from Schemas.ChatRequest import ChatRequest



router=APIRouter()


@router.post("/upload_student_pdf")
async def upload_your_pdf_as_a_student(file:UploadFile=File(...),authorization: str = Header(...),
    db:Session=Depends(connect_databse)):
    
    return await upload_your_pdf(file,authorization,db)


@router.get("/fetch_your_pdfs")
def fetch_your_pdfs_a_student(authorization: str = Header(...),
                db: Session = Depends(connect_databse)):
    return fetch_your_pdfs(authorization,db)


@router.get("/view_pdf_by_id/{pdf_id}")
def view_pdf_by_id_as_a_student(pdf_id:int,authorization: str = Header(...),
    db: Session = Depends(connect_databse)):
    
    return view_pdf_by_id(pdf_id,authorization,db)

@router.post("/view_pdf_by_id/{pdf_id}/chat")
def chat_with_your_pdf_as_astudent(pdf_id:int,request:ChatRequest,authorization: str = Header(...),
    db: Session = Depends(connect_databse)):
    
    return chat_with_your_pdf(pdf_id,request,authorization,db)
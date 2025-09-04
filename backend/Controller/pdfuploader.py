import os
from dotenv import load_dotenv
from fastapi import Depends, File, HTTPException, Header,UploadFile,status
from openai import BaseModel, OpenAI
from sqlalchemy.orm import Session
from Database.connection import connect_databse
from Utils.jwt_logic import verify_access_token
from Models.Pdfinventory import Pdfinventory
from Utils.text_extractor import textextractor
import base64
from Schemas.ChatRequest import ChatRequest



async def upload_your_pdf(
    file: UploadFile = File(...),
    authorization: str = Header(...),
    db: Session = Depends(connect_databse)
):
    
    
    
    content = await file.read()
    
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    payload = verify_access_token(token)

    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    student_id = payload["sub"]
    
    extracted_text=textextractor(file)
    
    
    new_pdf=Pdfinventory(
        student_id = student_id,
        pdf_name = file.filename,
        pdf_content = content,
        pdf_chunked_text=extracted_text
    )
    
    db.add(new_pdf)
    db.commit()
    db.refresh(new_pdf)
    
    return{"message":"File uploaded successfully"}


def fetch_your_pdfs(authorization: str = Header(...),
    db: Session = Depends(connect_databse)):
    
    
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    payload = verify_access_token(token)

    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    student_id = payload["sub"]
    
    
    pdfs=db.query(Pdfinventory).filter(Pdfinventory.student_id==student_id).all()
    
    return[
        {
            "pdf_id":pdf.pdf_id,
            "pdf_name":pdf.pdf_name,
            "pdffile": base64.b64encode(pdf.pdf_content).decode("utf-8")  
 
        }
        for pdf in pdfs
    ]
    
    
def view_pdf_by_id(pdf_id:int,authorization: str = Header(...),
    db: Session = Depends(connect_databse)):

        
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    payload = verify_access_token(token)

    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    student_id = payload["sub"]
    
    single_pdf = db.query(Pdfinventory).filter(Pdfinventory.pdf_id == pdf_id,Pdfinventory.student_id == student_id).first()        
    return{
        "pdf_name":single_pdf.pdf_name,
        "pdf_content":base64.b64encode(single_pdf.pdf_content).decode("utf-8"),
        "chunked_text":single_pdf.pdf_chunked_text
    } 
    
    
def chat_with_your_pdf(pdf_id:int,request:ChatRequest,authorization: str = Header(...),
    db: Session = Depends(connect_databse)):
    
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    payload = verify_access_token(token)

    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    student_id = payload["sub"]
    
    single_pdf = db.query(Pdfinventory).filter(Pdfinventory.pdf_id == pdf_id,Pdfinventory.student_id == student_id).first()  
    
    
    load_dotenv()
    key = os.getenv("OPENROUTER_API_KEY")
    

    client = OpenAI(
        api_key=key,
        base_url="https://openrouter.ai/api/v1"
)

    completion = client.chat.completions.create(
        extra_body={},
        model="cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
        messages = [
    {"role": "system","content": "You are an AI assistant that answers PDF questions. If the user asks for YouTube videos, respond with YouTube search links, not just titles."},
    {"role": "user","content": f"Answer questions about this {single_pdf.pdf_chunked_text}. If the user asks for YouTube videos, return clickable YouTube search links i know you can."},
    {"role":"user","content": f"question: {request.message}"}
]
    )
    answer=completion.choices[0].message.content
    
    #print(answer)

    return {"message": answer}
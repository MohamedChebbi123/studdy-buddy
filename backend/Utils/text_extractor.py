from fastapi import File,UploadFile,HTTPException,status
from pypdf import PdfReader
def textextractor(file:UploadFile=File(...)):
    if not file.filename.endswith("pdf"):
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,detail="pls upload a pdf")
    
    
    pdf_content=[]
    
    reader=PdfReader(file.file)
    
    for page_number, page  in enumerate(reader.pages,start=1):
        text=page.extract_text()
        
        if text:
            pdf_content.append({
                "page":page_number,
                "page_content":text
            })
            
    return pdf_content
    
import os  
import cloudinary  
import cloudinary.uploader
from fastapi import HTTPException, UploadFile, status  
from dotenv import load_dotenv  


load_dotenv()

cloudinary.config(    
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),    
    api_key=os.getenv("CLOUDINARY_API_KEY"),    
    api_secret=os.getenv("CLOUDINARY_API_SECRET") 
)

def upload_your_files(file:UploadFile)->str:
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,detail='pls uplaod a pdf file')
    try:
       result = cloudinary.uploader.upload(file.file)
       return result.get("secure_url")
    except Exception as e :
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Failed to upload file")




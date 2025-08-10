from pydantic import BaseModel

class FileUploadSchema(BaseModel):
    classroom_id: int  
    cloudinary_public_id: str
    description: str

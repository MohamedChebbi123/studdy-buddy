from pydantic import BaseModel,EmailStr


class professor_register(BaseModel):
    first_name:str
    last_name:str
    phone_number:int
    email:EmailStr
    password:str
    country:str
    educational_field:str
    descritpion:str
    profile_picture:str
    
    
class professor_login(BaseModel):
    email:EmailStr
    password:str


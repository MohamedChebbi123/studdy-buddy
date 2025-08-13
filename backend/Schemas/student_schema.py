from pydantic import BaseModel,EmailStr

class studentlogin(BaseModel):
    email:EmailStr
    password:str
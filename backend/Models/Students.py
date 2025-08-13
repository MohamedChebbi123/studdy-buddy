from sqlalchemy import Column,String,Integer,DateTime

from Database.connection import Base

class Student(Base):
    __tablename__="student"
    student_id=Column(Integer,primary_key=True,index=True)
    first_name=Column(String,nullable=False)
    last_name=Column(String,nullable=False)
    email=Column(String,nullable=False)
    password=Column(String,nullable=False)
    phone_number=Column(String,nullable=False)
    academic_level=Column(String,nullable=False)
    profile_image=Column(String,nullable=False)
    country=Column(String,nullable=False)
    descritpion=Column(String,nullable=False)
    joined_at=Column(DateTime(timezone=True))
    
from sqlalchemy import Column,String,Numeric,Integer,DateTime
from Database.connection import Base

class Proffessor(Base):
    __tablename__="professor"
    id=Column(Integer,index=True,primary_key=True)
    first_name=Column(String,nullable=False)
    last_name=Column(String,nullable=False)
    phone_number=Column(Numeric,nullable=False,unique=False)
    email=Column(String,nullable=False,unique=False)
    password=Column(String,nullable=False,unique=False)
    country=Column(String,nullable=False)
    educational_field=Column(String,nullable=False)
    description=Column(String,nullable=False)
    joined_at=Column(DateTime(timezone=True))
    profile_picture=Column(String,nullable=False)
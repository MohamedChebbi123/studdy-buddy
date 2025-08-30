from sqlalchemy import Column,String,Integer,DateTime
from sqlalchemy.orm import relationship

from Database.connection import Base

# Student model
class Student(Base):
    __tablename__ = "student"

    student_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    academic_level = Column(String, nullable=False)
    profile_image = Column(String, nullable=False)
    country = Column(String, nullable=False)
    descritpion = Column(String, nullable=False)
    joined_at = Column(DateTime(timezone=True))

    enrollements = relationship("Enrolled_classes", back_populates="student", cascade="all, delete-orphan")
    pdfs = relationship("Pdfinventory", back_populates="student", cascade="all, delete-orphan")

    
    
    
    
    
    
    
    
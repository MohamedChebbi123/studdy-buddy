from sqlalchemy import Column,DateTime,Integer,ForeignKey
from Database.connection import Base
from sqlalchemy.orm import relationship

class Enrolled_classes(Base):
    __tablename__="enrolled_courses"
    
    enrolled_courses_id=Column(Integer,primary_key=True,index=True,autoincrement=True)
    enrolled_student_id=Column(Integer,ForeignKey("student.student_id",ondelete="CASCADE"),nullable=False)
    enrolled_class_id=Column(Integer,ForeignKey("classes.class_id",ondelete="CASCADE"),nullable=False)
    joined_at=Column(DateTime(timezone=True))
    
    student=relationship("Student", back_populates="enrollements")
    classes=relationship("Classes", back_populates="enrollements")
    
    
        
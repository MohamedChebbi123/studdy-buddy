from Database.connection import Base
from sqlalchemy import Column, DateTime, String, Integer, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class Classes(Base):
    __tablename__ = "classes"
    
    class_id = Column(Integer, index=True, primary_key=True, autoincrement=True)
    professor_id = Column(Integer, ForeignKey("professor.id", ondelete="CASCADE"), nullable=False)
    class_title = Column(String, nullable=False)
    class_capacity = Column(Integer, nullable=True)
    class_field = Column(String, nullable=False)
    description = Column(String, nullable=False)
    classroom_picture=Column(String,nullable=False)
    classroom_password=Column(String,nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    professor = relationship("Proffessor", back_populates="classes")

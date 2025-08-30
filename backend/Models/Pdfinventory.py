# Pdfinventory model
from sqlalchemy import Column, ForeignKey, Integer, LargeBinary, String,JSON
from sqlalchemy.orm import relationship

from Database.connection import Base



class Pdfinventory(Base):
    __tablename__ = "pdf_inventory"

    pdf_id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("student.student_id", ondelete="CASCADE"), nullable=False)
    pdf_name = Column(String, nullable=False)
    pdf_content = Column(LargeBinary, nullable=False)
    pdf_chunked_text=Column(JSON,nullable=False)

    student = relationship("Student", back_populates="pdfs")

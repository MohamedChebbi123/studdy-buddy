from sqlalchemy import Column, DateTime, String, Integer, LargeBinary,Text, func,ForeignKey
from Database.connection import Base
from sqlalchemy.orm import relationship


class ClassroomContent(Base):
    __tablename__ = "classroom_content"

    classroom_content_id = Column(Integer, primary_key=True, autoincrement=True)
    classroom_id = Column(Integer, ForeignKey("classes.class_id", ondelete="CASCADE"), nullable=False)
    filename = Column(String, nullable=False)
    cloudinary_public_id = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    classroom = relationship("Classes", back_populates="classroom_contents")
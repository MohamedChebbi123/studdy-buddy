from pydantic import BaseModel

class EnrolledInCourse(BaseModel):
    class_id: int
    classroom_password: str
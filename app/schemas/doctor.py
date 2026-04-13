from pydantic import BaseModel
from typing import Optional

class DoctorBase(BaseModel):
    user_id: int
    specialty: Optional[str] = None
    hospital_id: Optional[int] = None
    contact_info: Optional[str] = None

class DoctorCreate(DoctorBase):
    pass

class DoctorUpdate(BaseModel):
    specialty: Optional[str] = None
    hospital_id: Optional[int] = None
    contact_info: Optional[str] = None

class DoctorResponse(DoctorBase):
    doctor_id: int

    class Config:
        from_attributes = True

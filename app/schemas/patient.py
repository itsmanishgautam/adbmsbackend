from pydantic import BaseModel
from typing import Optional

class PatientBase(BaseModel):
    user_id: int
    emergency_identifier: str
    blood_type: Optional[str] = None
    emergency_contact_summary: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    blood_type: Optional[str] = None
    emergency_contact_summary: Optional[str] = None

class PatientResponse(PatientBase):
    patient_id: int

    class Config:
        from_attributes = True

class PatientCardResponse(PatientResponse):
    name: str # Add name from User model
    # Will be manually assembled
    class Config:
        from_attributes = True

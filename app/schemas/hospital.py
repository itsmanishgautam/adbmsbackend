from pydantic import BaseModel
from typing import Optional

class HospitalBase(BaseModel):
    name: str
    address: Optional[str] = None
    contact_number: Optional[str] = None
    type: Optional[str] = None

class HospitalCreate(HospitalBase):
    pass

class HospitalUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    contact_number: Optional[str] = None
    type: Optional[str] = None

class HospitalResponse(HospitalBase):
    hospital_id: int

    class Config:
        from_attributes = True

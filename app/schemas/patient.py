from pydantic import BaseModel
from typing import Optional, List
from .medical import AllergyResponse, ConditionResponse, MedicationResponse, DeviceResponse, EmergencyContactResponse
from .insurance import PatientInsuranceResponse

class PatientBase(BaseModel):
    user_id: int
    emergency_identifier: str
    blood_type: Optional[str] = None
    emergency_contact_summary: Optional[str] = None
    approval_status: Optional[str] = "pending"

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    blood_type: Optional[str] = None
    emergency_contact_summary: Optional[str] = None
    approval_status: Optional[str] = "pending"

class PatientResponse(PatientBase):
    patient_id: int
    allergies: List[AllergyResponse] = []
    conditions: List[ConditionResponse] = []
    medications: List[MedicationResponse] = []
    devices: List[DeviceResponse] = []
    emergency_contacts: List[EmergencyContactResponse] = []
    insurances: List[PatientInsuranceResponse] = []

    class Config:
        from_attributes = True

class PatientCardResponse(PatientResponse):
    name: str # Add name from User model
    # Will be manually assembled
    class Config:
        from_attributes = True

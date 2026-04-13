from pydantic import BaseModel
from typing import Optional

# Allergy
class AllergyBase(BaseModel):
    patient_id: int
    allergy_name: str
    severity: Optional[str] = None

class AllergyCreate(AllergyBase):
    pass

class AllergyResponse(AllergyBase):
    allergy_id: int
    class Config:
        from_attributes = True

# Condition
class ConditionBase(BaseModel):
    patient_id: int
    condition_name: str
    critical_flag: Optional[bool] = False

class ConditionCreate(ConditionBase):
    pass

class ConditionResponse(ConditionBase):
    condition_id: int
    class Config:
        from_attributes = True

# Medication
class MedicationBase(BaseModel):
    patient_id: int
    medication_name: str
    dosage: Optional[str] = None

class MedicationCreate(MedicationBase):
    pass

class MedicationResponse(MedicationBase):
    medication_id: int
    class Config:
        from_attributes = True

# Device
class DeviceBase(BaseModel):
    patient_id: int
    device_name: str
    device_type: Optional[str] = None

class DeviceCreate(DeviceBase):
    pass

class DeviceResponse(DeviceBase):
    device_id: int
    class Config:
        from_attributes = True

# EmergencyContact
class EmergencyContactBase(BaseModel):
    patient_id: int
    contact_name: str
    contact_relationship: Optional[str] = None
    phone_number: Optional[str] = None

class EmergencyContactCreate(EmergencyContactBase):
    pass

class EmergencyContactResponse(EmergencyContactBase):
    contact_id: int
    class Config:
        from_attributes = True

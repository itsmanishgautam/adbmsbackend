from pydantic import BaseModel
from typing import Optional

# InsuranceProvider
class InsuranceProviderBase(BaseModel):
    provider_name: str
    payer_phone: Optional[str] = None
    contact_email: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None

class InsuranceProviderCreate(InsuranceProviderBase):
    pass

class InsuranceProviderResponse(InsuranceProviderBase):
    provider_id: int
    class Config:
        from_attributes = True

# PatientInsurance
class PatientInsuranceBase(BaseModel):
    patient_id: int
    provider_id: int
    plan_type: Optional[str] = None
    member_id: Optional[str] = None
    group_number: Optional[str] = None
    coverage_status: Optional[str] = None
    approval_status: Optional[str] = "pending"

class PatientInsuranceCreate(PatientInsuranceBase):
    pass

class PatientInsuranceResponse(PatientInsuranceBase):
    patient_insurance_id: int
    class Config:
        from_attributes = True

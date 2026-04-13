from pydantic import BaseModel
from typing import Optional

# InsuranceProvider
class InsuranceProviderBase(BaseModel):
    provider_name: str
    payer_phone: Optional[str] = None

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

class PatientInsuranceCreate(PatientInsuranceBase):
    pass

class PatientInsuranceResponse(PatientInsuranceBase):
    patient_insurance_id: int
    class Config:
        from_attributes = True

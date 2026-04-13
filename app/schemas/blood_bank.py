from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BloodBankBase(BaseModel):
    blood_type: str
    units_available: Optional[int] = 0

class BloodBankCreate(BloodBankBase):
    pass

class BloodBankUpdate(BaseModel):
    units_available: Optional[int] = None

class BloodBankResponse(BloodBankBase):
    id: int
    last_updated: datetime

    class Config:
        from_attributes = True

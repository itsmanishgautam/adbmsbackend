from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class IncidentBase(BaseModel):
    title: str
    description: str
    patient_id: Optional[int] = None
    status: Optional[str] = "open"
    resolution_notes: Optional[str] = None

class IncidentCreate(IncidentBase):
    pass

class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    resolution_notes: Optional[str] = None

class IncidentResponse(IncidentBase):
    incident_id: int
    reported_by: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

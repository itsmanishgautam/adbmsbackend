from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any, Dict

class AccessLogBase(BaseModel):
    action: str
    resource: Optional[str] = None
    ip_address: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

class AccessLogCreate(AccessLogBase):
    user_id: Optional[int] = None

class AccessLogResponse(AccessLogBase):
    log_id: int
    user_id: Optional[int] = None
    timestamp: datetime

    class Config:
        from_attributes = True

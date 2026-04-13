from app.crud.base import CRUDBase
from app.crud.crud_user import user
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate
from app.models.doctor import Doctor
from app.schemas.doctor import DoctorCreate, DoctorUpdate
from app.models.hospital import Hospital
from app.schemas.hospital import HospitalCreate, HospitalUpdate
from app.models.medical import (
    Allergy, Condition, Medication, Device, EmergencyContact
)
from app.schemas.medical import (
    AllergyCreate, ConditionCreate, MedicationCreate, DeviceCreate, EmergencyContactCreate
)
from app.models.insurance import InsuranceProvider, PatientInsurance
from app.schemas.insurance import (
    InsuranceProviderCreate, PatientInsuranceCreate
)
from app.models.log import AccessLog
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

class CRUDPatienInsurance(CRUDBase[PatientInsurance, PatientInsuranceCreate, BaseModel]):
    pass

patient = CRUDBase[Patient, PatientCreate, PatientUpdate](Patient)
doctor = CRUDBase[Doctor, DoctorCreate, DoctorUpdate](Doctor)
hospital = CRUDBase[Hospital, HospitalCreate, HospitalUpdate](Hospital)
allergy = CRUDBase[Allergy, AllergyCreate, BaseModel](Allergy)
condition = CRUDBase[Condition, ConditionCreate, BaseModel](Condition)
medication = CRUDBase[Medication, MedicationCreate, BaseModel](Medication)
device = CRUDBase[Device, DeviceCreate, BaseModel](Device)
emergency_contact = CRUDBase[EmergencyContact, EmergencyContactCreate, BaseModel](EmergencyContact)
insurance_provider = CRUDBase[InsuranceProvider, InsuranceProviderCreate, BaseModel](InsuranceProvider)
patient_insurance = CRUDPatienInsurance(PatientInsurance)

class CRUDAccessLog(CRUDBase[AccessLog, BaseModel, BaseModel]):
    async def log_action(self, db: AsyncSession, user_id: int | None, action: str, ip_address: str | None = None, resource: str | None = None, details: dict | None = None):
        import json
        details_str = json.dumps(details) if details else None
        db_obj = AccessLog(user_id=user_id, action=action, ip_address=ip_address, resource=resource, details=details_str)
        db.add(db_obj)
        await db.commit()

    async def get_logs_filtered(self, db: AsyncSession, skip: int = 0, limit: int = 100, user_id: int | None = None, action: str | None = None, date_start: str | None = None, date_end: str | None = None):
        from sqlalchemy import text
        from datetime import datetime
        
        query = select(AccessLog)
        
        if user_id:
            query = query.where(AccessLog.user_id == user_id)
        if action:
            query = query.where(AccessLog.action.ilike(f"%{action}%"))
        
        # Simple date filtering if dates are provided in isoformat
        if date_start:
            try:
                start = datetime.fromisoformat(date_start.replace('Z', '+00:00'))
                query = query.where(AccessLog.timestamp >= start)
            except ValueError:
                pass
        if date_end:
            try:
                end = datetime.fromisoformat(date_end.replace('Z', '+00:00'))
                query = query.where(AccessLog.timestamp <= end)
            except ValueError:
                pass
                
        query = query.order_by(AccessLog.timestamp.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

access_log = CRUDAccessLog(AccessLog)
from app.crud.crud_blood_bank import blood_bank

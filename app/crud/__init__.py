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
    async def log_action(self, db: AsyncSession, user_id: int, action: str, ip_address: str):
        db_obj = AccessLog(user_id=user_id, action=action, ip_address=ip_address)
        db.add(db_obj)
        await db.commit()

access_log = CRUDAccessLog(AccessLog)

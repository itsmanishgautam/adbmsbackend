from app.db.base import Base
from app.models.user import User
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.hospital import Hospital
from app.models.medical import Allergy, Condition, Medication, Device, EmergencyContact
from app.models.insurance import InsuranceProvider, PatientInsurance
from app.models.log import AccessLog
from app.models.user import UserRole

# For Alembic to discover all models

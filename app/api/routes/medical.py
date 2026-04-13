from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app import crud, models, schemas
from app.db.session import get_db
from app.core.dependencies import get_current_active_user

router = APIRouter()

# Allergy
@router.get("/allergies", response_model=List[schemas.AllergyResponse])
async def read_allergies(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await crud.allergy.get_multi(db, skip=skip, limit=limit)

@router.post("/allergies", response_model=schemas.AllergyResponse)
async def create_allergy(allergy_in: schemas.AllergyCreate, db: AsyncSession = Depends(get_db)):
    return await crud.allergy.create(db, obj_in=allergy_in)

# Condition
@router.get("/conditions", response_model=List[schemas.ConditionResponse])
async def read_conditions(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await crud.condition.get_multi(db, skip=skip, limit=limit)

@router.post("/conditions", response_model=schemas.ConditionResponse)
async def create_condition(condition_in: schemas.ConditionCreate, db: AsyncSession = Depends(get_db)):
    return await crud.condition.create(db, obj_in=condition_in)

# Medication
@router.get("/medications", response_model=List[schemas.MedicationResponse])
async def read_medications(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await crud.medication.get_multi(db, skip=skip, limit=limit)

@router.post("/medications", response_model=schemas.MedicationResponse)
async def create_medication(medication_in: schemas.MedicationCreate, db: AsyncSession = Depends(get_db)):
    return await crud.medication.create(db, obj_in=medication_in)

# Device
@router.get("/devices", response_model=List[schemas.DeviceResponse])
async def read_devices(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await crud.device.get_multi(db, skip=skip, limit=limit)

@router.post("/devices", response_model=schemas.DeviceResponse)
async def create_device(device_in: schemas.DeviceCreate, db: AsyncSession = Depends(get_db)):
    return await crud.device.create(db, obj_in=device_in)

# Emergency Contacts
@router.get("/emergency-contacts", response_model=List[schemas.EmergencyContactResponse])
async def read_emergency_contacts(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await crud.emergency_contact.get_multi(db, skip=skip, limit=limit)

@router.post("/emergency-contacts", response_model=schemas.EmergencyContactResponse)
async def create_emergency_contact(contact_in: schemas.EmergencyContactCreate, db: AsyncSession = Depends(get_db)):
    return await crud.emergency_contact.create(db, obj_in=contact_in)

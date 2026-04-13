from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app import crud, models, schemas
from app.db.session import get_db
from app.core.dependencies import get_current_active_user

router = APIRouter()

async def get_patient_id(db: AsyncSession, current_user: models.User) -> int:
    patient = await crud.patient.get_by_field(db, "user_id", current_user.id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
    return getattr(patient, "patient_id")

async def verify_ownership(db: AsyncSession, item_id: int, crud_obj, current_user: models.User, resource_name: str):
    item = await crud_obj.get(db, id=item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{resource_name} not found")
    if current_user.role.value == "patient":
        patient_id = await get_patient_id(db, current_user)
        if item.patient_id != patient_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough privileges")
    return item

def log_medical_action(db, current_user, action_type: str, resource_name: str, details: dict):
    return crud.access_log.log_action(
        db=db,
        user_id=current_user.id,
        action=f"{action_type} {resource_name}",
        resource="Medical API",
        details=details
    )

# Allergy
@router.get("/allergies", response_model=List[schemas.AllergyResponse])
async def read_allergies(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    if current_user.role.value == "patient":
        patient_id = await get_patient_id(db, current_user)
        return await crud.allergy.get_multi_by_field(db, "patient_id", patient_id, skip=skip, limit=limit)
    return await crud.allergy.get_multi(db, skip=skip, limit=limit)

@router.post("/allergies", response_model=schemas.AllergyResponse)
async def create_allergy(allergy_in: schemas.AllergyCreate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    if current_user.role.value == "patient":
        allergy_in.patient_id = await get_patient_id(db, current_user)
    obj = await crud.allergy.create(db, obj_in=allergy_in)
    await log_medical_action(db, current_user, "Create", "Allergy", {"id": obj.allergy_id})
    return obj

@router.put("/allergies/{id}", response_model=schemas.AllergyResponse)
async def update_allergy(id: int, allergy_in: schemas.AllergyCreate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    item = await verify_ownership(db, id, crud.allergy, current_user, "Allergy")
    obj = await crud.allergy.update(db, db_obj=item, obj_in=allergy_in)
    await log_medical_action(db, current_user, "Update", "Allergy", {"id": id})
    return obj

@router.delete("/allergies/{id}")
async def delete_allergy(id: int, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    await verify_ownership(db, id, crud.allergy, current_user, "Allergy")
    await crud.allergy.remove(db, id=id)
    await log_medical_action(db, current_user, "Delete", "Allergy", {"id": id})
    return {"message": "Deleted successfully"}

# Condition
@router.get("/conditions", response_model=List[schemas.ConditionResponse])
async def read_conditions(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    if current_user.role.value == "patient":
        patient_id = await get_patient_id(db, current_user)
        return await crud.condition.get_multi_by_field(db, "patient_id", patient_id, skip=skip, limit=limit)
    return await crud.condition.get_multi(db, skip=skip, limit=limit)

@router.post("/conditions", response_model=schemas.ConditionResponse)
async def create_condition(condition_in: schemas.ConditionCreate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    if current_user.role.value == "patient":
        condition_in.patient_id = await get_patient_id(db, current_user)
    obj = await crud.condition.create(db, obj_in=condition_in)
    await log_medical_action(db, current_user, "Create", "Condition", {"id": obj.condition_id})
    return obj

@router.put("/conditions/{id}", response_model=schemas.ConditionResponse)
async def update_condition(id: int, condition_in: schemas.ConditionCreate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    item = await verify_ownership(db, id, crud.condition, current_user, "Condition")
    obj = await crud.condition.update(db, db_obj=item, obj_in=condition_in)
    await log_medical_action(db, current_user, "Update", "Condition", {"id": id})
    return obj

@router.delete("/conditions/{id}")
async def delete_condition(id: int, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    await verify_ownership(db, id, crud.condition, current_user, "Condition")
    await crud.condition.remove(db, id=id)
    await log_medical_action(db, current_user, "Delete", "Condition", {"id": id})
    return {"message": "Deleted successfully"}

# Medication
@router.get("/medications", response_model=List[schemas.MedicationResponse])
async def read_medications(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    if current_user.role.value == "patient":
        patient_id = await get_patient_id(db, current_user)
        return await crud.medication.get_multi_by_field(db, "patient_id", patient_id, skip=skip, limit=limit)
    return await crud.medication.get_multi(db, skip=skip, limit=limit)

@router.post("/medications", response_model=schemas.MedicationResponse)
async def create_medication(medication_in: schemas.MedicationCreate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    if current_user.role.value == "patient":
        medication_in.patient_id = await get_patient_id(db, current_user)
    obj = await crud.medication.create(db, obj_in=medication_in)
    await log_medical_action(db, current_user, "Create", "Medication", {"id": obj.medication_id})
    return obj

@router.put("/medications/{id}", response_model=schemas.MedicationResponse)
async def update_medication(id: int, medication_in: schemas.MedicationCreate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    item = await verify_ownership(db, id, crud.medication, current_user, "Medication")
    obj = await crud.medication.update(db, db_obj=item, obj_in=medication_in)
    await log_medical_action(db, current_user, "Update", "Medication", {"id": id})
    return obj

@router.delete("/medications/{id}")
async def delete_medication(id: int, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    await verify_ownership(db, id, crud.medication, current_user, "Medication")
    await crud.medication.remove(db, id=id)
    await log_medical_action(db, current_user, "Delete", "Medication", {"id": id})
    return {"message": "Deleted successfully"}

# Device
@router.get("/devices", response_model=List[schemas.DeviceResponse])
async def read_devices(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    if current_user.role.value == "patient":
        patient_id = await get_patient_id(db, current_user)
        return await crud.device.get_multi_by_field(db, "patient_id", patient_id, skip=skip, limit=limit)
    return await crud.device.get_multi(db, skip=skip, limit=limit)

@router.post("/devices", response_model=schemas.DeviceResponse)
async def create_device(device_in: schemas.DeviceCreate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    if current_user.role.value == "patient":
        device_in.patient_id = await get_patient_id(db, current_user)
    obj = await crud.device.create(db, obj_in=device_in)
    await log_medical_action(db, current_user, "Create", "Device", {"id": obj.device_id})
    return obj

@router.put("/devices/{id}", response_model=schemas.DeviceResponse)
async def update_device(id: int, device_in: schemas.DeviceCreate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    item = await verify_ownership(db, id, crud.device, current_user, "Device")
    obj = await crud.device.update(db, db_obj=item, obj_in=device_in)
    await log_medical_action(db, current_user, "Update", "Device", {"id": id})
    return obj

@router.delete("/devices/{id}")
async def delete_device(id: int, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    await verify_ownership(db, id, crud.device, current_user, "Device")
    await crud.device.remove(db, id=id)
    await log_medical_action(db, current_user, "Delete", "Device", {"id": id})
    return {"message": "Deleted successfully"}

# Emergency Contacts
@router.get("/emergency-contacts", response_model=List[schemas.EmergencyContactResponse])
async def read_emergency_contacts(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    if current_user.role.value == "patient":
        patient_id = await get_patient_id(db, current_user)
        return await crud.emergency_contact.get_multi_by_field(db, "patient_id", patient_id, skip=skip, limit=limit)
    return await crud.emergency_contact.get_multi(db, skip=skip, limit=limit)

@router.post("/emergency-contacts", response_model=schemas.EmergencyContactResponse)
async def create_emergency_contact(contact_in: schemas.EmergencyContactCreate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    if current_user.role.value == "patient":
        contact_in.patient_id = await get_patient_id(db, current_user)
    obj = await crud.emergency_contact.create(db, obj_in=contact_in)
    await log_medical_action(db, current_user, "Create", "Emergency Contact", {"id": obj.contact_id})
    return obj

@router.put("/emergency-contacts/{id}", response_model=schemas.EmergencyContactResponse)
async def update_emergency_contact(id: int, contact_in: schemas.EmergencyContactCreate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    item = await verify_ownership(db, id, crud.emergency_contact, current_user, "Emergency Contact")
    obj = await crud.emergency_contact.update(db, db_obj=item, obj_in=contact_in)
    await log_medical_action(db, current_user, "Update", "Emergency Contact", {"id": id})
    return obj

@router.delete("/emergency-contacts/{id}")
async def delete_emergency_contact(id: int, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    await verify_ownership(db, id, crud.emergency_contact, current_user, "Emergency Contact")
    await crud.emergency_contact.remove(db, id=id)
    await log_medical_action(db, current_user, "Delete", "Emergency Contact", {"id": id})
    return {"message": "Deleted successfully"}

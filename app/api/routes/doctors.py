from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select
from typing import Any
from app import crud, models, schemas
from app.db.session import get_db
from app.core.dependencies import require_role

router = APIRouter()

@router.get("/emergency/search", response_model=schemas.PatientCardResponse)
async def search_patient(
    identifier: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("doctor"))
) -> Any:
    from sqlalchemy import or_
    
    patient_id_filter = None
    user_id_filter = None
    if identifier.isdigit():
        patient_id_filter = models.Patient.patient_id == int(identifier)
        user_id_filter = models.User.id == int(identifier)
        
    filters = [
        models.Patient.emergency_identifier == identifier,
        models.User.name.ilike(f"%{identifier}%"),
        models.User.phone_number.ilike(f"%{identifier}%")
    ]
    if patient_id_filter is not None:
        filters.append(patient_id_filter)
    if user_id_filter is not None:
        filters.append(user_id_filter)
        
    query = select(models.Patient).join(models.User).filter(or_(*filters))
    result = await db.execute(query)
    patient = result.scalars().first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found matching the provided search criteria")
    
    user = await crud.user.get(db, id=patient.user_id)
    
    data = schemas.PatientResponse.model_validate(patient).model_dump()
    data["name"] = user.name
    return data

@router.get("/patients/{id}/card", response_model=schemas.PatientCardResponse)
async def get_patient_card(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("doctor"))
) -> Any:
    patient = await crud.patient.get(db, id=id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    user = await crud.user.get(db, id=patient.user_id)
    
    data = schemas.PatientResponse.model_validate(patient).model_dump()
    data["name"] = user.name
    return data

@router.get("/doctor/profile", response_model=schemas.DoctorResponse)
async def get_doctor_profile(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("doctor"))
) -> Any:
    doctor = await crud.doctor.get_by_field(db, "user_id", current_user.id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
    return doctor

@router.put("/doctor/profile", response_model=schemas.DoctorResponse)
async def update_doctor_profile(
    doctor_in: schemas.DoctorUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("doctor"))
) -> Any:
    doctor = await crud.doctor.get_by_field(db, "user_id", current_user.id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
    
    # Force pending status when updated by doctor themselves
    update_data = doctor_in.model_dump(exclude_unset=True)
    update_data["approval_status"] = "pending"
    
    doctor = await crud.doctor.update(db, db_obj=doctor, obj_in=update_data)
    await crud.access_log.log_action(db, current_user.id, "Update Profile", resource="Doctor API")
    return doctor

@router.patch("/doctor/profile/{id}/approve", response_model=schemas.DoctorResponse)
async def approve_doctor_profile(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
) -> Any:
    doctor = await crud.doctor.get(db, id=id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
        
    doctor = await crud.doctor.update(db, db_obj=doctor, obj_in={"approval_status": "approved"})
    await crud.access_log.log_action(db, current_user.id, f"Approved Doctor {id}", resource="Admin API")
    return doctor

@router.patch("/patients/{id}/approve")
async def approve_patient_profile(
    id: int,
    status: str = "approved",
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("doctor"))
) -> Any:
    # Get the patient directly
    patient = await crud.patient.get(db, id=id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
        
    patient_query = await db.execute(
        select(models.Patient).options(
            selectinload(models.Patient.allergies),
            selectinload(models.Patient.conditions),
            selectinload(models.Patient.medications),
            selectinload(models.Patient.devices),
            selectinload(models.Patient.emergency_contacts),
            selectinload(models.Patient.insurances)
        ).filter(models.Patient.patient_id == id)
    )
    patient_full = patient_query.scalars().first()
    
    patient_full.approval_status = status
    for coll in [patient_full.allergies, patient_full.conditions, patient_full.medications, patient_full.devices, patient_full.emergency_contacts, patient_full.insurances]:
        for item in coll:
            item.approval_status = status
            
    await db.commit()
    await crud.access_log.log_action(db, current_user.id, f"Doctor {status.capitalize()} Patient Profile {id}", resource="Doctor API")
    return {"message": f"Profile and associated details {status} successfully"}

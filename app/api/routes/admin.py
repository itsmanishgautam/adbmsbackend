from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List, Optional
from app import crud, models, schemas
from app.db.session import get_db
from app.core.dependencies import require_role
import json

router = APIRouter()

def log_admin_action(db, current_user, action_type: str, resource_name: str, details: dict):
    return crud.access_log.log_action(
        db=db,
        user_id=current_user.id,
        action=f"{action_type} {resource_name}",
        resource="Admin API",
        details=details
    )

@router.get("/users", response_model=List[schemas.UserResponse])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
) -> Any:
    users = await crud.user.get_multi(db, skip=skip, limit=limit)
    return users

@router.patch("/users/{id}/status", response_model=schemas.UserResponse)
async def update_user_status(
    id: int,
    status: bool,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
) -> Any:
    user = await crud.user.get(db, id=id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user = await crud.user.update(db, db_obj=user, obj_in={"is_active": status})
    await log_admin_action(db, current_user, "Update Status", "User", {"target_id": id, "status": status})
    return user

@router.delete("/users/{id}")
async def delete_user(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
) -> Any:
    user = await crud.user.get(db, id=id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    import sqlalchemy
    
    # 1. Clean up potential Access Logs attached to this user
    await db.execute(sqlalchemy.delete(models.AccessLog).where(models.AccessLog.user_id == id))
    
    # 2. Clean up Doctor Profile if present
    await db.execute(sqlalchemy.delete(models.Doctor).where(models.Doctor.user_id == id))
    
    # 3. Clean up Patient Profile and its dependencies
    patient_query = await db.execute(sqlalchemy.select(models.Patient).where(models.Patient.user_id == id))
    patient = patient_query.scalars().first()
    if patient:
        p_id = patient.patient_id
        await db.execute(sqlalchemy.delete(models.Allergy).where(models.Allergy.patient_id == p_id))
        await db.execute(sqlalchemy.delete(models.Condition).where(models.Condition.patient_id == p_id))
        await db.execute(sqlalchemy.delete(models.Medication).where(models.Medication.patient_id == p_id))
        await db.execute(sqlalchemy.delete(models.Device).where(models.Device.patient_id == p_id))
        await db.execute(sqlalchemy.delete(models.EmergencyContact).where(models.EmergencyContact.patient_id == p_id))
        await db.execute(sqlalchemy.delete(models.PatientInsurance).where(models.PatientInsurance.patient_id == p_id))
        await db.execute(sqlalchemy.delete(models.Patient).where(models.Patient.patient_id == p_id))

    await crud.user.remove(db, id=id)
    await log_admin_action(db, current_user, "Delete", "User", {"target_id": id})
    return {"message": "User deleted"}

# @router.get("/logs", response_model=List[schemas.AccessLogResponse])
# async def read_logs_filtered(
#     skip: int = Query(0),
#     limit: int = Query(100),
#     user_id: Optional[int] = Query(None),
#     action: Optional[str] = Query(None),
#     startDate: Optional[str] = Query(None),
#     endDate: Optional[str] = Query(None),
#     db: AsyncSession = Depends(get_db),
#     current_user: models.User = Depends(require_role("admin"))
# ) -> Any:
#     logs = await crud.access_log.get_logs_filtered(
#         db, skip=skip, limit=limit, user_id=user_id, action=action, date_start=startDate, date_end=endDate
#     )
#     return logs

@router.get("/logs", response_model=List[schemas.AccessLogResponse])
async def read_logs_filtered(
    skip: int = Query(0),
    limit: int = Query(100),
    user_id: Optional[int] = Query(None),
    action: Optional[str] = Query(None),
    startDate: Optional[str] = Query(None),
    endDate: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
) -> Any:
    logs = await crud.access_log.get_logs_filtered(
        db, skip=skip, limit=limit, user_id=user_id, action=action, date_start=startDate, date_end=endDate
    )


    for log in logs:
        if isinstance(log.details, str):
            try:
                log.details = json.loads(log.details)
            except Exception:
                log.details = {}


    return logs

# Doctor Management
@router.post("/create_doctor", response_model=schemas.UserResponse)
async def create_doctor(
    doctor_in: schemas.DoctorRegistration,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
) -> Any:
    user = await crud.user.get_by_email(db, email=doctor_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
        
    from app.core.security import get_password_hash
    
    # 1. Prepare User
    db_user = models.User(
        email=doctor_in.email,
        password_hash=get_password_hash(doctor_in.password),
        name=doctor_in.name,
        role=models.UserRole.doctor
    )
    db.add(db_user)
    await db.flush() # Get user ID without committing transaction

    # 2. Prepare Doctor
    db_doctor = models.Doctor(
        user_id=db_user.id,
        specialty=doctor_in.specialty,
        hospital_id=doctor_in.hospital_id
    )
    db.add(db_doctor)
    
    # 3. Commit atomic transaction
    await db.commit()
    await db.refresh(db_user)
    
    await log_admin_action(db, current_user, "Create", "Doctor", {"target_user_id": db_user.id})
    return db_user

@router.put("/doctors/{id}", response_model=schemas.DoctorResponse)
async def update_doctor(
    id: int,
    doctor_in: schemas.DoctorUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
) -> Any:
    doctor = await crud.doctor.get(db, id=id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    obj = await crud.doctor.update(db, db_obj=doctor, obj_in=doctor_in)
    await log_admin_action(db, current_user, "Update", "Doctor", {"doctor_id": id})
    return obj

@router.delete("/doctors/{id}")
async def delete_doctor(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
) -> Any:
    doctor = await crud.doctor.get(db, id=id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    await crud.doctor.remove(db, id=id)
    # the frontend might also need to delete the user.
    await log_admin_action(db, current_user, "Delete", "Doctor", {"doctor_id": id})
    return {"message": "Doctor entry deleted"}

# --- Patient Management for Admin --- #
@router.get("/users/{user_id}/patient_profile", response_model=schemas.PatientResponse)
async def get_patient_profile_by_user_id(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
) -> Any:
    from sqlalchemy.orm import selectinload
    from sqlalchemy import select
    query = select(models.Patient).options(
        selectinload(models.Patient.allergies),
        selectinload(models.Patient.conditions),
        selectinload(models.Patient.medications),
        selectinload(models.Patient.devices),
        selectinload(models.Patient.emergency_contacts),
        selectinload(models.Patient.insurances)
    ).filter(models.Patient.user_id == user_id)
    
    result = await db.execute(query)
    patient = result.scalars().first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found for this user")
    return patient

@router.patch("/users/{user_id}/patient_profile/status")
async def set_patient_profile_status(
    user_id: int,
    status: str = Query(..., pattern="^(approved|rejected)$"),
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
) -> Any:
    from sqlalchemy.orm import selectinload
    from sqlalchemy import select
    query = select(models.Patient).options(
        selectinload(models.Patient.allergies),
        selectinload(models.Patient.conditions),
        selectinload(models.Patient.medications),
        selectinload(models.Patient.devices),
        selectinload(models.Patient.emergency_contacts),
        selectinload(models.Patient.insurances)
    ).filter(models.Patient.user_id == user_id)
    
    result = await db.execute(query)
    patient = result.scalars().first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found for this user")
        
    patient.approval_status = status
    
    for coll in [patient.allergies, patient.conditions, patient.medications, patient.devices, patient.emergency_contacts, patient.insurances]:
        for item in coll:
            item.approval_status = status
            
    await db.commit()
    await log_admin_action(db, current_user, status.capitalize(), "Patient Profile", {"target_user_id": user_id})
    return {"message": f"Profile and all associated details {status} successfully"}

@router.get("/notifications")
async def get_admin_notifications(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
) -> Any:
    from sqlalchemy import select
    notifications = []
    
    # Check Patients
    patients = await db.execute(select(models.Patient).where(models.Patient.approval_status == "pending"))
    for p in patients.scalars().all():
        notifications.append({"type": "patient_profile", "id": p.patient_id, "user_id": p.user_id, "message": f"Patient profile update pending approval"})
        
    # Check Doctors
    doctors = await db.execute(select(models.Doctor).where(models.Doctor.approval_status == "pending"))
    for d in doctors.scalars().all():
        notifications.append({"type": "doctor_profile", "id": d.doctor_id, "user_id": d.user_id, "message": f"Doctor profile update pending approval"})
        
    # Check Medical (Allergies)
    allergies = await db.execute(select(models.Allergy).where(models.Allergy.approval_status == "pending"))
    for a in allergies.scalars().all():
        notifications.append({"type": "allergy", "id": a.allergy_id, "patient_id": a.patient_id, "message": f"Allergy addition pending approval"})
        
    # Check Medical (Conditions)
    conditions = await db.execute(select(models.Condition).where(models.Condition.approval_status == "pending"))
    for c in conditions.scalars().all():
        notifications.append({"type": "condition", "id": c.condition_id, "patient_id": c.patient_id, "message": f"Condition addition pending approval"})
        
    # Check Medical (Medications)
    medications = await db.execute(select(models.Medication).where(models.Medication.approval_status == "pending"))
    for m in medications.scalars().all():
        notifications.append({"type": "medication", "id": m.medication_id, "patient_id": m.patient_id, "message": f"Medication addition pending approval"})
        
    return {"notifications": notifications, "count": len(notifications)}


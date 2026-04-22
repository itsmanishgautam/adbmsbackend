from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select, or_
from typing import Any

from app import crud, models, schemas
from app.db.session import get_db
from app.core.dependencies import require_role

router = APIRouter()


# ✅ FIXED: Emergency Search (MAIN BUG FIX HERE)
@router.get("/emergency/search", response_model=schemas.PatientCardResponse)
async def search_patient(
    identifier: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("doctor"))
) -> Any:

    filters = [
        models.Patient.emergency_identifier == identifier,
        models.User.name.ilike(f"%{identifier}%"),
        models.User.phone_number.ilike(f"%{identifier}%"),
    ]

    if identifier.isdigit():
        filters.append(models.Patient.patient_id == int(identifier))
        filters.append(models.User.id == int(identifier))

    # ✅ CRITICAL FIX: EAGER LOAD EVERYTHING
    query = (
        select(models.Patient)
        .join(models.User)
        .options(
            selectinload(models.Patient.allergies),
            selectinload(models.Patient.conditions),
            selectinload(models.Patient.medications),
            selectinload(models.Patient.devices),
            selectinload(models.Patient.emergency_contacts),
            selectinload(models.Patient.insurances),
        )
        .filter(or_(*filters))
    )

    result = await db.execute(query)
    patient = result.scalars().first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found matching the provided search criteria"
        )

    user = await crud.user.get(db, id=patient.user_id)

    # ✅ SAFE NOW (no MissingGreenlet)
    data = schemas.PatientResponse.model_validate(patient).model_dump()
    data["name"] = user.name

    return data


# ✅ FIXED: Patient Card (same issue solved)
@router.get("/patients/{id}/card", response_model=schemas.PatientCardResponse)
async def get_patient_card(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("doctor"))
) -> Any:

    query = (
        select(models.Patient)
        .options(
            selectinload(models.Patient.allergies),
            selectinload(models.Patient.conditions),
            selectinload(models.Patient.medications),
            selectinload(models.Patient.devices),
            selectinload(models.Patient.emergency_contacts),
            selectinload(models.Patient.insurances),
        )
        .filter(models.Patient.patient_id == id)
    )

    result = await db.execute(query)
    patient = result.scalars().first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    user = await crud.user.get(db, id=patient.user_id)

    data = schemas.PatientResponse.model_validate(patient).model_dump()
    data["name"] = user.name

    return data


# -----------------------------
# DOCTOR PROFILE
# -----------------------------

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

    update_data = doctor_in.model_dump(exclude_unset=True)
    update_data["approval_status"] = "pending"

    doctor = await crud.doctor.update(db, db_obj=doctor, obj_in=update_data)

    await crud.access_log.log_action(
        db, current_user.id, "Update Profile", resource="Doctor API"
    )

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

    doctor = await crud.doctor.update(
        db, db_obj=doctor, obj_in={"approval_status": "approved"}
    )

    await crud.access_log.log_action(
        db, current_user.id, f"Approved Doctor {id}", resource="Admin API"
    )

    return doctor


# -----------------------------
# PATIENT APPROVAL
# -----------------------------

@router.patch("/patients/{id}/approve")
async def approve_patient_profile(
    id: int,
    status: str = "approved",
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("doctor"))
) -> Any:

    query = (
        select(models.Patient)
        .options(
            selectinload(models.Patient.allergies),
            selectinload(models.Patient.conditions),
            selectinload(models.Patient.medications),
            selectinload(models.Patient.devices),
            selectinload(models.Patient.emergency_contacts),
            selectinload(models.Patient.insurances),
        )
        .filter(models.Patient.patient_id == id)
    )

    result = await db.execute(query)
    patient = result.scalars().first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")

    patient.approval_status = status

    for collection in [
        patient.allergies,
        patient.conditions,
        patient.medications,
        patient.devices,
        patient.emergency_contacts,
        patient.insurances,
    ]:
        for item in collection:
            item.approval_status = status

    await db.commit()

    await crud.access_log.log_action(
        db,
        current_user.id,
        f"Doctor {status.capitalize()} Patient Profile {id}",
        resource="Doctor API"
    )

    return {"message": f"Profile and associated details {status} successfully"}
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Any
import random

from app import crud, models, schemas
from app.db.session import get_db
from app.core.dependencies import get_current_active_user

router = APIRouter()


# -------------------------------
# 🔹 Shared Query with Relations
# -------------------------------
def _get_patient_query():
    return select(models.Patient).options(
        selectinload(models.Patient.user),
        selectinload(models.Patient.allergies),
        selectinload(models.Patient.conditions),
        selectinload(models.Patient.medications),
        selectinload(models.Patient.devices),
        selectinload(models.Patient.emergency_contacts),
        selectinload(models.Patient.insurances)
    )


# -------------------------------
# 🔹 GET CURRENT PATIENT PROFILE
# -------------------------------
@router.get("/me", response_model=schemas.PatientResponse)
async def read_patient_me(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
) -> Any:

    # Only allow patients
    if current_user.role.value != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can access this endpoint"
        )

    result = await db.execute(
        _get_patient_query().filter(models.Patient.user_id == current_user.id)
    )
    patient = result.scalars().first()

    # 🔥 Auto-create patient profile if missing
    if not patient:
        identifier = f"EMG-{random.randint(1000, 9999)}"

        patient_data = schemas.PatientCreate(
            user_id=current_user.id,
            emergency_identifier=identifier
        )

        patient = await crud.patient.create(db, obj_in=patient_data)

        # Log creation
        await crud.access_log.log_action(
            db=db,
            user_id=current_user.id,
            action="Auto-Initialize Patient Profile",
            resource="Patient API",
            details={"emergency_identifier": identifier}
        )

        # Reload with relationships
        result = await db.execute(
            _get_patient_query().filter(models.Patient.user_id == current_user.id)
        )
        patient = result.scalars().first()

    return patient


# -------------------------------
# 🔹 UPDATE CURRENT PATIENT
# -------------------------------
@router.put("/me", response_model=schemas.PatientResponse)
async def update_patient_me(
    patient_in: schemas.PatientUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
) -> Any:

    if current_user.role.value != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can update profile"
        )

    result = await db.execute(
        _get_patient_query().filter(models.Patient.user_id == current_user.id)
    )
    patient = result.scalars().first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")

    update_data = patient_in.model_dump(exclude_unset=True)

    # 🔥 Force re-approval on update
    update_data["approval_status"] = "pending"

    patient = await crud.patient.update(
        db,
        db_obj=patient,
        obj_in=update_data
    )

    # Log update
    await crud.access_log.log_action(
        db=db,
        user_id=current_user.id,
        action="Update Patient Profile",
        resource="Patient API",
        details=update_data
    )

    # Reload with relationships
    result = await db.execute(
        _get_patient_query().filter(models.Patient.user_id == current_user.id)
    )
    return result.scalars().first()


# -------------------------------
# 🔹 GET PATIENT BY ID
# -------------------------------
@router.get("/{id}", response_model=schemas.PatientResponse)
async def read_patient_by_id(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
) -> Any:

    result = await db.execute(
        _get_patient_query().filter(models.Patient.patient_id == id)
    )
    patient = result.scalars().first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Restrict patient access
    if current_user.role.value == "patient" and patient.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges"
        )

    # Log access
    await crud.access_log.log_action(
        db=db,
        user_id=current_user.id,
        action="View Patient Record",
        resource="Patient API",
        details={
            "viewed_patient_id": id,
            "viewed_user_id": patient.user_id
        }
    )

    return patient



@router.get("/emergency/search")
async def emergency_search(
    identifier: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        _get_patient_query().filter(
            models.Patient.emergency_identifier == identifier
        )
    )
    patient = result.scalars().first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return {
        "id": patient.patient_id,
        "user_id": patient.user_id,
        "name": patient.user.full_name,
        "emergency_identifier": patient.emergency_identifier,

        "allergies": [
            {
                "name": a.allergy_name,
                "critical": a.critical_flag
            } for a in patient.allergies
        ],

        "conditions": [
            {
                "name": c.condition_name,
                "critical": c.critical_flag
            } for c in patient.conditions
        ],

        "medications": [
            {
                "name": m.medication_name,
                "dosage": m.dosage if hasattr(m, "dosage") else None
            } for m in patient.medications
        ],

        "devices": [
            {
                "name": d.device_name
            } for d in patient.devices
        ],

        "emergency_contacts": [
            {
                "name": ec.name,
                "phone": ec.phone,
                "relationship": ec.relationship
            } for ec in patient.emergency_contacts
        ],

        "insurance": [
            {
                "provider": ins.provider,
                "policy_number": ins.policy_number
            } for ins in patient.insurances
        ]
    }
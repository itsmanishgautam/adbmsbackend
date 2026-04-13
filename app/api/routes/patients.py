from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Any
from app import crud, models, schemas
from app.db.session import get_db
from app.core.dependencies import get_current_active_user, require_role

router = APIRouter()

def _get_patient_query():
    return select(models.Patient).options(
        selectinload(models.Patient.allergies),
        selectinload(models.Patient.conditions),
        selectinload(models.Patient.medications),
        selectinload(models.Patient.devices),
        selectinload(models.Patient.emergency_contacts),
        selectinload(models.Patient.insurances)
    )

@router.get("/me", response_model=schemas.PatientResponse)
async def read_patient_me(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("patient"))
) -> Any:
    result = await db.execute(_get_patient_query().filter(models.Patient.user_id == current_user.id))
    patient = result.scalars().first()
    
    if not patient:
        import random
        # Auto-initialize the missing profile
        identifier = f"EMG-{random.randint(1000, 9999)}"
        patient_data = schemas.PatientCreate(
            user_id=current_user.id,
            emergency_identifier=identifier
        )
        patient = await crud.patient.create(db, obj_in=patient_data)
        
        # Log initialization
        await crud.access_log.log_action(
            db=db,
            user_id=current_user.id,
            action="Auto-Initialize Patient Profile",
            resource="Patient API",
            details={"emergency_identifier": identifier}
        )
        
        # Must requery to eager load relations that were empty but required by schema
        result = await db.execute(_get_patient_query().filter(models.Patient.user_id == current_user.id))
        patient = result.scalars().first()
        
    return patient

@router.put("/me", response_model=schemas.PatientResponse)
async def update_patient_me(
    patient_in: schemas.PatientUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("patient"))
) -> Any:
    # Explicitly enforce pending on put
    update_data = patient_in.model_dump(exclude_unset=True)
    update_data['approval_status'] = "pending"
    
    result = await db.execute(_get_patient_query().filter(models.Patient.user_id == current_user.id))
    patient = result.scalars().first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
        
    patient = await crud.patient.update(db, db_obj=patient, obj_in=update_data)
    
    # Log the update
    await crud.access_log.log_action(
        db=db,
        user_id=current_user.id,
        action="Update Patient Profile",
        resource="Patient API",
        details=update_data
    )
    
    # Must requery to eager-load relations for the response
    result = await db.execute(_get_patient_query().filter(models.Patient.user_id == current_user.id))
    return result.scalars().first()

@router.get("/{id}", response_model=schemas.PatientResponse)
async def read_patient_by_id(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
) -> Any:
    result = await db.execute(_get_patient_query().filter(models.Patient.patient_id == id))
    patient = result.scalars().first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    if current_user.role.value == "patient" and patient.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough privileges")
        
    await crud.access_log.log_action(
        db=db,
        user_id=current_user.id,
        action="View Patient Record",
        resource="Patient API",
        details={"viewed_patient_id": id, "viewed_user_id": patient.user_id}
    )
        
    return patient

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any
from app import crud, models, schemas
from app.db.session import get_db
from app.core.dependencies import get_current_active_user, require_role

router = APIRouter()

@router.get("/me", response_model=schemas.PatientResponse)
async def read_patient_me(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("patient"))
) -> Any:
    patient = await crud.patient.get_by_field(db, "user_id", current_user.id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
    return patient

@router.put("/me", response_model=schemas.PatientResponse)
async def update_patient_me(
    patient_in: schemas.PatientUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("patient"))
) -> Any:
    patient = await crud.patient.get_by_field(db, "user_id", current_user.id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
    patient = await crud.patient.update(db, db_obj=patient, obj_in=patient_in)
    
    # Log the update
    await crud.access_log.log_action(
        db=db,
        user_id=current_user.id,
        action="Update Patient Profile",
        resource="Patient API",
        details=patient_in.model_dump(exclude_unset=True)
    )
    
    return patient

@router.get("/{id}", response_model=schemas.PatientResponse)
async def read_patient_by_id(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
) -> Any:
    # Any allowed user can view patient basic info, or maybe just patient themselves + doctors
    patient = await crud.patient.get(db, id=id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # If patient, ensure they are viewing themselves
    if current_user.role.value == "patient" and patient.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough privileges")
    return patient

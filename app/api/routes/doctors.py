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
    patient = await crud.patient.get_by_field(db, "emergency_identifier", identifier)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found for provided emergency identifier")
    
    # Needs to fetch the user too to construct PatientCardResponse
    user = await crud.user.get(db, id=patient.user_id)
    
    # We dump and construct
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

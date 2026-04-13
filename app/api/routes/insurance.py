from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app import crud, models, schemas
from app.db.session import get_db
from app.core.dependencies import get_current_active_user, require_role

router = APIRouter()

@router.get("/insurance-providers", response_model=List[schemas.InsuranceProviderResponse])
async def read_providers(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await crud.insurance_provider.get_multi(db, skip=skip, limit=limit)

@router.post("/insurance-providers", response_model=schemas.InsuranceProviderResponse)
async def create_provider(
    provider_in: schemas.InsuranceProviderCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    return await crud.insurance_provider.create(db, obj_in=provider_in)

@router.get("/patient-insurance", response_model=List[schemas.PatientInsuranceResponse])
async def read_patient_insurance(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await crud.patient_insurance.get_multi(db, skip=skip, limit=limit)

@router.post("/patient-insurance", response_model=schemas.PatientInsuranceResponse)
async def create_patient_insurance(
    insurance_in: schemas.PatientInsuranceCreate, 
    db: AsyncSession = Depends(get_db)
):
    return await crud.patient_insurance.create(db, obj_in=insurance_in)

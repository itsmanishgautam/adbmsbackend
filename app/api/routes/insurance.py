from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app import crud, models, schemas
from app.db.session import get_db
from app.core.dependencies import get_current_active_user, require_role

router = APIRouter()

def log_insurance_action(db, current_user, action_type: str, resource_name: str, details: dict):
    return crud.access_log.log_action(
        db=db,
        user_id=current_user.id,
        action=f"{action_type} {resource_name}",
        resource="Insurance API",
        details=details
    )

# Insurance Providers API (Admin generally modifies these, anyone can view)
@router.get("/insurance-providers", response_model=List[schemas.InsuranceProviderResponse])
async def read_providers(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await crud.insurance_provider.get_multi(db, skip=skip, limit=limit)

@router.post("/insurance-providers", response_model=schemas.InsuranceProviderResponse)
async def create_provider(
    provider_in: schemas.InsuranceProviderCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    obj = await crud.insurance_provider.create(db, obj_in=provider_in)
    await log_insurance_action(db, current_user, "Create", "Insurance Provider", {"id": getattr(obj, "provider_id", None)})
    return obj

@router.put("/insurance-providers/{id}", response_model=schemas.InsuranceProviderResponse)
async def update_provider(
    id: int,
    provider_in: schemas.InsuranceProviderCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    provider = await crud.insurance_provider.get(db, id=id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    obj = await crud.insurance_provider.update(db, db_obj=provider, obj_in=provider_in)
    await log_insurance_action(db, current_user, "Update", "Insurance Provider", {"id": id})
    return obj

@router.delete("/insurance-providers/{id}")
async def delete_provider(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    provider = await crud.insurance_provider.get(db, id=id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    await crud.insurance_provider.remove(db, id=id)
    await log_insurance_action(db, current_user, "Delete", "Insurance Provider", {"id": id})
    return {"message": "Provider deleted"}

# Patient Insurance API
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

@router.get("/patient-insurance", response_model=List[schemas.PatientInsuranceResponse])
async def read_patient_insurance(
    skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    if current_user.role.value == "patient":
        patient_id = await get_patient_id(db, current_user)
        return await crud.patient_insurance.get_multi_by_field(db, "patient_id", patient_id, skip=skip, limit=limit)
    return await crud.patient_insurance.get_multi(db, skip=skip, limit=limit)

@router.post("/patient-insurance", response_model=schemas.PatientInsuranceResponse)
async def create_patient_insurance(
    insurance_in: schemas.PatientInsuranceCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    if current_user.role.value == "patient":
        insurance_in.patient_id = await get_patient_id(db, current_user)
    obj = await crud.patient_insurance.create(db, obj_in=insurance_in)
    await log_insurance_action(db, current_user, "Create", "Patient Insurance", {"id": getattr(obj, "patient_insurance_id", None)})
    return obj

@router.put("/patient-insurance/{id}", response_model=schemas.PatientInsuranceResponse)
async def update_patient_insurance(
    id: int,
    insurance_in: schemas.PatientInsuranceCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    item = await verify_ownership(db, id, crud.patient_insurance, current_user, "Patient Insurance")
    obj = await crud.patient_insurance.update(db, db_obj=item, obj_in=insurance_in)
    await log_insurance_action(db, current_user, "Update", "Patient Insurance", {"id": id})
    return obj

@router.delete("/patient-insurance/{id}")
async def delete_patient_insurance(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    await verify_ownership(db, id, crud.patient_insurance, current_user, "Patient Insurance")
    await crud.patient_insurance.remove(db, id=id)
    await log_insurance_action(db, current_user, "Delete", "Patient Insurance", {"id": id})
    return {"message": "Insurance record deleted"}

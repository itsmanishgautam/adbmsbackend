from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List
from app import crud, models, schemas
from app.db.session import get_db
from app.core.dependencies import get_current_active_user, require_role

router = APIRouter()

@router.get("/", response_model=List[schemas.BloodBankResponse])
async def read_blood_bank(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
) -> Any:
    # Anyone authenticated can view blood bank data
    records = await crud.blood_bank.get_multi(db)
    return records

@router.put("/{blood_type}", response_model=schemas.BloodBankResponse)
async def update_blood_bank(
    blood_type: str,
    blood_in: schemas.BloodBankUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
) -> Any:
    record = await crud.blood_bank.get_by_blood_type(db, blood_type=blood_type)
    if not record:
        # Auto-create if not exists
        create_data = schemas.BloodBankCreate(blood_type=blood_type, units_available=blood_in.units_available or 0)
        record = await crud.blood_bank.create(db, obj_in=create_data)
        await crud.access_log.log_action(db, user_id=current_user.id, action="Create Blood Bank Entry", resource="Blood Bank API", details={"blood_type": blood_type})
    else:
        record = await crud.blood_bank.update(db, db_obj=record, obj_in=blood_in)
        await crud.access_log.log_action(db, user_id=current_user.id, action="Update Blood Bank Entry", resource="Blood Bank API", details={"blood_type": blood_type, "units": blood_in.units_available})
        
    return record

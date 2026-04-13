from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List
from app import crud, models, schemas
from app.db.session import get_db
from app.core.dependencies import require_role

router = APIRouter()

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
    return user

@router.get("/logs")
async def read_logs(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
) -> Any:
    logs = await crud.access_log.get_multi(db, skip=skip, limit=limit)
    return logs

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
    user_create = schemas.UserCreate(
        name=doctor_in.name,
        email=doctor_in.email,
        password=doctor_in.password,
        role=models.UserRole.doctor
    )
    user = await crud.user.create(db, obj_in=user_create)

    doctor_data = schemas.DoctorCreate(
        user_id=user.id,
        specialty=doctor_in.specialty,
        hospital_id=doctor_in.hospital_id
    )
    await crud.doctor.create(db, obj_in=doctor_data)

    return user

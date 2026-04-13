from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app import crud, models, schemas
from app.core import security
from app.core.config import settings
from app.core.dependencies import get_current_active_user
from app.db.session import get_db
import random

router = APIRouter()

@router.post("/login", response_model=schemas.Token)
async def login_access_token(
    db: AsyncSession = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    user = await crud.user.get_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not crud.user.is_active(user):
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/refresh", response_model=schemas.Token)
async def refresh_token(current_user: models.User = Depends(get_current_active_user)):
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            current_user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/logout")
async def logout(current_user: models.User = Depends(get_current_active_user)):
    # Simple JWTs are stateless. True logout needs a blacklist or redis.
    # Placeholder for standardized response.
    return {"message": "Successfully logged out"}

@router.post("/signup", response_model=schemas.UserResponse)
async def signup(
    user_in: schemas.UserSignup,
    db: AsyncSession = Depends(get_db)
):
    user = await crud.user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user_create = schemas.UserCreate(
        name=user_in.name,
        email=user_in.email,
        password=user_in.password,
        role=models.UserRole.patient
    )
    user = await crud.user.create(db, obj_in=user_create)

    identifier = f"EMG-{random.randint(1000, 9999)}"
    patient_data = schemas.PatientCreate(
        user_id=user.id,
        emergency_identifier=identifier
    )
    await crud.patient.create(db, obj_in=patient_data)

    return user

from fastapi import APIRouter
from app.api.routes import auth, patients, doctors, admin, medical, insurance, blood_bank, incidents

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(patients.router, prefix="/patients", tags=["patients"])
api_router.include_router(doctors.router, prefix="", tags=["doctors"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(medical.router, prefix="", tags=["medical"])
api_router.include_router(insurance.router, prefix="", tags=["insurance"])
api_router.include_router(blood_bank.router, prefix="/blood-bank", tags=["blood-bank"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"])


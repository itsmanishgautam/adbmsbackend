import asyncio
import logging
from app.db.session import AsyncSessionLocal
from app import crud, schemas
from app.models.user import UserRole
import random

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def seed():
    async with AsyncSessionLocal() as db:
        logger.info("Seeding data...")

        # Admin
        admin_user = await crud.user.get_by_email(db, email="admin@ehcidb.com")
        if not admin_user:
            admin_user = await crud.user.create(
                db,
                obj_in=schemas.UserCreate(
                    email="admin@ehcidb.com",
                    password="password123",
                    name="System Admin",
                    role=UserRole.admin
                )
            )
            logger.info("Created Admin User")

        # Doctor
        doctor_user = await crud.user.get_by_email(db, email="doctor@ehcidb.com")
        if not doctor_user:
            doctor_user = await crud.user.create(
                db,
                obj_in=schemas.UserCreate(
                    email="doctor@ehcidb.com",
                    password="password123",
                    name="Dr. Smith",
                    role=UserRole.doctor
                )
            )
            logger.info("Created Doctor User")
            
            # Hospital
            hospital_data = schemas.HospitalCreate(name="Central City Hospital", address="100 Main St")
            hospital_obj = await crud.hospital.create(db, obj_in=hospital_data)

            doctor_data = schemas.DoctorCreate(
                user_id=doctor_user.id,
                specialty="Emergency Medicine",
                hospital_id=hospital_obj.hospital_id
            )
            await crud.doctor.create(db, obj_in=doctor_data)

        # Patient
        patient_user = await crud.user.get_by_email(db, email="patient@ehcidb.com")
        if not patient_user:
            patient_user = await crud.user.create(
                db,
                obj_in=schemas.UserCreate(
                    email="patient@ehcidb.com",
                    password="password123",
                    name="John Doe",
                    role=UserRole.patient
                )
            )
            logger.info("Created Patient User")

            identifier = f"EMG-{random.randint(1000, 9999)}"
            patient_data = schemas.PatientCreate(
                user_id=patient_user.id,
                emergency_identifier=identifier,
                blood_type="O+",
                emergency_contact_summary="Jane Doe (Wife) - 555-0199"
            )
            patient_obj = await crud.patient.create(db, obj_in=patient_data)

            # Setup basic medical history
            await crud.allergy.create(db, obj_in=schemas.AllergyCreate(patient_id=patient_obj.patient_id, allergy_name="Penicillin", severity="High"))
            await crud.condition.create(db, obj_in=schemas.ConditionCreate(patient_id=patient_obj.patient_id, condition_name="Asthma", critical_flag=True))

        logger.info("Seeding completed successfully.")

if __name__ == "__main__":
    asyncio.run(seed())

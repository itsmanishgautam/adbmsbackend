import asyncio
import random
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app import models
from sqlalchemy import select

fake = Faker()

NUM_USERS = 200
NUM_PATIENTS = 100
NUM_DOCTORS = 50


# ✅ SAFE phone generator (fixes "data too long")
def safe_phone():
    return fake.numerify(text="##########")  # max 10 digits


async def seed():
    async with AsyncSessionLocal() as db:

        # ---------------- USERS ----------------
        users = []

        for _ in range(NUM_USERS):
            user = models.User(
                name=fake.name(),
                email=fake.unique.email(),
                password_hash="hashedpassword",
                role=random.choice(list(models.UserRole)),
                is_active=True,
                phone_number=safe_phone(),  # ✅ FIXED
            )
            db.add(user)
            users.append(user)

        await db.commit()

        result = await db.execute(select(models.User))
        users = result.scalars().all()

        # ---------------- HOSPITALS ----------------
        hospitals = []
        for _ in range(10):
            h = models.Hospital(
                name=fake.company(),
                address=fake.address(),
                contact_number=safe_phone(),
                type=random.choice(["Private", "Government"]),
            )
            db.add(h)
            hospitals.append(h)

        await db.commit()

        result = await db.execute(select(models.Hospital))
        hospitals = result.scalars().all()

        # ---------------- DOCTORS ----------------
        for user in users[:NUM_DOCTORS]:
            doc = models.Doctor(
                user_id=user.id,
                specialty=random.choice(["Cardiology", "Neurology", "General"]),
                hospital_id=random.choice(hospitals).hospital_id,
                contact_info=safe_phone(),
            )
            db.add(doc)

        # ---------------- PATIENTS ----------------
        patients = []
        for user in users[NUM_DOCTORS:NUM_DOCTORS + NUM_PATIENTS]:
            p = models.Patient(
                user_id=user.id,
                emergency_identifier=str(fake.uuid4()),
                blood_type=random.choice(["A+", "B+", "O+", "AB-"]),
                emergency_contact_summary=fake.name(),
            )
            db.add(p)
            patients.append(p)

        await db.commit()

        result = await db.execute(select(models.Patient))
        patients = result.scalars().all()

        # ---------------- PATIENT RELATED ----------------
        for patient in patients:
            for _ in range(3):

                db.add(models.Allergy(
                    patient_id=patient.patient_id,
                    allergy_name=fake.word(),
                    severity=random.choice(["low", "medium", "high"])
                ))

                db.add(models.Condition(
                    patient_id=patient.patient_id,
                    condition_name=fake.word(),
                    critical_flag=random.choice([True, False])
                ))

                db.add(models.Medication(
                    patient_id=patient.patient_id,
                    medication_name=fake.word(),
                    dosage=f"{random.randint(1, 500)}mg"
                ))

                db.add(models.Device(
                    patient_id=patient.patient_id,
                    device_name=fake.word(),
                    device_type="Medical"
                ))

                db.add(models.EmergencyContact(
                    patient_id=patient.patient_id,
                    contact_name=fake.name(),
                    contact_relationship="Family",
                    phone_number=safe_phone(),  # ✅ FIXED
                ))

        await db.commit()

        # ---------------- INSURANCE PROVIDERS ----------------
        providers = []
        for _ in range(10):
            provider = models.InsuranceProvider(
                provider_name=fake.company(),
                payer_phone=safe_phone(),
            )
            db.add(provider)
            providers.append(provider)

        await db.commit()

        result = await db.execute(select(models.InsuranceProvider))
        providers = result.scalars().all()

        # ---------------- PATIENT INSURANCE ----------------
        for patient in patients:
            db.add(models.PatientInsurance(
                patient_id=patient.patient_id,
                provider_id=random.choice(providers).provider_id,
                plan_type="Basic",
                member_id=str(fake.uuid4()),
                group_number=str(random.randint(1000, 9999)),
                coverage_status="Active"
            ))

        # ---------------- BLOOD BANK ----------------
        blood_types = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
        for bt in blood_types:
            db.add(models.BloodBank(
                blood_type=bt,
                units_available=random.randint(10, 100)
            ))

        await db.commit()

        print("✅ Data seeding completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
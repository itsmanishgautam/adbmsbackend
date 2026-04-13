from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Allergy(Base):
    __tablename__ = "allergies"

    allergy_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"))
    allergy_name = Column(String(255), nullable=False)
    severity = Column(String(50))

    patient = relationship("Patient", back_populates="allergies")

class Condition(Base):
    __tablename__ = "conditions"

    condition_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"))
    condition_name = Column(String(255), nullable=False)
    critical_flag = Column(Boolean, default=False)

    patient = relationship("Patient", back_populates="conditions")

class Medication(Base):
    __tablename__ = "medications"

    medication_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"))
    medication_name = Column(String(255), nullable=False)
    dosage = Column(String(255))

    patient = relationship("Patient", back_populates="medications")

class Device(Base):
    __tablename__ = "devices"

    device_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"))
    device_name = Column(String(255), nullable=False)
    device_type = Column(String(100))

    patient = relationship("Patient", back_populates="devices")

class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    contact_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"))
    contact_name = Column(String(255), nullable=False)
    contact_relationship = Column(String(100))
    phone_number = Column(String(50))

    patient = relationship("Patient", back_populates="emergency_contacts")

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Patient(Base):
    __tablename__ = "patients"

    patient_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    emergency_identifier = Column(String(50), unique=True, index=True, nullable=False)
    blood_type = Column(String(10))
    emergency_contact_summary = Column(String(255))
    approval_status = Column(String(20), default="pending")
    
    user = relationship("User", back_populates="patient_profile")
    allergies = relationship("Allergy", back_populates="patient")
    conditions = relationship("Condition", back_populates="patient")
    medications = relationship("Medication", back_populates="patient")
    devices = relationship("Device", back_populates="patient")
    emergency_contacts = relationship("EmergencyContact", back_populates="patient")
    insurances = relationship("PatientInsurance", back_populates="patient")

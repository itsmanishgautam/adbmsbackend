from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class InsuranceProvider(Base):
    __tablename__ = "insurance_providers"

    provider_id = Column(Integer, primary_key=True, index=True)
    provider_name = Column(String(255), nullable=False)
    payer_phone = Column(String(50))

    insurances = relationship("PatientInsurance", back_populates="provider")

class PatientInsurance(Base):
    __tablename__ = "patient_insurance"

    patient_insurance_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"))
    provider_id = Column(Integer, ForeignKey("insurance_providers.provider_id"))
    plan_type = Column(String(100))
    member_id = Column(String(100))
    group_number = Column(String(100))
    coverage_status = Column(String(50))

    patient = relationship("Patient", back_populates="insurances")
    provider = relationship("InsuranceProvider", back_populates="insurances")

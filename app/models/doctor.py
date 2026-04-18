from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Doctor(Base):
    __tablename__ = "doctors"

    doctor_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    specialty = Column(String(255))
    hospital_id = Column(Integer, ForeignKey("hospitals.hospital_id"))
    contact_info = Column(String(255))
    approval_status = Column(String(20), default="approved") # Default approved for existing flow, or pending if new.


    user = relationship("User", back_populates="doctor_profile")
    hospital = relationship("Hospital", back_populates="doctors")

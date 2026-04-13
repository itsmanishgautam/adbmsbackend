from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class BloodBank(Base):
    __tablename__ = "blood_bank"

    id = Column(Integer, primary_key=True, index=True)
    blood_type = Column(String(10), unique=True, index=True, nullable=False)
    units_available = Column(Integer, default=0)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

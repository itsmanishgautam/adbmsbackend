from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from datetime import datetime, timezone
from app.db.base import Base

class AccessLog(Base):
    __tablename__ = "access_logs"

    log_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(255))
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    ip_address = Column(String(50))

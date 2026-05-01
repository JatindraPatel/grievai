from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_base

# Note: In a real project, Base is usually imported from a central database.py file
# e.g., from app.database import Base
Base = declarative_base()

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String, index=True, nullable=False) # e.g., "COMPLAINT_CREATED", "STATUS_UPDATED"
    entity_type = Column(String, index=True, nullable=False) # e.g., "complaint", "user"
    entity_id = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # The user who performed the action (if applicable)
    details = Column(Text, nullable=True) # JSON string with changes or extra info
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

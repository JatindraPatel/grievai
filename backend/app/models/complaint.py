from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_base
import enum

# Note: In a real project, Base is usually imported from a central database.py file
# e.g., from app.database import Base
Base = declarative_base()

class ComplaintStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    REJECTED = "rejected"

class PriorityLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False)
    
    # AI Classification fields
    category = Column(String, index=True)
    department = Column(String, index=True)
    priority = Column(Enum(PriorityLevel), default=PriorityLevel.LOW)
    ai_confidence_score = Column(Integer, nullable=True) # e.g. 0-100
    
    status = Column(Enum(ComplaintStatus), default=ComplaintStatus.PENDING)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.complaint import ComplaintStatus, PriorityLevel

class ComplaintBase(BaseModel):
    title: str
    description: str

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    department: Optional[str] = None
    priority: Optional[PriorityLevel] = None
    ai_confidence_score: Optional[int] = None
    status: Optional[ComplaintStatus] = None

class ComplaintResponse(ComplaintBase):
    id: int
    user_id: int
    category: Optional[str] = None
    department: Optional[str] = None
    priority: PriorityLevel
    ai_confidence_score: Optional[int] = None
    status: ComplaintStatus
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

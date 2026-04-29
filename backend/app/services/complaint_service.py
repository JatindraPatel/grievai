"""
Complaint Service — business logic layer
"""
import logging
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Complaint
from app.models.schemas import ComplaintSubmit
from app.services.classification_service import classify_complaint
from app.utils.routing import generate_complaint_id

logger = logging.getLogger(__name__)


async def create_complaint(
    data: ComplaintSubmit,
    db: AsyncSession,
    user_id: int | None = None,
) -> Complaint:
    """
    1. Classify the complaint text using AI (subject + description combined)
    2. Generate a unique complaint ID
    3. Persist to database
    4. Return the saved complaint
    """
    # Combine subject + description for better classification
    full_text = f"{data.subject} {data.description}"
    result = classify_complaint(full_text)

    logger.info(
        "Classified complaint | category=%s dept=%s priority=%s lang=%s conf=%d%%",
        result.category, result.department, result.priority,
        result.detected_language, result.confidence,
    )

    complaint = Complaint(
        complaint_id=generate_complaint_id(),
        citizen_name=data.citizen_name,
        citizen_mobile=data.citizen_mobile,
        citizen_email=data.citizen_email,
        state=data.state,
        subject=data.subject,
        description=data.description,
        detected_language=result.detected_language,
        category=result.category,
        department=result.department,
        priority=result.priority,
        ai_confidence=result.confidence,
        user_id=user_id,
    )

    db.add(complaint)
    await db.commit()
    await db.refresh(complaint)
    return complaint


async def get_complaint_by_id(complaint_id: str, db: AsyncSession) -> Complaint | None:
    result = await db.execute(
        select(Complaint).where(Complaint.complaint_id == complaint_id)
    )
    return result.scalar_one_or_none()


async def get_all_complaints(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 50,
    status: str | None = None,
    category: str | None = None,
) -> list[Complaint]:
    q = select(Complaint).order_by(Complaint.created_at.desc())
    if status:
        q = q.where(Complaint.status == status)
    if category:
        q = q.where(Complaint.category == category)
    q = q.offset(skip).limit(limit)
    result = await db.execute(q)
    return list(result.scalars().all())


async def update_complaint_status(
    complaint_id: str, new_status: str, db: AsyncSession
) -> Complaint | None:
    complaint = await get_complaint_by_id(complaint_id, db)
    if complaint:
        complaint.status = new_status
        await db.commit()
        await db.refresh(complaint)
    return complaint

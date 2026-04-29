"""
Complaints API

POST /api/v1/complaints              — Submit complaint (no login needed)
GET  /api/v1/complaints              — List all complaints (auth optional)
GET  /api/v1/complaints/{id}         — Get complaint by complaint_id
PUT  /api/v1/complaints/{id}/status  — Update status (officer/admin)
POST /api/v1/complaints/classify     — Live AI preview (no DB write)
"""
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_optional_user, get_current_user
from app.models.schemas import (
    ComplaintSubmit, ComplaintOut, ComplaintDetail,
    ClassifyRequest, ClassifyResponse,
)
from app.services.complaint_service import (
    create_complaint, get_all_complaints,
    get_complaint_by_id, update_complaint_status,
)
from app.services.classification_service import classify_complaint

router = APIRouter()


# ── 1. Live classify preview (no DB write) ────────────────
@router.post("/classify", response_model=ClassifyResponse, summary="AI classify text without saving")
async def classify_preview(data: ClassifyRequest):
    """
    Frontend calls this on-the-fly as citizen types.
    Returns predicted category, department, priority, language.
    No complaint is stored.
    """
    result = classify_complaint(data.text)
    return ClassifyResponse(
        category=result.category,
        department=result.department,
        priority=result.priority,
        detected_language=result.detected_language,
        confidence=result.confidence,
        keywords_matched=result.keywords_matched,
    )


# ── 2. Submit complaint ────────────────────────────────────
@router.post(
    "",
    response_model=ComplaintOut,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a new complaint — AI auto-classifies",
)
async def submit_complaint(
    data: ComplaintSubmit,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user=Depends(get_optional_user),
):
    """
    Citizen submits complaint text.
    AI automatically assigns:
      - category (Electricity / Water / Roads / etc.)
      - department
      - priority (High / Medium / Low)
      - detected language
    No manual department selection needed.
    """
    user_id = current_user.id if current_user else None
    complaint = await create_complaint(data, db, user_id)
    return complaint


# ── 3. List complaints ─────────────────────────────────────
@router.get("", response_model=list[ComplaintOut], summary="List complaints (paginated)")
async def list_complaints(
    db: Annotated[AsyncSession, Depends(get_db)],
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=200),
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
):
    return await get_all_complaints(db, skip=skip, limit=limit, status=status, category=category)


# ── 4. Get by ID ───────────────────────────────────────────
@router.get("/{complaint_id}", response_model=ComplaintDetail, summary="Get complaint details")
async def get_complaint(complaint_id: str, db: Annotated[AsyncSession, Depends(get_db)]):
    complaint = await get_complaint_by_id(complaint_id.upper(), db)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint


# ── 5. Update status (officer/admin) ──────────────────────
@router.put("/{complaint_id}/status", response_model=ComplaintOut, summary="Update complaint status")
async def update_status(
    complaint_id: str,
    body: dict,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user=Depends(get_current_user),
):
    valid_statuses = {"Pending", "Under Review", "In Progress", "Resolved", "Rejected"}
    new_status = body.get("status", "")
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")

    complaint = await update_complaint_status(complaint_id.upper(), new_status, db)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint

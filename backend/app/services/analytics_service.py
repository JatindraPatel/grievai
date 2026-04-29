"""
Analytics Service — dashboard statistics
"""
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Complaint
from app.models.schemas import ComplaintOut, StatsOut


async def get_stats(db: AsyncSession) -> StatsOut:
    # Total
    total_res = await db.execute(select(func.count(Complaint.id)))
    total = total_res.scalar() or 0

    # By status
    status_res = await db.execute(
        select(Complaint.status, func.count(Complaint.id)).group_by(Complaint.status)
    )
    status_map: dict[str, int] = {r[0]: r[1] for r in status_res}

    # By category
    cat_res = await db.execute(
        select(Complaint.category, func.count(Complaint.id)).group_by(Complaint.category)
    )
    by_category: dict[str, int] = {r[0]: r[1] for r in cat_res}

    # By priority
    pri_res = await db.execute(
        select(Complaint.priority, func.count(Complaint.id)).group_by(Complaint.priority)
    )
    by_priority: dict[str, int] = {r[0]: r[1] for r in pri_res}

    # By department
    dept_res = await db.execute(
        select(Complaint.department, func.count(Complaint.id)).group_by(Complaint.department)
    )
    by_department: dict[str, int] = {r[0]: r[1] for r in dept_res}

    # Recent 10
    recent_res = await db.execute(
        select(Complaint).order_by(Complaint.created_at.desc()).limit(10)
    )
    recent_objs = list(recent_res.scalars().all())
    recent = [ComplaintOut.model_validate(c) for c in recent_objs]

    return StatsOut(
        total=total,
        pending=status_map.get("Pending", 0),
        in_progress=status_map.get("In Progress", 0) + status_map.get("Under Review", 0),
        resolved=status_map.get("Resolved", 0),
        by_category=by_category,
        by_priority=by_priority,
        by_department=by_department,
        recent=recent,
    )

"""
Analytics / Stats routes

GET /api/v1/stats  — aggregate dashboard stats
"""
from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db
from app.models.schemas import StatsOut
from app.services.analytics_service import get_stats

router = APIRouter()


@router.get("", response_model=StatsOut, summary="Dashboard analytics stats")
async def dashboard_stats(db: Annotated[AsyncSession, Depends(get_db)]):
    return await get_stats(db)

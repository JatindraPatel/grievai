"""
Auth API routes
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me   (protected)
"""
from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.auth_service import register_user, login_user
from app.core.dependencies import get_db, get_current_user
from app.models.schemas import RegisterRequest, LoginRequest, TokenResponse

router = APIRouter()


@router.post("/register", summary="Register a new citizen/officer/admin")
async def register(data: RegisterRequest, db: Annotated[AsyncSession, Depends(get_db)]):
    user = await register_user(data, db)
    return {"message": "Registration successful", "user_id": user.id, "name": user.name}


@router.post("/login", response_model=TokenResponse, summary="Login and get JWT token")
async def login(data: LoginRequest, db: Annotated[AsyncSession, Depends(get_db)]):
    return await login_user(data, db)


@router.get("/me", summary="Get current authenticated user info")
async def me(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "mobile": current_user.mobile,
        "email": current_user.email,
        "role": current_user.role,
    }

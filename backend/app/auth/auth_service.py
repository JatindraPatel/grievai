"""
Auth service — register / login
"""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password, verify_password, create_access_token
from app.db.models import User
from app.models.schemas import RegisterRequest, LoginRequest, TokenResponse


async def register_user(data: RegisterRequest, db: AsyncSession) -> User:
    from fastapi import HTTPException, status

    # Check duplicate mobile
    res = await db.execute(select(User).where(User.mobile == data.mobile))
    if res.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Mobile number already registered")

    user = User(
        name=data.name,
        mobile=data.mobile,
        email=data.email,
        hashed_password=hash_password(data.password),
        role=data.role,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def login_user(data: LoginRequest, db: AsyncSession) -> TokenResponse:
    from fastapi import HTTPException, status

    res = await db.execute(select(User).where(User.mobile == data.mobile))
    user = res.scalar_one_or_none()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account deactivated")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(access_token=token, user_name=user.name, user_role=user.role)

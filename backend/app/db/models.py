"""
ORM models — User + Complaint
"""
from datetime import datetime, timezone
from sqlalchemy import (
    Boolean, DateTime, Enum, ForeignKey,
    Integer, String, Text, func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


def _now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    mobile: Mapped[str] = mapped_column(String(15), unique=True, index=True)
    email: Mapped[str | None] = mapped_column(String(200), unique=True, nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(256))
    role: Mapped[str] = mapped_column(
        Enum("citizen", "officer", "admin", name="user_role"), default="citizen"
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)

    complaints: Mapped[list["Complaint"]] = relationship(back_populates="user", lazy="selectin")


class Complaint(Base):
    __tablename__ = "complaints"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    complaint_id: Mapped[str] = mapped_column(String(30), unique=True, index=True)

    # Citizen info (can be anonymous / non-logged-in)
    citizen_name: Mapped[str] = mapped_column(String(120))
    citizen_mobile: Mapped[str] = mapped_column(String(15))
    citizen_email: Mapped[str | None] = mapped_column(String(200), nullable=True)
    state: Mapped[str] = mapped_column(String(60))

    # Complaint content
    subject: Mapped[str] = mapped_column(String(300))
    description: Mapped[str] = mapped_column(Text)

    # AI-classified fields
    detected_language: Mapped[str] = mapped_column(String(20), default="English")
    category: Mapped[str] = mapped_column(String(60), default="Other")
    department: Mapped[str] = mapped_column(String(120), default="Other")
    priority: Mapped[str] = mapped_column(
        Enum("Low", "Medium", "High", name="priority_level"), default="Medium"
    )
    ai_confidence: Mapped[int] = mapped_column(Integer, default=0)  # 0–100

    # Status
    status: Mapped[str] = mapped_column(
        Enum("Pending", "Under Review", "In Progress", "Resolved", "Rejected", name="complaint_status"),
        default="Pending",
    )

    # Relations (optional — complaint can be filed without login)
    user_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    user: Mapped["User | None"] = relationship(back_populates="complaints")

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_now, onupdate=_now
    )

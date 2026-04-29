"""
GrievAI – FastAPI Backend Entry Point
AI-Powered Citizen Grievance Redressal System
Government of India (Demo)
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.api.v1 import complaints, auth, stats, health
from app.core.config import settings
from app.db.base import init_db
from app.utils.logger import setup_logger

# ── Logging ──────────────────────────────────────────────
setup_logger()
logger = logging.getLogger(__name__)


# ── Lifespan (startup / shutdown) ────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 GrievAI backend starting up…")
    await init_db()
    logger.info("✅ Database initialised")
    yield
    logger.info("🛑 GrievAI backend shutting down")


# ── App Instance ─────────────────────────────────────────
app = FastAPI(
    title="GrievAI API",
    description="AI-Powered Citizen Grievance Redressal System — Government of India",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# ── CORS (allow all origins for frontend integration) ─────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────
app.include_router(health.router,     prefix="/api/v1",           tags=["Health"])
app.include_router(auth.router,       prefix="/api/v1/auth",      tags=["Auth"])
app.include_router(complaints.router, prefix="/api/v1/complaints", tags=["Complaints"])
app.include_router(stats.router,      prefix="/api/v1/stats",     tags=["Analytics"])


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "GrievAI API is running",
        "docs": "/api/docs",
        "version": "1.0.0",
    }

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# TODO: Import routers once they are created
# from app.routers import auth, complaints, admin, alerts

app = FastAPI(
    title="GrievAI Backend API",
    description="Backend API for the GrievAI Citizen Portal featuring AI Classification.",
    version="1.0.0"
)

# Configure CORS for the Vercel frontend
# Update this with your actual Vercel domain once deployed
origins = [
    "http://localhost:3000",
    "http://localhost:5173", # Vite default
    "http://localhost:8080",
    "https://grievai.vercel.app/", # Your live frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# --- Router Registration ---
# Uncomment these once you create the files in app/routers/
# app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
# app.include_router(complaints.router, prefix="/api/complaints", tags=["Complaints"])
# app.include_router(admin.router, prefix="/api/admin", tags=["Admin Dashboard"])
# app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts & Escalations"])

@app.get("/", tags=["Health Check"])
async def root():
    """
    Root endpoint to verify the API is running.
    """
    return {
        "message": "Welcome to the GrievAI API",
        "status": "online",
        "documentation": "/docs"
    }

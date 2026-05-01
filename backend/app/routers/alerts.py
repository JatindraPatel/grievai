from fastapi import APIRouter

router = APIRouter(
    prefix="/alerts",
    tags=["Alerts & Notifications"],
)

@router.get("/")
async def get_alerts():
    return {"message": "Get user alerts"}

@router.post("/send")
async def send_alert():
    return {"message": "Send a new alert"}

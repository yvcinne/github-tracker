from fastapi import APIRouter, HTTPException
from app.services.github import get_overview
from app.services.email import send_weekly_summary
from app.config import settings

router = APIRouter(prefix="/summary", tags=["summary"])


@router.post("/send-email")
async def send_email():
    if not settings.resend_api_key or not settings.email_to:
        raise HTTPException(status_code=400, detail="Email not configured")
    data = await get_overview()
    send_weekly_summary(data)
    return {"message": "Summary sent successfully"}

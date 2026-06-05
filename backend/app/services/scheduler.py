from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from app.services.github import get_overview
from app.services.email import send_weekly_summary
from app.database import SessionLocal
from app.models.schemas import Snapshot
from app.config import settings

scheduler = AsyncIOScheduler()


async def snapshot_job():
    if not settings.github_username:
        return  # No default user configured, skip
    data = await get_overview(settings.github_username)
    async with SessionLocal() as db:
        snapshot = Snapshot(
            total_repos=data["total_repos"],
            total_stars=data["total_stars"],
            total_commits=0,
            total_prs=0,
            total_issues=0,
            languages=data["languages"],
            top_repos=data["top_repos"],
        )
        db.add(snapshot)
        await db.commit()


async def weekly_email_job():
    if not settings.github_username or not settings.resend_api_key:
        return  # Not configured, skip
    data = await get_overview(settings.github_username)
    send_weekly_summary(data)


def start_scheduler():
    # Daily snapshot at midnight
    scheduler.add_job(snapshot_job, CronTrigger(hour=0, minute=0))
    # Weekly email every Monday at 9am
    scheduler.add_job(weekly_email_job, CronTrigger(day_of_week="mon", hour=9, minute=0))
    scheduler.start()

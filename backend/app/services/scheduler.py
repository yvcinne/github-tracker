from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from app.services.github import get_overview
from app.services.email import send_weekly_summary
from app.database import SessionLocal
from app.models.schemas import Snapshot
import json

scheduler = AsyncIOScheduler()


async def snapshot_job():
    data = await get_overview()
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
    data = await get_overview()
    send_weekly_summary(data)


def start_scheduler():
    # Daily snapshot at midnight
    scheduler.add_job(snapshot_job, CronTrigger(hour=0, minute=0))
    # Weekly email every Monday at 9am
    scheduler.add_job(weekly_email_job, CronTrigger(day_of_week="mon", hour=9, minute=0))
    scheduler.start()

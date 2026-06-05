from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.database import get_db
from app.models.schemas import Snapshot
from app.services.github import get_overview, fetch_commits, fetch_repos
from datetime import datetime, timedelta

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/overview")
async def overview():
    return await get_overview()


@router.get("/commits")
async def commits(range: int = Query(30, description="Number of days")):
    since = (datetime.utcnow() - timedelta(days=range)).isoformat() + "Z"
    repos = await fetch_repos()
    all_commits = []
    for repo in repos[:10]:
        repo_commits = await fetch_commits(repo["name"], since=since)
        for c in repo_commits:
            all_commits.append({
                "repo": repo["name"],
                "sha": c["sha"][:7],
                "message": c["commit"]["message"].split("\n")[0],
                "date": c["commit"]["author"]["date"],
                "author": c["commit"]["author"]["name"],
            })
    all_commits.sort(key=lambda x: x["date"], reverse=True)
    return {"commits": all_commits, "total": len(all_commits)}


@router.get("/history")
async def history(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Snapshot).order_by(desc(Snapshot.fetched_at)).limit(30)
    )
    snapshots = result.scalars().all()
    return [
        {
            "date": s.fetched_at,
            "total_repos": s.total_repos,
            "total_stars": s.total_stars,
            "languages": s.languages,
        }
        for s in snapshots
    ]

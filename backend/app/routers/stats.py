from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.database import get_db
from app.models.schemas import Snapshot
from app.services.github import (
    get_overview, fetch_commits, fetch_repos,
    fetch_user, fetch_user_prs, fetch_user_issues,
)
from app.config import settings
from datetime import datetime, timedelta

router = APIRouter(prefix="/stats", tags=["stats"])


def resolve(username: str | None) -> str:
    u = username or settings.github_username
    if not u:
        raise HTTPException(status_code=400, detail="Username is required")
    return u


@router.get("/user")
async def user_profile(username: str = Query(None)):
    try:
        data = await fetch_user(resolve(username))
    except Exception:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "login": data["login"],
        "name": data.get("name"),
        "avatar_url": data["avatar_url"],
        "location": data.get("location"),
        "bio": data.get("bio"),
        "followers": data["followers"],
        "following": data["following"],
        "public_repos": data["public_repos"],
        "html_url": data["html_url"],
    }


@router.get("/overview")
async def overview(username: str = Query(None)):
    try:
        return await get_overview(resolve(username))
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=404, detail="User not found")


@router.get("/commits")
async def commits(username: str = Query(None), range: int = Query(30)):
    u = resolve(username)
    since = (datetime.utcnow() - timedelta(days=range)).isoformat() + "Z"
    repos = await fetch_repos(u)
    all_commits = []
    for repo in repos[:10]:
        repo_commits = await fetch_commits(u, repo["name"], since=since)
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


@router.get("/prs")
async def prs(username: str = Query(None)):
    return await fetch_user_prs(resolve(username))


@router.get("/issues")
async def issues(username: str = Query(None)):
    return await fetch_user_issues(resolve(username))


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

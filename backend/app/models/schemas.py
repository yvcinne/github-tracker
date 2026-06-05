from sqlalchemy import Column, String, Integer, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base


class Snapshot(Base):
    __tablename__ = "snapshots"

    id = Column(Integer, primary_key=True, index=True)
    fetched_at = Column(DateTime(timezone=True), server_default=func.now())
    total_repos = Column(Integer)
    total_stars = Column(Integer)
    total_commits = Column(Integer)
    total_prs = Column(Integer)
    total_issues = Column(Integer)
    languages = Column(JSON)
    top_repos = Column(JSON)

import httpx
from app.config import settings

BASE_URL = "https://api.github.com"
HEADERS = {
    "Authorization": f"Bearer {settings.github_token}",
    "Accept": "application/vnd.github+json",
}


async def fetch_repos() -> list[dict]:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/users/{settings.github_username}/repos",
            headers=HEADERS,
            params={"per_page": 100, "sort": "updated"},
        )
        response.raise_for_status()
        return response.json()


async def fetch_commits(repo: str, since: str = None) -> list[dict]:
    params = {"per_page": 100}
    if since:
        params["since"] = since
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/repos/{settings.github_username}/{repo}/commits",
            headers=HEADERS,
            params=params,
        )
        if response.status_code == 409:
            return []
        response.raise_for_status()
        return response.json()


async def fetch_pull_requests(repo: str, state: str = "all") -> list[dict]:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/repos/{settings.github_username}/{repo}/pulls",
            headers=HEADERS,
            params={"state": state, "per_page": 100},
        )
        response.raise_for_status()
        return response.json()


async def fetch_issues(repo: str, state: str = "all") -> list[dict]:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/repos/{settings.github_username}/{repo}/issues",
            headers=HEADERS,
            params={"state": state, "per_page": 100},
        )
        response.raise_for_status()
        return response.json()


async def get_overview() -> dict:
    repos = await fetch_repos()

    total_stars = sum(r["stargazers_count"] for r in repos)
    languages: dict[str, int] = {}
    for repo in repos:
        if repo.get("language"):
            languages[repo["language"]] = languages.get(repo["language"], 0) + 1

    top_repos = sorted(repos, key=lambda r: r["stargazers_count"], reverse=True)[:5]

    return {
        "total_repos": len(repos),
        "total_stars": total_stars,
        "languages": languages,
        "top_repos": [
            {
                "name": r["name"],
                "stars": r["stargazers_count"],
                "forks": r["forks_count"],
                "language": r["language"],
                "url": r["html_url"],
            }
            for r in top_repos
        ],
    }

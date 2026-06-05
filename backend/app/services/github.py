import httpx
from app.config import settings

BASE_URL = "https://api.github.com"
HEADERS = {
    "Authorization": f"Bearer {settings.github_token}",
    "Accept": "application/vnd.github+json",
}


async def fetch_user(username: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/users/{username}", headers=HEADERS)
        response.raise_for_status()
        return response.json()


async def fetch_repos(username: str) -> list[dict]:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/users/{username}/repos",
            headers=HEADERS,
            params={"per_page": 100, "sort": "updated"},
        )
        response.raise_for_status()
        return response.json()


async def fetch_commits(username: str, repo: str, since: str = None) -> list[dict]:
    params = {"per_page": 100}
    if since:
        params["since"] = since
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/repos/{username}/{repo}/commits",
            headers=HEADERS,
            params=params,
        )
        if response.status_code == 409:
            return []
        response.raise_for_status()
        return response.json()


async def fetch_user_prs(username: str) -> dict:
    async with httpx.AsyncClient() as client:
        total_res = await client.get(
            f"{BASE_URL}/search/issues",
            headers=HEADERS,
            params={"q": f"author:{username} type:pr", "per_page": 1},
        )
        merged_res = await client.get(
            f"{BASE_URL}/search/issues",
            headers=HEADERS,
            params={"q": f"author:{username} type:pr is:merged", "per_page": 1},
        )
        open_res = await client.get(
            f"{BASE_URL}/search/issues",
            headers=HEADERS,
            params={"q": f"author:{username} type:pr is:open", "per_page": 1},
        )
        total = total_res.json().get("total_count", 0)
        merged = merged_res.json().get("total_count", 0)
        open_ = open_res.json().get("total_count", 0)
        return {"total": total, "merged": merged, "open": open_}


async def fetch_user_issues(username: str) -> dict:
    async with httpx.AsyncClient() as client:
        total_res = await client.get(
            f"{BASE_URL}/search/issues",
            headers=HEADERS,
            params={"q": f"author:{username} type:issue", "per_page": 1},
        )
        open_res = await client.get(
            f"{BASE_URL}/search/issues",
            headers=HEADERS,
            params={"q": f"author:{username} type:issue is:open", "per_page": 1},
        )
        closed_res = await client.get(
            f"{BASE_URL}/search/issues",
            headers=HEADERS,
            params={"q": f"author:{username} type:issue is:closed", "per_page": 1},
        )
        total = total_res.json().get("total_count", 0)
        open_ = open_res.json().get("total_count", 0)
        closed = closed_res.json().get("total_count", 0)
        return {"total": total, "open": open_, "closed": closed}


async def get_overview(username: str) -> dict:
    repos = await fetch_repos(username)

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

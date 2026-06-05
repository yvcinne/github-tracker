import resend
from app.config import settings


def send_weekly_summary(data: dict):
    resend.api_key = settings.resend_api_key

    html = f"""
    <h2>GitHub Weekly Summary</h2>
    <ul>
        <li><strong>Total Repos:</strong> {data['total_repos']}</li>
        <li><strong>Total Stars:</strong> {data['total_stars']}</li>
        <li><strong>Commits this week:</strong> {data.get('weekly_commits', 'N/A')}</li>
        <li><strong>PRs merged:</strong> {data.get('weekly_prs', 'N/A')}</li>
        <li><strong>Issues closed:</strong> {data.get('weekly_issues', 'N/A')}</li>
    </ul>
    <h3>Top Repos</h3>
    <ul>
        {''.join(f"<li><a href='{r['url']}'>{r['name']}</a> — {r['stars']} stars</li>" for r in data.get('top_repos', []))}
    </ul>
    """

    resend.Emails.send({
        "from": "analytics@yourdomain.com",
        "to": settings.email_to,
        "subject": "Your GitHub Weekly Summary",
        "html": html,
    })

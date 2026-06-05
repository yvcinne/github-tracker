# GitHub Tracker

A full-stack dashboard to track any GitHub user's activity — commits, repos, languages, stars, PRs and issues — with daily snapshots and weekly email summaries.

## Stack

| Layer | Tool |
|---|---|
| Backend | FastAPI (Python) |
| Database | SQLite via `aiosqlite` |
| Scheduler | APScheduler |
| Email | Resend (optional) |
| Frontend | React + Vite |
| Charts | Recharts |

## Project Structure

```
github-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   ├── routers/
│   │   └── services/
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── hooks/
    │   └── pages/
    └── package.json
```

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yvcinne/github-tracker.git
cd github-tracker
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Fill in your `.env`:

```env
GITHUB_TOKEN=your_github_personal_access_token
DATABASE_URL=sqlite+aiosqlite:///./analytics.db
```

> Get a GitHub token at [github.com/settings/tokens](https://github.com/settings/tokens) — only needs `read:user` and `repo` scopes.

Optional (for weekly email summaries):

```env
RESEND_API_KEY=your_resend_api_key
EMAIL_TO=your@email.com
```

Start the backend — the database is created automatically on first run:

```bash
uvicorn app.main:app --reload
```

API docs available at `http://localhost:8000/docs`

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` and enter any GitHub username to get started.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/stats/user?username=` | GitHub profile info |
| GET | `/stats/overview?username=` | Repos, stars, languages, top repos |
| GET | `/stats/commits?username=&range=30` | Commits for the last N days |
| GET | `/stats/prs?username=` | Pull request counts (open / merged) |
| GET | `/stats/issues?username=` | Issue counts (open / closed) |
| GET | `/stats/history` | Historical snapshots from DB |
| POST | `/summary/send-email` | Trigger a weekly summary email |
| GET | `/health` | Health check |

## Features

- **Search by username** — track any public GitHub profile
- **Overview cards** — total repos, stars, languages used
- **Language breakdown** — interactive donut chart with progress bars
- **Top repositories** — sorted by stars with links
- **PRs & Issues** — open / merged / closed counts
- **Recent commits** — filterable by 7, 30, or 90 days
- **Commit frequency** — bar chart of daily commit activity
- **Historical tracking** — daily snapshots stored in the database
- **Stars over time** — line chart from stored snapshots
- **Weekly email** — automated Monday morning summary via Resend
- **Light / dark mode** — persistent theme toggle
- **User not found** — clear error screen for invalid usernames

## Requirements

- Python **3.12+** (3.14 supported)
- Node.js 18+

## Deployment

**Backend → [Railway](https://railway.app) or [Render](https://render.com)**

Set the environment variables in the platform dashboard and use this start command:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Frontend → [Vercel](https://vercel.com)**

Update `vite.config.js` to point to your deployed backend URL, then connect the repo to Vercel.

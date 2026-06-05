# GitHub Analytics Dashboard

A full-stack dashboard to track your GitHub activity — commits, repos, languages, stars — with daily snapshots and weekly email summaries.

## Stack

| Layer | Tool |
|---|---|
| Backend | FastAPI (Python) |
| Database | SQLite (local) / Supabase (prod) |
| Scheduler | APScheduler |
| Email | Resend |
| Frontend | React + Vite |
| Charts | Recharts |

## Project Structure

```
github-analytics/
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
    │   └── pages/
    └── package.json
```

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/github-analytics
cd github-analytics
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
GITHUB_USERNAME=your_github_username
DATABASE_URL=sqlite+aiosqlite:///./analytics.db
RESEND_API_KEY=your_resend_api_key
EMAIL_TO=your@email.com
```

> Get a GitHub token at [github.com/settings/tokens](https://github.com/settings/tokens) — only needs `read:user` and `repo` scopes.

Start the backend:

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

Open `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/stats/overview` | Repos, stars, languages, top repos |
| GET | `/stats/commits?range=30` | Commits for the last N days |
| GET | `/stats/history` | Historical snapshots from DB |
| POST | `/summary/send-email` | Trigger a weekly summary email |
| GET | `/health` | Health check |

## Features

- **Overview cards** — total repos, stars, languages used
- **Language breakdown** — pie chart of your most used languages
- **Top repositories** — sorted by stars with links
- **Recent commits** — filterable by 7, 30, or 90 days
- **Historical tracking** — daily snapshots stored in the database
- **Stars over time** — line chart from stored snapshots
- **Weekly email** — automated Monday morning summary via Resend

## Deployment

**Backend → [Railway](https://railway.app) or [Render](https://render.com)**

Set the environment variables in the platform dashboard and use this start command:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Frontend → [Vercel](https://vercel.com)**

Update `vite.config.js` to point to your deployed backend URL, then connect the repo to Vercel.

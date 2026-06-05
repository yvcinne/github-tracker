import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUser, getOverview, getCommits, getPRs, getIssues, getHistory } from '../api/github';
import OverviewCards from '../components/OverviewCards';
import LanguagesChart from '../components/LanguagesChart';
import TopRepos from '../components/TopRepos';
import CommitsList from '../components/CommitsList';
import CommitFrequency from '../components/CommitFrequency';
import HistoryChart from '../components/HistoryChart';
import ProfileCard from '../components/ProfileCard';
import PRsIssues from '../components/PRsIssues';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../hooks/useTheme';

export default function Dashboard() {
  const [commitRange, setCommitRange] = useState(30);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const { theme, toggle } = useTheme();

  const enabled = !!username;

  const user = useQuery({ queryKey: ['user', username], queryFn: () => getUser(username), enabled });
  const overview = useQuery({ queryKey: ['overview', username], queryFn: () => getOverview(username), enabled });
  const commits = useQuery({ queryKey: ['commits', commitRange, username], queryFn: () => getCommits(commitRange, username), enabled });
  const prs = useQuery({ queryKey: ['prs', username], queryFn: () => getPRs(username), enabled });
  const issues = useQuery({ queryKey: ['issues', username], queryFn: () => getIssues(username), enabled });
  const history = useQuery({ queryKey: ['history'], queryFn: getHistory, enabled });

  const handleTrack = () => {
    const trimmed = input.trim();
    if (trimmed) setUsername(trimmed);
  };

  if (!username) {
    return (
      <div className="landing">
        <div className="landing-theme">
          <ThemeToggle theme={theme} onToggle={toggle} />
        </div>
        <div className="landing-content">
          <div className="landing-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>
          <h1 className="landing-title">GitHub Tracker</h1>
          <p className="landing-subtitle">Enter a GitHub username to explore their profile, repositories, and activity.</p>
          <div className="search-bar landing-search">
            <span className="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              className="search-input"
              type="text"
              placeholder="Enter GitHub username..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
              autoFocus
            />
            <button className="btn" onClick={handleTrack}>Track</button>
          </div>
        </div>
      </div>
    );
  }

  if (overview.isLoading) return <div className="loading">Loading...</div>;
  if (overview.isError) return (
    <div className="landing">
      <div className="landing-content">
        <div className="landing-icon" style={{ background: 'color-mix(in srgb, var(--red) 12%, var(--surface))' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="landing-title" style={{ fontSize: 28, color: 'var(--text)', WebkitTextFillColor: 'var(--text)' }}>User not found</h1>
        <p className="landing-subtitle">
          <strong style={{ color: 'var(--text)' }}>@{username}</strong> doesn't exist on GitHub or the API is unavailable.
        </p>
        <button className="btn" onClick={() => setUsername('')}>← Try another username</button>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="back-btn" onClick={() => setUsername('')} aria-label="Go back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <div>
            <h1>GitHub Analytics</h1>
            <p>@{username}</p>
          </div>
        </div>
        <ThemeToggle theme={theme} onToggle={toggle} />
      </div>

      {user.data && <ProfileCard data={user.data} />}

      <OverviewCards data={overview.data} />

      <div className="grid-2">
        <LanguagesChart languages={overview.data.languages} />
        <TopRepos repos={overview.data.top_repos} />
      </div>

      <div className="grid-2">
        <PRsIssues prs={prs.data} issues={issues.data} />
        {history.data?.length > 0 ? (
          <HistoryChart history={history.data} />
        ) : (
          <div className="panel">
            <h2>Stars Over Time</h2>
            <p style={{ color: 'var(--muted)', marginTop: 16 }}>
              No historical data yet. Come back after the daily snapshot runs.
            </p>
          </div>
        )}
      </div>

      <div className="commit-range-bar">
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>Commits from last</span>
        {[7, 30, 90].map(d => (
          <button
            key={d}
            className={`btn-range${commitRange === d ? ' active' : ''}`}
            onClick={() => setCommitRange(d)}
          >
            {d}d
          </button>
        ))}
      </div>

      <div className="grid-2">
        <CommitsList commits={commits.data?.commits} />
        <CommitFrequency commits={commits.data?.commits} />
      </div>
    </div>
  );
}

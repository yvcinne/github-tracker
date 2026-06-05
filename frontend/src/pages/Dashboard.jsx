import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getOverview, getCommits, getHistory, sendEmail } from '../api/github';
import OverviewCards from '../components/OverviewCards';
import LanguagesChart from '../components/LanguagesChart';
import TopRepos from '../components/TopRepos';
import CommitsList from '../components/CommitsList';
import HistoryChart from '../components/HistoryChart';

export default function Dashboard() {
  const [commitRange, setCommitRange] = useState(30);

  const overview = useQuery({ queryKey: ['overview'], queryFn: getOverview });
  const commits = useQuery({ queryKey: ['commits', commitRange], queryFn: () => getCommits(commitRange) });
  const history = useQuery({ queryKey: ['history'], queryFn: getHistory });

  const emailMutation = useMutation({
    mutationFn: sendEmail,
    onSuccess: () => alert('Weekly summary sent!'),
    onError: () => alert('Failed to send email.'),
  });

  if (overview.isLoading) return <div className="loading">Loading...</div>;
  if (overview.isError) return <div className="error">Failed to load data. Is the backend running?</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>GitHub Analytics</h1>
          <p>Your GitHub activity at a glance</p>
        </div>
        <button
          className="btn"
          onClick={() => emailMutation.mutate()}
          disabled={emailMutation.isPending}
        >
          {emailMutation.isPending ? 'Sending...' : 'Send Weekly Summary'}
        </button>
      </div>

      <OverviewCards data={overview.data} />

      <div className="grid-2">
        <LanguagesChart languages={overview.data.languages} />
        <TopRepos repos={overview.data.top_repos} />
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>Commits from last</span>
          {[7, 30, 90].map(d => (
            <button
              key={d}
              className="btn"
              onClick={() => setCommitRange(d)}
              style={{
                background: commitRange === d ? 'var(--accent)' : 'var(--surface)',
                color: commitRange === d ? '#000' : 'var(--text)',
                padding: '4px 10px',
              }}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <CommitsList commits={commits.data?.commits} />
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
    </div>
  );
}

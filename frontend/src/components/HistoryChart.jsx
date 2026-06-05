import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function HistoryChart({ history }) {
  const data = history?.map(s => ({
    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    stars: s.total_stars,
    repos: s.total_repos,
  }));

  return (
    <div className="panel" style={{ gridColumn: '1 / -1' }}>
      <h2>Stars Over Time</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
          <XAxis dataKey="date" stroke="#8b949e" tick={{ fontSize: 11 }} />
          <YAxis stroke="#8b949e" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6 }}
            itemStyle={{ color: '#e6edf3' }}
          />
          <Line type="monotone" dataKey="stars" stroke="#58a6ff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

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
          <defs>
            <linearGradient id="starsLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c8cff" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="date" stroke="var(--muted)" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--muted)" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, boxShadow: 'var(--shadow)' }}
            itemStyle={{ color: 'var(--text)' }}
          />
          <Line
            type="monotone"
            dataKey="stars"
            stroke="url(#starsLine)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#7c8cff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

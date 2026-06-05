import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function CommitFrequency({ commits }) {
  const frequency = {};
  commits?.forEach(c => {
    const date = c.date.split('T')[0];
    frequency[date] = (frequency[date] || 0) + 1;
  });

  const data = Object.entries(frequency)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      commits: count,
    }));

  return (
    <div className="panel">
      <h2>Commit Frequency</h2>
      {data.length === 0 ? (
        <p style={{ color: 'var(--muted)', marginTop: 16 }}>No commits in this range.</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barSize={12}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--muted)" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis stroke="var(--muted)" tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6 }}
              itemStyle={{ color: 'var(--text)' }}
            />
            <Bar dataKey="commits" fill="var(--green)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

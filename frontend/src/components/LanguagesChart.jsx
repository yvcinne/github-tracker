import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#58a6ff', '#3fb950', '#d29922', '#f85149', '#bc8cff', '#79c0ff', '#56d364'];

export default function LanguagesChart({ languages }) {
  const data = Object.entries(languages || {}).map(([name, count]) => ({ name, value: count }));

  return (
    <div className="panel">
      <h2>Languages</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6 }}
            itemStyle={{ color: '#e6edf3' }}
          />
          <Legend wrapperStyle={{ color: '#8b949e', fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

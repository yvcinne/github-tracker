export default function OverviewCards({ data }) {
  const stats = [
    { label: 'Repositories', value: data.total_repos },
    { label: 'Total Stars', value: data.total_stars },
    { label: 'Languages', value: Object.keys(data.languages || {}).length },
    { label: 'Top Repos', value: data.top_repos?.length ?? 0 },
  ];

  return (
    <div className="cards">
      {stats.map(s => (
        <div className="card" key={s.label}>
          <div className="card-label">{s.label}</div>
          <div className="card-value">{s.value}</div>
        </div>
      ))}
    </div>
  );
}

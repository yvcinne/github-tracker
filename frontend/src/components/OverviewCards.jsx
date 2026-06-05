const icons = {
  repos: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  stars: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  languages: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  trophy: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  ),
};

const cardConfig = [
  { key: 'total_repos',  label: 'Total Repos',  icon: icons.repos,     color: '#4f8ef7' },
  { key: 'total_stars',  label: 'Total Stars',  icon: icons.stars,     color: '#f59e0b' },
  { key: 'languages',    label: 'Languages',    icon: icons.languages, color: '#10b981' },
  { key: 'top_repos',    label: 'Top Repos',    icon: icons.trophy,    color: '#8b5cf6' },
];

export default function OverviewCards({ data }) {
  const values = {
    total_repos: data.total_repos,
    total_stars: data.total_stars,
    languages:   Object.keys(data.languages || {}).length,
    top_repos:   data.top_repos?.length ?? 0,
  };

  return (
    <div className="cards">
      {cardConfig.map(({ key, label, icon, color, bg }) => (
        <div className="card" key={key}>
          <div className="card-icon" style={{ '--icon-color': color, '--icon-bg': bg }}>
            {icon}
          </div>
          <div className="card-body">
            <div className="card-value">{values[key]}</div>
            <div className="card-label">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

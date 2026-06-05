export default function CommitsList({ commits }) {
  return (
    <div className="panel">
      <h2>Recent Commits</h2>
      <ul className="commits-list">
        {commits?.map(c => (
          <li className="commit-item" key={c.sha}>
            <span className="commit-message">{c.message}</span>
            <span className="commit-meta">
              <span className="commit-sha">{c.sha}</span>
              {' · '}
              {c.repo}
              {' · '}
              {new Date(c.date).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TopRepos({ repos }) {
  return (
    <div className="panel">
      <h2>Top Repositories</h2>
      <ul className="repo-list">
        {repos?.map(repo => (
          <li className="repo-item" key={repo.name}>
            <a className="repo-name" href={repo.url} target="_blank" rel="noreferrer">
              {repo.name}
            </a>
            <div className="repo-meta">
              {repo.language && <span>{repo.language}</span>}
              <span>★ {repo.stars}</span>
              <span>⑂ {repo.forks}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

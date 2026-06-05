export default function ProfileCard({ data }) {
  return (
    <div className="profile-card">
      <img className="profile-avatar" src={data.avatar_url} alt={data.login} />
      <div className="profile-info">
        <div className="profile-name">
          {data.name && <span className="profile-display-name">{data.name}</span>}
          <a className="profile-login" href={data.html_url} target="_blank" rel="noreferrer">
            @{data.login}
          </a>
        </div>
        {data.location && <div className="profile-location">📍 {data.location}</div>}
        {data.bio && <div className="profile-bio">{data.bio}</div>}
        <div className="profile-stats">
          <span><strong>{data.followers}</strong> followers</span>
          <span><strong>{data.following}</strong> following</span>
          <span><strong>{data.public_repos}</strong> repos</span>
        </div>
      </div>
    </div>
  );
}

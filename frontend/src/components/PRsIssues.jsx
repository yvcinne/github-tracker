function StatCard({ label, total, color, openCount, closedLabel, closedCount }) {
  return (
    <div style={{
      flex: 1,
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>
      {/* Label + total */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)' }}>
          {label}
        </span>
        <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.04em', color, lineHeight: 1 }}>
          {total ?? '—'}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* Open / Closed row */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Open</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)' }}>{openCount ?? 0}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
          <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{closedLabel}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)' }}>{closedCount ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PRsIssues({ prs, issues }) {
  return (
    <div className="panel">
      <h2>PRs &amp; Issues</h2>
      <div style={{ display: 'flex', gap: 12 }}>
        <StatCard
          label="Pull Requests"
          total={prs?.total}
          color="var(--accent)"
          openCount={prs?.open}
          closedLabel="Merged"
          closedCount={prs?.merged}
        />
        <StatCard
          label="Issues"
          total={issues?.total}
          color="var(--orange)"
          openCount={issues?.open}
          closedLabel="Closed"
          closedCount={issues?.closed}
        />
      </div>
    </div>
  );
}

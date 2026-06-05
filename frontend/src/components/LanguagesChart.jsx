import { useState, useCallback } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = [
  '#7c8cff', // accent blue-purple
  '#22d3ee', // cyan
  '#3fb950', // green
  '#e3a008', // amber
  '#f85149', // red
  '#a78bfa', // violet
  '#fb7185', // rose
  '#34d399', // emerald
  '#f59e0b', // yellow
  '#60a5fa', // light blue
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, fill } = payload[0].payload;
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border-strong)',
      borderRadius: 10,
      padding: '8px 14px',
      boxShadow: 'var(--shadow)',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: fill, flexShrink: 0 }} />
      <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>{name}</span>
      <span style={{ color: 'var(--muted)', fontSize: 12 }}>{value.toLocaleString()} repos</span>
    </div>
  );
};

export default function LanguagesChart({ languages }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const raw = Object.entries(languages || {});
  const total = raw.reduce((s, [, v]) => s + v, 0);
  const data = raw
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({ name, value }));

  const onMouseEnter = useCallback((_, index) => setActiveIndex(index), []);
  const onMouseLeave = useCallback(() => setActiveIndex(null), []);

  const activeEntry = activeIndex !== null ? data[activeIndex] : null;
  const centerPct = activeEntry ? Math.round((activeEntry.value / total) * 100) : null;

  if (!data.length) {
    return (
      <div className="panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>No language data</span>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>Languages</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Donut */}
        <div style={{ position: 'relative', flexShrink: 0, width: 160, height: 160 }}>
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={72}
                paddingAngle={2}
                stroke="var(--surface)"
                strokeWidth={3}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                    opacity={activeIndex === null || activeIndex === i ? 1 : 0.35}
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s ease' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            {activeEntry ? (
              <>
                <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
                  {centerPct}%
                </span>
                <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 500, maxWidth: 48, textAlign: 'center', lineHeight: 1.3 }}>
                  {activeEntry.name}
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
                  {data.length}
                </span>
                <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 500 }}>langs</span>
              </>
            )}
          </div>
        </div>

        {/* Language list */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
          {data.slice(0, 7).map(({ name, value }, i) => {
            const pct = Math.round((value / total) * 100);
            const isActive = activeIndex === i;
            return (
              <div
                key={name}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  cursor: 'default',
                  opacity: activeIndex === null || isActive ? 1 : 0.45,
                  transition: 'opacity 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: COLORS[i % COLORS.length],
                      flexShrink: 0,
                      boxShadow: isActive ? `0 0 6px ${COLORS[i % COLORS.length]}` : 'none',
                      transition: 'box-shadow 0.2s ease',
                    }} />
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100 }}>
                      {name}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, flexShrink: 0 }}>
                    {pct}%
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{
                  height: 3,
                  borderRadius: 99,
                  background: 'var(--border)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: COLORS[i % COLORS.length],
                    borderRadius: 99,
                    transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                    opacity: isActive ? 1 : 0.8,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import type { LifeEvent } from '../../types';

interface Props {
  title?: string;
  intro?: string;
  items: LifeEvent[];
}

export function LifeEvents({ title, intro, items }: Props) {
  if (!items || items.length === 0) return null;
  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <section className="invite-section section-life-events" style={{ background: 'var(--bg-alt)' }}>
      <p className="section-title">EVERAFTER</p>
      <h2 className="section-heading">{title || '결혼 그 후'}</h2>
      {intro && (
        <p className="account-intro" style={{ marginBottom: 18 }}>
          {intro}
        </p>
      )}
      <ol className="life-timeline" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 18 }}>
        {sorted.map((item) => (
          <li
            key={item.id}
            style={{
              display: 'grid',
              gridTemplateColumns: item.photo ? '88px 1fr' : '1fr',
              gap: 12,
              padding: 12,
              background: 'var(--card)',
              border: '1px solid var(--divider)',
              borderRadius: 10,
              alignItems: 'start',
            }}
          >
            {item.photo && (
              <img
                src={item.photo}
                alt={item.title}
                style={{
                  width: 88,
                  height: 88,
                  objectFit: 'cover',
                  borderRadius: 8,
                }}
              />
            )}
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', opacity: 0.7 }}>
                {formatDate(item.date)}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, margin: '4px 0 6px' }}>
                {item.title}
              </h3>
              {item.note && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {item.note}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function formatDate(date: string): string {
  if (!date) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  if (m) return `${m[1]}.${m[2]}.${m[3]}`;
  return date;
}

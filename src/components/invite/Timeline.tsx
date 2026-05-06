import { THEME_MAP } from '../../data/themes';
import type { ThemeId } from '../../types';
import { Divider } from './Divider';

interface Item {
  time: string;
  label: string;
  note?: string;
}

interface Props {
  title: string;
  items: Item[];
  theme: ThemeId;
}

export function Timeline({ title, items, theme }: Props) {
  const t = THEME_MAP[theme];
  if (items.length === 0) return null;

  return (
    <section className="invite-section section-timeline">
      <p className="section-label">
        {t.fonts.script ? <em className="script-label">Order of Service</em> : 'TIMELINE'}
      </p>
      <h2 className="section-heading">{title}</h2>
      <Divider kind={t.divider} />
      <ol className="timeline-list">
        {items.map((it, i) => (
          <li className="timeline-item" key={i}>
            <span className="timeline-time">{it.time}</span>
            <span className="timeline-rail" aria-hidden>
              <span className="dot" />
              {i < items.length - 1 && <span className="line" />}
            </span>
            <div className="timeline-body">
              <span className="timeline-label">{it.label}</span>
              {it.note && <span className="timeline-note">{it.note}</span>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

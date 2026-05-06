import { THEME_MAP } from '../../data/themes';
import type { ThemeId } from '../../types';

interface Props {
  date: string;
  theme: ThemeId;
}

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

export function CalendarWidget({ date, theme }: Props) {
  const t = THEME_MAP[theme];
  const [yStr, mStr, dStr] = date.split('-');
  const y = Number(yStr);
  const m = Number(mStr);
  const d = Number(dStr);
  if (!y || !m || !d) return null;

  const first = new Date(y, m - 1, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(y, m, 0).getDate();

  const cells: Array<{ day: number | null }> = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ day: null });
  for (let day = 1; day <= daysInMonth; day++) cells.push({ day });
  while (cells.length % 7 !== 0) cells.push({ day: null });

  return (
    <div className="cal-widget">
      <div className="cal-head">
        <span className="cal-month">{MONTHS_EN[m - 1]}</span>
        <span className="cal-year">{y}</span>
      </div>
      <div className="cal-week">
        {WEEK.map((w, i) => (
          <span key={w} className={`cal-w${i === 0 ? ' sun' : ''}${i === 6 ? ' sat' : ''}`}>
            {w}
          </span>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((c, i) => {
          if (c.day === null) return <span key={i} className="cal-cell empty" />;
          const isWedding = c.day === d;
          const weekday = (i % 7);
          return (
            <span
              key={i}
              className={`cal-cell${isWedding ? ' marked' : ''}${weekday === 0 ? ' sun' : ''}${weekday === 6 ? ' sat' : ''}`}
            >
              <span className="cal-num">{c.day}</span>
              {isWedding && <span className="cal-mark" aria-hidden />}
            </span>
          );
        })}
      </div>
      <p className="cal-caption">
        {t.fonts.script ? <em className="script-label">Save the date</em> : 'SAVE THE DATE'}
      </p>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { dDay } from '../../lib/calendar';

interface Props {
  date: string;
  time: string;
}

export function Countdown({ date, time }: Props) {
  const [tick, setTick] = useState(() => dDay(date, time));

  useEffect(() => {
    setTick(dDay(date, time));
    const id = window.setInterval(() => setTick(dDay(date, time)), 1000);
    return () => window.clearInterval(id);
  }, [date, time]);

  const cells: Array<[string, number]> = [
    ['DAYS', tick.days],
    ['HOURS', tick.hours],
    ['MIN', tick.minutes],
    ['SEC', tick.seconds],
  ];

  return (
    <>
      <div className="countdown" aria-live="polite">
        {cells.map(([label, n]) => (
          <div key={label} className="countdown-cell">
            <span className="countdown-num">{String(n).padStart(2, '0')}</span>
            <span className="countdown-label">{label}</span>
          </div>
        ))}
      </div>
      <p className="countdown-message">
        {tick.past
          ? '함께해 주셔서 감사합니다.'
          : `결혼식까지 ${tick.days}일 남았습니다.`}
      </p>
    </>
  );
}

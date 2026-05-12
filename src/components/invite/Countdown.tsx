import { useEffect, useRef, useState } from 'react';
import { dDay } from '../../lib/calendar';
import { celebrateRsvp } from '../../lib/celebrate';

interface Props {
  date: string;
  time: string;
}

export function Countdown({ date, time }: Props) {
  const [tick, setTick] = useState(() => dDay(date, time));
  const firedRef = useRef(false);

  useEffect(() => {
    setTick(dDay(date, time));
    firedRef.current = false;
    const id = window.setInterval(() => setTick(dDay(date, time)), 1000);
    return () => window.clearInterval(id);
  }, [date, time]);

  // When the countdown hits the wedding moment, fire confetti once.
  useEffect(() => {
    if (firedRef.current) return;
    if (tick.past) return;
    if (tick.days === 0 && tick.hours === 0 && tick.minutes === 0 && tick.seconds <= 1) {
      firedRef.current = true;
      celebrateRsvp();
    }
  }, [tick]);

  const cells: Array<[string, number]> = [
    ['DAYS', tick.days],
    ['HOURS', tick.hours],
    ['MIN', tick.minutes],
    ['SEC', tick.seconds],
  ];

  const today = !tick.past && tick.days === 0 && tick.hours <= 4;

  return (
    <>
      <div className={`countdown${today ? ' countdown--today' : ''}`} aria-live="polite">
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
          : today
          ? '🎉 오늘은 결혼식 날입니다 🎉'
          : `결혼식까지 ${tick.days}일 남았습니다.`}
      </p>
    </>
  );
}

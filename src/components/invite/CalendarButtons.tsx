import type { WeddingData } from '../../types';
import { downloadIcs, googleCalendarLink } from '../../lib/calendar';

export function CalendarButtons({ data }: { data: WeddingData }) {
  return (
    <div className="calendar-buttons">
      <a className="cal-btn" href={googleCalendarLink(data)} target="_blank" rel="noopener">
        구글 캘린더에 추가
      </a>
      <button className="cal-btn" onClick={() => downloadIcs(data)}>
        애플 캘린더 (.ics)
      </button>
    </div>
  );
}

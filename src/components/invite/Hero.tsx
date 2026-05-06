import type { WeddingData } from '../../types';
import { formatKoreanDate } from '../../lib/calendar';
import { Countdown } from './Countdown';
import { CalendarButtons } from './CalendarButtons';

interface Props {
  data: WeddingData;
}

function ParentLine({
  father,
  mother,
  fatherDeceased,
  motherDeceased,
  childRole,
  child,
}: {
  father: string;
  mother: string;
  fatherDeceased?: boolean;
  motherDeceased?: boolean;
  childRole: string;
  child: string;
}) {
  const f = (fatherDeceased ? '故 ' : '') + father;
  const m = (motherDeceased ? '故 ' : '') + mother;
  return (
    <div>
      <div style={{ fontSize: 13, lineHeight: 1.6 }}>
        {f} · {m}
      </div>
      <div style={{ fontSize: 14, marginTop: 2 }}>
        <span style={{ opacity: 0.6, marginRight: 6 }}>{childRole}</span>
        <strong style={{ fontWeight: 500 }}>{child}</strong>
      </div>
    </div>
  );
}

export function Hero({ data }: Props) {
  return (
    <section className="invite-section" style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}>
      {data.hero && <img className="hero-image" src={data.hero} alt="메인" />}
      <div className="hero-text">
        <p className="hero-date">{formatKoreanDate(data.wedding.date, data.wedding.time)}</p>
        <h1 className="hero-names">
          {data.groom.name} <span className="amp">&amp;</span> {data.bride.name}
        </h1>

        <div className="hero-parents">
          <ParentLine
            father={data.groom.father}
            mother={data.groom.mother}
            fatherDeceased={data.groom.fatherDeceased}
            motherDeceased={data.groom.motherDeceased}
            childRole="아들"
            child={data.groom.name}
          />
          <div className="divider" />
          <ParentLine
            father={data.bride.father}
            mother={data.bride.mother}
            fatherDeceased={data.bride.fatherDeceased}
            motherDeceased={data.bride.motherDeceased}
            childRole="딸"
            child={data.bride.name}
          />
        </div>

        {data.wedding.venue && (
          <p className="hero-venue">
            {data.wedding.venue}
            {data.wedding.venueDetail ? ` · ${data.wedding.venueDetail}` : ''}
          </p>
        )}

        <Countdown date={data.wedding.date} time={data.wedding.time} />
        <CalendarButtons data={data} />
      </div>
    </section>
  );
}

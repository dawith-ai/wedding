import type { WeddingData } from '../../types';
import { THEME_MAP } from '../../data/themes';
import { Divider } from './Divider';

interface Props {
  data: WeddingData;
}

export function Interview({ data }: Props) {
  const interview = data.interview;
  if (!interview?.enabled || interview.items.length === 0) return null;
  const t = THEME_MAP[data.theme];
  const groomLabel = (data.groom.name || '신랑').charAt(0);
  const brideLabel = (data.bride.name || '신부').charAt(0);

  return (
    <section className="invite-section section-interview">
      <p className="section-label">
        {t.fonts.script ? <em className="script-label">Interview</em> : 'INTERVIEW'}
      </p>
      <h2 className="section-heading">{interview.title || '우리 둘의 이야기'}</h2>
      <Divider kind={t.divider} />

      <ul className="interview-list">
        {interview.items.map((item, idx) => (
          <li className="interview-item" key={item.id || idx}>
            <p className="interview-q">
              <span className="interview-q-mark" aria-hidden>
                Q{idx + 1}
              </span>
              {item.question}
            </p>
            {item.answerGroom?.trim() && (
              <div className="interview-row interview-row--groom">
                <span className="interview-who" aria-label="신랑">
                  {groomLabel}
                </span>
                <p className="interview-a">{item.answerGroom}</p>
              </div>
            )}
            {item.answerBride?.trim() && (
              <div className="interview-row interview-row--bride">
                <span className="interview-who" aria-label="신부">
                  {brideLabel}
                </span>
                <p className="interview-a">{item.answerBride}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

import type { WeddingData } from '../../types';
import { THEME_MAP } from '../../data/themes';
import { Divider } from './Divider';

interface Props {
  data: WeddingData;
}

export function BrideGroomNotes({ data }: Props) {
  const notes = data.notes;
  if (!notes?.enabled) return null;
  const t = THEME_MAP[data.theme];
  const groomNote = (notes.groom || '').trim();
  const brideNote = (notes.bride || '').trim();
  if (!groomNote && !brideNote) return null;

  return (
    <section className="invite-section section-notes">
      <p className="section-label">
        {t.fonts.script ? <em className="script-label">Our message</em> : 'OUR MESSAGE'}
      </p>
      <h2 className="section-heading">하객분들께 드리는 한마디</h2>
      <Divider kind={t.divider} />

      <div className="notes-grid">
        {groomNote && (
          <article className="note-card note-card--groom">
            <header className="note-head">
              <span className="note-side">신랑</span>
              <strong className="note-name">{data.groom.name}</strong>
            </header>
            <blockquote className="note-body">
              <span className="note-quote" aria-hidden>“</span>
              {groomNote}
            </blockquote>
          </article>
        )}
        {brideNote && (
          <article className="note-card note-card--bride">
            <header className="note-head">
              <span className="note-side">신부</span>
              <strong className="note-name">{data.bride.name}</strong>
            </header>
            <blockquote className="note-body">
              <span className="note-quote" aria-hidden>“</span>
              {brideNote}
            </blockquote>
          </article>
        )}
      </div>
    </section>
  );
}

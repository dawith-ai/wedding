import type { WeddingData } from '../../types';
import { THEME_MAP } from '../../data/themes';
import { Divider } from './Divider';

interface Props {
  data: WeddingData;
}

function isValidColor(c: string): boolean {
  return /^#[0-9a-fA-F]{3,8}$/.test(c) || /^(rgb|hsl)a?\(/i.test(c);
}

export function DressCode({ data }: Props) {
  const dc = data.dressCode;
  if (!dc?.enabled) return null;
  const t = THEME_MAP[data.theme];
  const colors = (dc.colors || []).filter(isValidColor).slice(0, 6);
  const hasColors = colors.length > 0;
  const hasNote = (dc.note ?? '').trim().length > 0;
  if (!hasColors && !hasNote) return null;

  return (
    <section className="invite-section invite-section--tight section-dresscode">
      <p className="section-label">
        {t.fonts.script ? <em className="script-label">Dress Code</em> : 'DRESS CODE'}
      </p>
      <h2 className="section-heading">{dc.title || '드레스 코드'}</h2>
      <Divider kind={t.divider} />

      {hasColors && (
        <ul className="dresscode-swatches" aria-label="추천 색상">
          {colors.map((c, i) => (
            <li key={`${c}-${i}`} className="dresscode-swatch">
              <span
                className="dresscode-swatch-chip"
                style={{ background: c }}
                aria-hidden
              />
              <span className="dresscode-swatch-hex">{c.toUpperCase()}</span>
            </li>
          ))}
        </ul>
      )}

      {hasNote && <p className="dresscode-note">{dc.note}</p>}
    </section>
  );
}

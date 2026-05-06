import { THEME_MAP } from '../../data/themes';
import type { ThemeId } from '../../types';
import { Divider } from './Divider';

interface Props {
  title: string;
  body: string;
  photos: string[];
  theme: ThemeId;
}

export function Story({ title, body, photos, theme }: Props) {
  const t = THEME_MAP[theme];
  const treatment = t.photoTreatment;
  return (
    <section className="invite-section section-story">
      <p className="section-label">
        {t.fonts.script ? <em className="script-label">Our Story</em> : 'OUR STORY'}
      </p>
      <h2 className="section-heading">{title}</h2>
      <Divider kind={t.divider} />
      <p className="story-text">{body}</p>
      {photos.length > 0 && (
        <div className={`story-photos count-${Math.min(photos.length, 4)}`} data-treatment={treatment}>
          {photos.slice(0, 4).map((src, i) => (
            <div className="story-photo" key={i}>
              <img src={src} alt={`story-${i}`} loading="lazy" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

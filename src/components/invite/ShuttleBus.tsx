import { THEME_MAP } from '../../data/themes';
import type { ThemeId } from '../../types';
import { Divider } from './Divider';

interface Props {
  info: string;
  theme: ThemeId;
}

export function ShuttleBus({ info, theme }: Props) {
  const t = THEME_MAP[theme];
  if (!info.trim()) return null;
  return (
    <section className="invite-section section-shuttle">
      <p className="section-label">
        {t.fonts.script ? <em className="script-label">Shuttle</em> : 'SHUTTLE BUS'}
      </p>
      <h2 className="section-heading">셔틀버스 안내</h2>
      <Divider kind={t.divider} />
      <p className="shuttle-info">{info}</p>
    </section>
  );
}

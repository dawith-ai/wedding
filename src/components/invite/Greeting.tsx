import { THEME_MAP } from '../../data/themes';
import type { ThemeId } from '../../types';
import { Divider } from './Divider';

interface Props {
  title: string;
  body: string;
  theme: ThemeId;
}

export function Greeting({ title, body, theme }: Props) {
  const t = THEME_MAP[theme];
  return (
    <section className="invite-section invite-section--tight">
      <p className="section-label">
        {t.fonts.script ? <em className="script-label">Invitation</em> : 'INVITATION'}
      </p>
      <h2 className="section-heading">{title}</h2>
      <Divider kind={t.divider} />
      <p className="greeting-body">{body}</p>
    </section>
  );
}

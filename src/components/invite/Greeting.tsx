import { Fragment } from 'react';
import { THEME_MAP } from '../../data/themes';
import type { ThemeId } from '../../types';
import { Divider } from './Divider';

interface Props {
  title: string;
  body: string;
  theme: ThemeId;
}

/* Render a greeting body that may contain `**text**` markers for
 * emphasis. The match is per-paragraph, so the drop-cap still applies
 * to the first non-emphasized character of the trimmed body. */
function parseEmphasis(text: string): Array<{ kind: 'plain' | 'em'; value: string }> {
  const parts: Array<{ kind: 'plain' | 'em'; value: string }> = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push({ kind: 'plain', value: text.slice(last, m.index) });
    }
    parts.push({ kind: 'em', value: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    parts.push({ kind: 'plain', value: text.slice(last) });
  }
  return parts.length > 0 ? parts : [{ kind: 'plain', value: text }];
}

function renderBody(body: string) {
  const trimmed = body.trimStart();
  if (!trimmed) return body;

  const parts = parseEmphasis(trimmed);
  // Drop-cap applies to the first character of the first plain part.
  let dropApplied = false;
  return (
    <>
      {parts.map((p, i) => {
        if (p.kind === 'em') {
          return (
            <em key={i} className="greeting-accent">
              {p.value}
            </em>
          );
        }
        if (!dropApplied && p.value.length > 0) {
          dropApplied = true;
          const first = p.value.charAt(0);
          const rest = p.value.slice(1);
          return (
            <Fragment key={i}>
              <span className="drop-cap">{first}</span>
              {rest}
            </Fragment>
          );
        }
        return <Fragment key={i}>{p.value}</Fragment>;
      })}
    </>
  );
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
      <p className="greeting-body">{renderBody(body)}</p>
    </section>
  );
}

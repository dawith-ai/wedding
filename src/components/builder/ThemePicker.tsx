import type { ThemeId } from '../../types';
import { THEMES } from '../../data/themes';

interface Props {
  value: ThemeId;
  onChange: (id: ThemeId) => void;
}

export function ThemePicker({ value, onChange }: Props) {
  return (
    <div className="theme-grid">
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`theme-card${value === t.id ? ' active' : ''}`}
          onClick={() => onChange(t.id)}
          title={t.description}
        >
          <div
            className="theme-swatch"
            style={{
              background: t.preview.bg,
              boxShadow: `inset 0 0 0 6px ${t.preview.bg}, inset 0 0 0 7px ${t.preview.text}40`,
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: '14%',
                top: '20%',
                fontFamily: t.fonts.display,
                fontSize: 14,
                color: t.preview.text,
                letterSpacing: '0.04em',
              }}
            >
              {t.preview.text === '#fff' || t.preview.bg.startsWith('#0') ? '♥' : 'A&B'}
            </span>
            <span
              style={{
                position: 'absolute',
                bottom: '12%',
                right: '14%',
                width: '34%',
                height: '34%',
                borderRadius: '50%',
                background: t.preview.accent,
              }}
            />
          </div>
          <div className="theme-name">{t.name}</div>
          <div className="theme-desc">{t.description}</div>
        </button>
      ))}
    </div>
  );
}

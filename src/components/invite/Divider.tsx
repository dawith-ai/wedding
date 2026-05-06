import type { DividerKind } from '../../data/themes';

interface Props {
  kind: DividerKind;
  inverted?: boolean;
}

export function Divider({ kind, inverted = false }: Props) {
  const stroke = inverted ? 'currentColor' : 'var(--accent)';
  const muted = inverted ? 'currentColor' : 'var(--text-muted)';

  switch (kind) {
    case 'gold-line':
      return (
        <div className="divider-gold-line" aria-hidden>
          <span />
          <svg viewBox="0 0 12 12" width="10" height="10">
            <polygon points="6,1 7.2,4.8 11,6 7.2,7.2 6,11 4.8,7.2 1,6 4.8,4.8" fill={stroke} />
          </svg>
          <span />
        </div>
      );

    case 'double-dot':
      return (
        <svg viewBox="0 0 200 14" className="divider-svg" aria-hidden>
          <line x1="0" y1="7" x2="84" y2="7" stroke={stroke} strokeWidth="0.8" />
          <circle cx="92" cy="7" r="2.4" fill={stroke} />
          <circle cx="100" cy="7" r="1" fill={stroke} />
          <circle cx="108" cy="7" r="2.4" fill={stroke} />
          <line x1="116" y1="7" x2="200" y2="7" stroke={stroke} strokeWidth="0.8" />
        </svg>
      );

    case 'tilde':
      return (
        <svg viewBox="0 0 120 14" className="divider-svg" aria-hidden>
          <path
            d="M5 7 Q22 -3 42 7 T78 7 T115 7"
            fill="none"
            stroke={stroke}
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'leaf-sprig':
      return (
        <svg viewBox="0 0 200 30" className="divider-svg" aria-hidden>
          <line x1="0" y1="15" x2="78" y2="15" stroke={muted} strokeWidth="0.6" />
          <g transform="translate(100 15)" fill="none" stroke={stroke} strokeWidth="1.1" strokeLinecap="round">
            <path d="M-18 0 Q0 -2 18 0" />
            <path d="M-12 -1 Q-15 -7 -8 -8" />
            <path d="M-4 -2 Q-7 -10 0 -11" />
            <path d="M4 -2 Q7 -10 0 -11" opacity="0.8" />
            <path d="M12 -1 Q15 -7 8 -8" />
            <circle cx="0" cy="0" r="1.2" fill={stroke} stroke="none" />
          </g>
          <line x1="122" y1="15" x2="200" y2="15" stroke={muted} strokeWidth="0.6" />
        </svg>
      );

    case 'floral-branch':
      return (
        <svg viewBox="0 0 220 36" className="divider-svg" aria-hidden>
          <line x1="0" y1="18" x2="78" y2="18" stroke={muted} strokeWidth="0.6" />
          <g transform="translate(110 18)">
            <circle cx="0" cy="0" r="3.2" fill={stroke} />
            <circle cx="-12" cy="-3" r="2" fill={stroke} opacity="0.85" />
            <circle cx="12" cy="-3" r="2" fill={stroke} opacity="0.85" />
            <circle cx="-7" cy="6" r="1.6" fill={stroke} opacity="0.7" />
            <circle cx="7" cy="6" r="1.6" fill={stroke} opacity="0.7" />
            <path d="M-22 0 Q-12 -10 0 -8" fill="none" stroke={muted} strokeWidth="0.7" />
            <path d="M22 0 Q12 -10 0 -8" fill="none" stroke={muted} strokeWidth="0.7" />
          </g>
          <line x1="142" y1="18" x2="220" y2="18" stroke={muted} strokeWidth="0.6" />
        </svg>
      );

    case 'hanji-line':
      return (
        <svg viewBox="0 0 220 22" className="divider-svg" aria-hidden>
          <line x1="0" y1="11" x2="92" y2="11" stroke={muted} strokeWidth="0.7" strokeDasharray="1 3" />
          <g transform="translate(110 11)">
            <rect x="-1.2" y="-7" width="2.4" height="14" fill={stroke} />
            <rect x="-7" y="-1.2" width="14" height="2.4" fill={stroke} />
          </g>
          <line x1="128" y1="11" x2="220" y2="11" stroke={muted} strokeWidth="0.7" strokeDasharray="1 3" />
        </svg>
      );

    case 'plain':
      return <div className="divider-plain" aria-hidden />;

    case 'none':
      return null;

    default:
      return null;
  }
}

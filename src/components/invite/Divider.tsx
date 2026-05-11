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
          <svg viewBox="0 0 14 14" width="12" height="12">
            <defs>
              <radialGradient id="dvg-star" cx="50%" cy="35%" r="55%">
                <stop offset="0%" stopColor="rgba(255, 245, 210, 1)" />
                <stop offset="100%" stopColor={stroke} />
              </radialGradient>
            </defs>
            <polygon
              points="7,1 8.4,5.6 13,7 8.4,8.4 7,13 5.6,8.4 1,7 5.6,5.6"
              fill="url(#dvg-star)"
            />
            <circle cx="7" cy="7" r="1" fill="rgba(255, 245, 210, 0.85)" />
          </svg>
          <span />
        </div>
      );

    case 'double-dot':
      return (
        <svg viewBox="0 0 200 14" className="divider-svg" aria-hidden>
          <line x1="0" y1="7" x2="82" y2="7" stroke={stroke} strokeWidth="0.8" />
          <circle cx="92" cy="7" r="2.4" fill={stroke} />
          <circle cx="100" cy="7" r="1" fill={stroke} opacity="0.65" />
          <circle cx="108" cy="7" r="2.4" fill={stroke} />
          <line x1="118" y1="7" x2="200" y2="7" stroke={stroke} strokeWidth="0.8" />
        </svg>
      );

    case 'tilde':
      return (
        <svg viewBox="0 0 120 14" className="divider-svg" aria-hidden>
          <path
            d="M5 7 Q22 -3 42 7 T78 7 T115 7"
            fill="none"
            stroke={stroke}
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <circle cx="5" cy="7" r="1.1" fill={stroke} />
          <circle cx="115" cy="7" r="1.1" fill={stroke} />
        </svg>
      );

    case 'leaf-sprig':
      return (
        <svg viewBox="0 0 200 30" className="divider-svg" aria-hidden>
          <line x1="0" y1="15" x2="78" y2="15" stroke={muted} strokeWidth="0.6" />
          <g transform="translate(100 15)" fill="none" stroke={stroke} strokeWidth="1.1" strokeLinecap="round">
            <path d="M-18 0 Q0 -2 18 0" />
            <path d="M-12 -1 Q-15 -7 -8 -8" />
            <path d="M-12 -1 Q-13 -4.5 -10 -5" strokeWidth="0.5" opacity="0.6" />
            <path d="M-4 -2 Q-7 -10 0 -11" />
            <path d="M-4 -2 Q-5 -6 -2 -6.5" strokeWidth="0.5" opacity="0.6" />
            <path d="M4 -2 Q7 -10 0 -11" opacity="0.8" />
            <path d="M4 -2 Q5 -6 2 -6.5" strokeWidth="0.5" opacity="0.55" />
            <path d="M12 -1 Q15 -7 8 -8" />
            <path d="M12 -1 Q13 -4.5 10 -5" strokeWidth="0.5" opacity="0.6" />
            <circle cx="0" cy="0" r="1.4" fill={stroke} stroke="none" />
          </g>
          <line x1="122" y1="15" x2="200" y2="15" stroke={muted} strokeWidth="0.6" />
        </svg>
      );

    case 'floral-branch':
      return (
        <svg viewBox="0 0 220 36" className="divider-svg" aria-hidden>
          <defs>
            <radialGradient id="dvg-bloom" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.55)" />
              <stop offset="65%" stopColor={stroke} />
              <stop offset="100%" stopColor={stroke} stopOpacity="0.85" />
            </radialGradient>
          </defs>
          <line x1="0" y1="18" x2="78" y2="18" stroke={muted} strokeWidth="0.6" />
          <g transform="translate(110 18)">
            <path d="M-22 0 Q-12 -10 -2 -7" fill="none" stroke={muted} strokeWidth="0.7" strokeLinecap="round" />
            <path d="M22 0 Q12 -10 2 -7" fill="none" stroke={muted} strokeWidth="0.7" strokeLinecap="round" />
            <path d="M-18 5 Q-10 12 -4 9" fill="none" stroke={muted} strokeWidth="0.5" opacity="0.7" strokeLinecap="round" />
            <path d="M18 5 Q10 12 4 9" fill="none" stroke={muted} strokeWidth="0.5" opacity="0.7" strokeLinecap="round" />
            <circle cx="-12" cy="-3" r="2.2" fill={stroke} opacity="0.85" />
            <circle cx="12" cy="-3" r="2.2" fill={stroke} opacity="0.85" />
            <circle cx="-7" cy="6" r="1.7" fill={stroke} opacity="0.7" />
            <circle cx="7" cy="6" r="1.7" fill={stroke} opacity="0.7" />
            <circle cx="0" cy="0" r="3.6" fill="url(#dvg-bloom)" />
          </g>
          <line x1="142" y1="18" x2="220" y2="18" stroke={muted} strokeWidth="0.6" />
        </svg>
      );

    case 'hanji-line':
      return (
        <svg viewBox="0 0 220 22" className="divider-svg" aria-hidden>
          <line x1="0" y1="11" x2="92" y2="11" stroke={muted} strokeWidth="0.7" strokeDasharray="1 3" />
          <g transform="translate(110 11)" fill={stroke}>
            <path d="M-1.4 -8 L1.4 -8 L1.4 -1.4 L8 -1.4 L8 1.4 L1.4 1.4 L1.4 8 L-1.4 8 L-1.4 1.4 L-8 1.4 L-8 -1.4 L-1.4 -1.4 Z" />
            <circle cx="0" cy="0" r="1.2" fill="var(--bg)" />
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

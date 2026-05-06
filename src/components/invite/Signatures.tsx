import { formatKoreanDate } from '../../lib/calendar';
import { parseYouTubeId, youtubeEmbedSrc } from '../../lib/media';
import type { WeddingData } from '../../types';

function SignatureMedia({
  data,
  className,
  loading,
}: {
  data: WeddingData;
  className?: string;
  loading?: 'eager' | 'lazy';
}) {
  if (data.videoHero) {
    const ytId = parseYouTubeId(data.videoHero);
    if (ytId) {
      return (
        <iframe
          className={className}
          src={youtubeEmbedSrc(ytId)}
          title="hero video"
          frameBorder={0}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      );
    }
    return (
      <video
        className={className}
        src={data.videoHero}
        poster={data.hero || undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }
  if (!data.hero) return null;
  return <img className={className} src={data.hero} alt="" loading={loading} />;
}

/* Letterpress Card (original-warm) */
export function WarmLetterpress({ data }: { data: WeddingData }) {
  const [y, m, d] = data.wedding.date.split('-');
  return (
    <section className="hero hero--letterpress">
      <div className="letterpress-card">
        <p className="letterpress-label">Wedding Invitation</p>
        <div className="letterpress-rule" aria-hidden />
        <h1 className="letterpress-names">
          <span>{data.groom.name}</span>
          <em>&amp;</em>
          <span>{data.bride.name}</span>
        </h1>
        <p className="letterpress-date">{y}.{m}.{d}</p>
        {(data.hero || data.videoHero) && (
          <div className="letterpress-photo">
            <SignatureMedia data={data} loading="eager" />
          </div>
        )}
        <p className="letterpress-full-date">{formatKoreanDate(data.wedding.date, data.wedding.time)}</p>
        <p className="letterpress-venue">{data.wedding.venue}</p>
      </div>
    </section>
  );
}

/* Gallery Split (modern-minimal) */
export function MinimalSplit({ data }: { data: WeddingData }) {
  const date = data.wedding.date.replace(/-/g, '.');
  return (
    <section className="hero hero--minimal-split">
      <div className="minimal-copy">
        <p className="minimal-index">01</p>
        <h1 className="minimal-names">
          <span>{data.groom.name}</span>
          <span>{data.bride.name}</span>
        </h1>
        <p className="minimal-date">{date}</p>
      </div>
      {(data.hero || data.videoHero) && (
        <div className="minimal-photo">
          <SignatureMedia data={data} loading="eager" />
        </div>
      )}
      <div className="minimal-meta">
        <span>{data.wedding.time}</span>
        <span>{data.wedding.venue}</span>
      </div>
    </section>
  );
}

/* Botanical Vow (nature-green) */
export function GardenVow({ data }: { data: WeddingData }) {
  return (
    <section className="hero hero--garden">
      <div className="garden-wreath" aria-hidden>
        {Array.from({ length: 18 }).map((_, i) => <span key={i} />)}
      </div>
      {(data.hero || data.videoHero) && (
        <div className="garden-photo">
          <SignatureMedia data={data} loading="eager" />
        </div>
      )}
      <div className="garden-copy">
        <p className="garden-label">With our families</p>
        <h1 className="garden-names">
          {data.groom.name} <em>&amp;</em> {data.bride.name}
        </h1>
        <p className="garden-date">{formatKoreanDate(data.wedding.date, data.wedding.time)}</p>
        <p className="garden-venue">{data.wedding.venue}</p>
      </div>
    </section>
  );
}

/* Watercolor Wash (watercolor-soft) */
export function WatercolorWashCard({ data }: { data: WeddingData }) {
  return (
    <section className="hero hero--watercolor-card">
      <div className="watercolor-paper">
        <div className="watercolor-bloom bloom-a" aria-hidden />
        <div className="watercolor-bloom bloom-b" aria-hidden />
        <p className="watercolor-script">Our Wedding Day</p>
        {(data.hero || data.videoHero) && (
          <div className="watercolor-photo">
            <SignatureMedia data={data} loading="eager" />
          </div>
        )}
        <h1 className="watercolor-names">
          {data.groom.name} <em>&amp;</em> {data.bride.name}
        </h1>
        <p className="watercolor-date">{formatKoreanDate(data.wedding.date, data.wedding.time)}</p>
        <p className="watercolor-venue">{data.wedding.venue}</p>
      </div>
    </section>
  );
}

/* ═══ Typography Poster (simple-clean) ═══
 * Photo de-emphasized, headline takes the stage.
 */
export function TypographyPoster({ data }: { data: WeddingData }) {
  const [y, m, d] = data.wedding.date.split('-');
  return (
    <section className="hero hero--poster">
      <div className="poster-stage">
        <p className="poster-eyebrow">— {y}.{m}.{d} —</p>
        <div className="poster-stack">
          <span>{data.groom.name}</span>
          <span className="poster-amp">&amp;</span>
          <span>{data.bride.name}</span>
        </div>
        <p className="poster-tag">결혼합니다</p>
        {(data.hero || data.videoHero) && (
          <div className="poster-photo">
            <SignatureMedia data={data} />
          </div>
        )}
        <p className="poster-bottom">{formatKoreanDate(data.wedding.date, data.wedding.time)}</p>
        <p className="poster-venue">{data.wedding.venue}</p>
      </div>
    </section>
  );
}

/* ═══ Polaroid Scatter (vintage-film) ═══
 * 3 tilted polaroid photos with handwritten dates.
 */
export function PolaroidScatter({ data }: { data: WeddingData }) {
  const photos = [data.hero, ...data.gallery].filter(Boolean).slice(0, 3);
  while (photos.length < 3) photos.push(data.hero || '');
  const [y, m, d] = data.wedding.date.split('-');
  return (
    <section className="hero hero--polaroid">
      <p className="polaroid-eyebrow">A Memory From</p>
      <div className="polaroid-deck">
        {photos.map((src, i) => (
          <div key={i} className={`polaroid polaroid-${i}`}>
            {src && <img src={src} alt="" />}
            <span className="polaroid-caption">{i === 1 ? `${y}. ${m}` : i === 2 ? `${m}. ${d}` : `${data.groom.name} & ${data.bride.name}`}</span>
          </div>
        ))}
      </div>
      <h1 className="polaroid-names">
        {data.groom.name} <em>&amp;</em> {data.bride.name}
      </h1>
      <p className="polaroid-date">{formatKoreanDate(data.wedding.date, data.wedding.time)}</p>
      <p className="polaroid-venue">{data.wedding.venue}</p>
    </section>
  );
}

/* ═══ Monogram (classic-elegant) ═══
 * Initials interlocked in a circle — actual greeting card feel.
 */
export function Monogram({ data }: { data: WeddingData }) {
  const g = data.groom.name.charAt(0) || 'G';
  const b = data.bride.name.charAt(0) || 'B';
  return (
    <section className="hero hero--monogram">
      {(data.hero || data.videoHero) && (
        <div className="monogram-photo">
          <SignatureMedia data={data} />
          <div className="monogram-overlay" />
        </div>
      )}
      <div className="monogram-card">
        <p className="monogram-eyebrow">The Wedding of</p>
        <div className="monogram-circle" aria-hidden>
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            <circle cx="100" cy="100" r="76" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <text x="78" y="118" textAnchor="middle" fontFamily="var(--font-display)" fontSize="84" fontWeight="400">{g}</text>
            <text x="100" y="118" textAnchor="middle" fontFamily="var(--font-script, var(--font-display))" fontSize="56" fontStyle="italic" opacity="0.7">&amp;</text>
            <text x="122" y="118" textAnchor="middle" fontFamily="var(--font-display)" fontSize="84" fontWeight="400">{b}</text>
          </svg>
        </div>
        <h1 className="monogram-names">
          {data.groom.name} <em>&amp;</em> {data.bride.name}
        </h1>
        <p className="monogram-date">{formatKoreanDate(data.wedding.date, data.wedding.time)}</p>
        <p className="monogram-venue">{data.wedding.venue}{data.wedding.venueDetail ? ` · ${data.wedding.venueDetail}` : ''}</p>
      </div>
    </section>
  );
}

/* ═══ Floral Arch (romantic-flower) ═══
 * SVG floral arch surrounding the names.
 */
export function FloralArch({ data }: { data: WeddingData }) {
  return (
    <section className="hero hero--arch">
      {(data.hero || data.videoHero) && (
        <div className="arch-photo">
          <SignatureMedia data={data} />
        </div>
      )}
      <div className="arch-shell">
        <svg className="arch-svg" viewBox="0 0 320 220" aria-hidden>
          <defs>
            <linearGradient id="archStroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.85" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path d="M40 200 Q40 30 160 30 T280 200" fill="none" stroke="url(#archStroke)" strokeWidth="1" />
          {/* small rose blooms */}
          {[
            [60, 60], [70, 92], [50, 130], [88, 50], [108, 38],
            [212, 38], [232, 50], [270, 60], [260, 92], [280, 130],
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r="6" fill="currentColor" opacity="0.85" />
              <circle r="3" fill="#fff" opacity="0.45" cx="-1.5" cy="-1.5" />
              <ellipse cx="-9" cy="2" rx="5" ry="2.5" fill="currentColor" opacity="0.55" transform="rotate(-30)" />
              <ellipse cx="9" cy="2" rx="5" ry="2.5" fill="currentColor" opacity="0.55" transform="rotate(30)" />
            </g>
          ))}
          {/* leaves */}
          {[[80, 110, -25], [240, 110, 25], [148, 28, 0]].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx="14" ry="5" fill="currentColor" opacity="0.4" transform={`rotate(${r} ${x} ${y})`} />
          ))}
        </svg>
        <p className="arch-script">The Wedding</p>
        <h1 className="arch-names">
          {data.groom.name} <em>&amp;</em> {data.bride.name}
        </h1>
        <p className="arch-date">{formatKoreanDate(data.wedding.date, data.wedding.time)}</p>
        <p className="arch-venue">{data.wedding.venue}</p>
      </div>
    </section>
  );
}

/* ═══ Constellation (midnight-navy) ═══
 * SVG dots connected as a heart with names below.
 */
export function Constellation({ data }: { data: WeddingData }) {
  // Heart-shaped point set
  const pts: Array<[number, number]> = [
    [160, 60], [130, 40], [100, 50], [80, 75], [80, 105],
    [130, 145], [160, 175], [190, 145], [240, 105], [240, 75],
    [220, 50], [190, 40],
  ];
  return (
    <section className="hero hero--constellation">
      {(data.hero || data.videoHero) && (
        <div className="const-photo">
          <SignatureMedia data={data} />
        </div>
      )}
      <div className="const-shell">
        <svg className="const-svg" viewBox="0 0 320 220" aria-hidden>
          <path
            d={`M ${pts.map((p) => p.join(' ')).join(' L ')} Z`}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.5"
            strokeWidth="0.7"
            strokeDasharray="2 4"
          />
          {pts.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="2.4" fill="currentColor" />
              <circle cx={x} cy={y} r="6" fill="currentColor" opacity="0.18" />
            </g>
          ))}
          <circle cx="160" cy="100" r="3.5" fill="currentColor" />
          <circle cx="160" cy="100" r="10" fill="currentColor" opacity="0.18" />
        </svg>
        <p className="const-eyebrow">Under The Stars</p>
        <h1 className="const-names">
          {data.groom.name} <em>&amp;</em> {data.bride.name}
        </h1>
        <p className="const-date">{formatKoreanDate(data.wedding.date, data.wedding.time)}</p>
        <p className="const-venue">{data.wedding.venue}</p>
      </div>
    </section>
  );
}

/* ═══ Hanji Envelope (korean-traditional) ═══
 * Folded paper envelope with seal stamp.
 */
export function HanjiEnvelope({ data }: { data: WeddingData }) {
  return (
    <section className="hero hero--hanji">
      <div className="hanji-paper">
        <div className="hanji-seal" aria-hidden>
          <span>請</span>
        </div>
        <p className="hanji-title">청 첩 장</p>
        <p className="hanji-han">請 牒 狀</p>
        {(data.hero || data.videoHero) && (
          <div className="hanji-photo">
            <SignatureMedia data={data} />
          </div>
        )}
        <h1 className="hanji-names">
          <span>{data.groom.name.split('').join(' ')}</span>
          <span className="hanji-amp">·</span>
          <span>{data.bride.name.split('').join(' ')}</span>
        </h1>
        <div className="hanji-rule" />
        <p className="hanji-date">{formatKoreanDate(data.wedding.date, data.wedding.time)}</p>
        <p className="hanji-venue">
          {data.wedding.venue}
          {data.wedding.venueDetail ? ` ${data.wedding.venueDetail}` : ''}
        </p>
        <p className="hanji-parents-row">
          <span>{(data.groom.fatherDeceased ? '故 ' : '') + data.groom.father} · {(data.groom.motherDeceased ? '故 ' : '') + data.groom.mother}</span>
          <span className="dot">|</span>
          <span>{(data.bride.fatherDeceased ? '故 ' : '') + data.bride.father} · {(data.bride.motherDeceased ? '故 ' : '') + data.bride.mother}</span>
        </p>
      </div>
    </section>
  );
}

/* ═══ Sticker Pack (pastel-dream) ═══
 * Cute stickers scattered around the hero.
 */
export function StickerPack({ data }: { data: WeddingData }) {
  return (
    <section className="hero hero--stickers">
      <div className="sticker s-ring" aria-hidden>💍</div>
      <div className="sticker s-heart" aria-hidden>💕</div>
      <div className="sticker s-flower" aria-hidden>🌷</div>
      <div className="sticker s-balloon" aria-hidden>🎈</div>
      <div className="sticker s-cake" aria-hidden>🎂</div>
      <div className="sticker-shell">
        <p className="sticker-eyebrow">We're Getting Married!</p>
        {(data.hero || data.videoHero) && (
          <div className="sticker-photo">
            <SignatureMedia data={data} />
          </div>
        )}
        <h1 className="sticker-names">
          {data.groom.name} <em>&amp;</em> {data.bride.name}
        </h1>
        <p className="sticker-date">{formatKoreanDate(data.wedding.date, data.wedding.time)}</p>
        <p className="sticker-venue">{data.wedding.venue}</p>
      </div>
    </section>
  );
}

/* ═══ Cinematic Letterbox (luxury-gold) ═══
 * Black letterbox bars with gold typography. Video-ready.
 */
export function CinematicLetterbox({ data }: { data: WeddingData }) {
  return (
    <section className="hero hero--cinema">
      <div className="cinema-bars-top" aria-hidden />
      <div className="cinema-stage">
        <SignatureMedia data={data} className="cinema-media" loading="eager" />
        <div className="cinema-overlay" />
        <div className="cinema-text">
          <p className="cinema-presents">— Presents —</p>
          <h1 className="cinema-names">
            {data.groom.name} <em>&amp;</em> {data.bride.name}
          </h1>
          <p className="cinema-tag">A Wedding Story</p>
          <p className="cinema-date">{formatKoreanDate(data.wedding.date, data.wedding.time)}</p>
          <p className="cinema-venue">{data.wedding.venue}</p>
        </div>
      </div>
      <div className="cinema-bars-bot" aria-hidden />
    </section>
  );
}

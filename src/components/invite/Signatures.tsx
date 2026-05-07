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
  const sourcePhotos = [data.hero, ...data.gallery].filter(Boolean);
  const photos: string[] = sourcePhotos.slice(0, 3);
  // Pad with placeholder slots when the user supplied fewer than 3 photos.
  while (photos.length < 3) photos.push('');
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

/* ═══════════════════════════════════════════
   Storybook Spread (romantic-flower → 동화책)
   Hand-drawn floral wreath, page-corner curl,
   "Once Upon a Wedding" handwriting title.
   ═══════════════════════════════════════════ */
export function StorybookSpread({ data }: { data: WeddingData }) {
  return (
    <section className="hero hero--storybook">
      <div className="storybook-spine" aria-hidden />
      <div className="storybook-page">
        <svg className="storybook-wreath" viewBox="0 0 320 120" aria-hidden>
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="M40 80 Q100 30 160 50 T280 80" strokeWidth="0.9" opacity="0.55" />
            <path d="M55 70 Q60 45 80 38" strokeWidth="0.7" opacity="0.5" />
            <path d="M260 70 Q255 45 235 38" strokeWidth="0.7" opacity="0.5" />
          </g>
          {[
            [60, 60], [78, 38], [102, 30], [130, 38],
            [190, 38], [218, 30], [242, 38], [260, 60],
            [160, 50],
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r="6.5" fill="currentColor" opacity="0.9" />
              <circle r="3.2" fill="#fff9ee" opacity="0.7" cx="-1.5" cy="-1.2" />
              <ellipse cx="-9" cy="3" rx="5.2" ry="2.6" fill="currentColor" opacity="0.4" transform="rotate(-25)" />
              <ellipse cx="9" cy="3" rx="5.2" ry="2.6" fill="currentColor" opacity="0.4" transform="rotate(25)" />
            </g>
          ))}
          {[[35, 88, -35], [285, 88, 35], [105, 86, -10], [215, 86, 10]].map(([x, y, r], i) => (
            <g key={`leaf${i}`} transform={`translate(${x} ${y}) rotate(${r})`}>
              <path d="M0 0 Q-10 -6 0 -16 Q10 -6 0 0" fill="currentColor" opacity="0.45" />
              <line x1="0" y1="0" x2="0" y2="-16" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
            </g>
          ))}
        </svg>

        <p className="storybook-once">Once Upon a Wedding</p>

        <div className="storybook-illustration">
          <SignatureMedia data={data} loading="eager" />
          <div className="storybook-vignette" aria-hidden />
        </div>

        <p className="storybook-chapter">Chapter One · 우리의 날</p>
        <h1 className="storybook-names">
          <span>{data.groom.name}</span>
          <em>&amp;</em>
          <span>{data.bride.name}</span>
        </h1>
        <svg className="storybook-flourish" viewBox="0 0 200 16" aria-hidden>
          <path d="M10 8 Q50 0 100 8 T190 8" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
        </svg>
        <p className="storybook-date">{formatKoreanDate(data.wedding.date, data.wedding.time)}</p>
        <p className="storybook-venue">{data.wedding.venue}</p>
      </div>
      <div className="storybook-corner" aria-hidden />
    </section>
  );
}

/* ═══════════════════════════════════════════
   Boarding Pass (nature-green → 여행 항공권)
   Mono type, perforation, vintage stamps,
   tear-off stub with mock barcode.
   ═══════════════════════════════════════════ */
export function BoardingPass({ data }: { data: WeddingData }) {
  const [y, m, d] = data.wedding.date.split('-');
  const flightCode = `WA-${m}${d}`;
  const seat = `${y.slice(2)}${m}${d}`;
  return (
    <section className="hero hero--boardingpass">
      <div className="bp-card">
        <header className="bp-head">
          <span className="bp-airline">★ WEDDING AIRWAYS</span>
          <span className="bp-class">FIRST CLASS</span>
        </header>

        <div className="bp-body">
          <div className="bp-main">
            <div className="bp-route">
              <div className="bp-route-col">
                <span className="bp-tag">FROM</span>
                <span className="bp-code">SNG</span>
                <span className="bp-place">싱글 라이프</span>
              </div>
              <span className="bp-plane" aria-hidden>✈</span>
              <div className="bp-route-col">
                <span className="bp-tag">TO</span>
                <span className="bp-code">MRR</span>
                <span className="bp-place">결혼 생활</span>
              </div>
            </div>

            <div className="bp-pax">
              <span className="bp-tag">PASSENGERS</span>
              <span className="bp-pax-names">
                {data.groom.name.toUpperCase()} / {data.bride.name.toUpperCase()}
              </span>
            </div>

            <dl className="bp-rows">
              <div><dt>DATE</dt><dd>{y}.{m}.{d}</dd></div>
              <div><dt>TIME</dt><dd>{data.wedding.time}</dd></div>
              <div><dt>FLIGHT</dt><dd>{flightCode}</dd></div>
              <div><dt>GATE</dt><dd>{data.wedding.venueDetail || 'A1'}</dd></div>
            </dl>

            <p className="bp-venue">
              VENUE · {data.wedding.venue}
            </p>

            {(data.hero || data.videoHero) && (
              <div className="bp-window">
                <SignatureMedia data={data} loading="eager" />
              </div>
            )}

            <div className="bp-stamp" aria-hidden>
              <span>{y}</span>
              <strong>BOARDING</strong>
              <span>{m}.{d}</span>
            </div>
          </div>

          <div className="bp-perf" aria-hidden>
            {Array.from({ length: 14 }).map((_, i) => <span key={i} />)}
          </div>

          <div className="bp-stub">
            <span className="bp-tag">SEAT</span>
            <span className="bp-stub-seat">{seat}</span>
            <span className="bp-tag">FLIGHT</span>
            <span className="bp-stub-flight">{flightCode}</span>
            <div className="bp-bars" aria-hidden>
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} style={{ width: `${1 + ((i * 7) % 4)}px` }} />
              ))}
            </div>
            <span className="bp-stub-foot">★ ★ ★</span>
          </div>
        </div>

        <footer className="bp-foot">
          ◆ PLEASE BOARD 30 MIN BEFORE DEPARTURE ◆
        </footer>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   Handwritten Letter (watercolor-soft → 손편지)
   Wax seal, lined paper, cursive title,
   folded-corner shadow.
   ═══════════════════════════════════════════ */
export function HandwrittenLetter({ data }: { data: WeddingData }) {
  const initial = (data.groom.name.charAt(0) + data.bride.name.charAt(0)) || 'GB';
  return (
    <section className="hero hero--letter">
      <div className="letter-paper">
        <div className="letter-seal" aria-hidden>
          <svg viewBox="0 0 60 60">
            <defs>
              <radialGradient id="sealGrad" cx="35%" cy="32%" r="65%">
                <stop offset="0%" stopColor="#c45e5e" />
                <stop offset="55%" stopColor="#7a3f3f" />
                <stop offset="100%" stopColor="#4a2424" />
              </radialGradient>
            </defs>
            <circle cx="30" cy="30" r="26" fill="url(#sealGrad)" />
            <circle cx="30" cy="30" r="22" fill="none" stroke="#fbe4d2" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.7" />
            <text x="30" y="35.5" textAnchor="middle" fill="#fbe4d2" fontFamily="'Cormorant Garamond', serif" fontSize="18" fontWeight="600">{initial}</text>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return (
                <circle
                  key={i}
                  cx={30 + Math.cos(a) * 27}
                  cy={30 + Math.sin(a) * 27}
                  r="1.6"
                  fill="#7a3f3f"
                />
              );
            })}
          </svg>
        </div>

        <p className="letter-script">사랑하는 분께,</p>

        <p className="letter-body">
          오늘 이 편지는 한 가지 소식을 전하기 위함입니다.
          서로를 향한 마음이 깊어져, 두 사람이 부부가 되기로
          하였습니다. 마음을 함께 나누어 주신다면,
          저희에게 큰 위로와 기쁨이 될 것입니다.
        </p>

        <div className="letter-couple">
          <span className="letter-amp">— 이만 줄이며 —</span>
          <h1 className="letter-names">
            {data.groom.name} <em>&amp;</em> {data.bride.name}
          </h1>
          <p className="letter-date-script">{formatKoreanDate(data.wedding.date, data.wedding.time)}</p>
          <p className="letter-venue">{data.wedding.venue}</p>
        </div>

        {(data.hero || data.videoHero) && (
          <div className="letter-photo">
            <SignatureMedia data={data} loading="eager" />
            <span className="letter-photo-tape" aria-hidden />
          </div>
        )}

        <div className="letter-fold" aria-hidden />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   Scrapbook Diary (pastel-dream → 다이어리)
   Washi tape, taped polaroid, doodles,
   handwritten margins.
   ═══════════════════════════════════════════ */
export function ScrapbookDiary({ data }: { data: WeddingData }) {
  const [y, m, d] = data.wedding.date.split('-');
  return (
    <section className="hero hero--scrapbook">
      <div className="sb-page">
        <span className="sb-tape sb-tape-1" aria-hidden />
        <span className="sb-tape sb-tape-2" aria-hidden />
        <span className="sb-tape sb-tape-3" aria-hidden />

        <div className="sb-date-stamp" aria-hidden>
          <span className="sb-date-label">DATE</span>
          <span className="sb-date-num">{y}.{m}.{d}</span>
        </div>

        <p className="sb-title">Today is Our Day!</p>

        {(data.hero || data.videoHero) && (
          <div className="sb-polaroid">
            <span className="sb-poly-tape" aria-hidden />
            <div className="sb-poly-photo">
              <SignatureMedia data={data} loading="eager" />
            </div>
            <span className="sb-poly-caption">{m}월 {d}일, 사랑해.</span>
          </div>
        )}

        <h1 className="sb-names">
          <span>{data.groom.name}</span>
          <span className="sb-amp">+</span>
          <span>{data.bride.name}</span>
        </h1>
        <svg className="sb-underline" viewBox="0 0 200 12" aria-hidden>
          <path
            d="M5 6 Q25 1 50 6 T100 6 T150 6 T195 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <p className="sb-meta">
          <span className="sb-meta-row">📍 {data.wedding.venue}</span>
          <span className="sb-meta-row">🕐 {data.wedding.time}</span>
        </p>

        <svg className="sb-doodle sb-doodle-heart" viewBox="0 0 40 36" aria-hidden>
          <path
            d="M20 30 C5 18 5 6 13 6 C17 6 19 9 20 12 C21 9 23 6 27 6 C35 6 35 18 20 30 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        <svg className="sb-doodle sb-doodle-spark" viewBox="0 0 30 30" aria-hidden>
          <path d="M15 2 L17 13 L28 15 L17 17 L15 28 L13 17 L2 15 L13 13 Z" fill="currentColor" opacity="0.85" />
        </svg>
        <svg className="sb-doodle sb-doodle-arrow" viewBox="0 0 60 24" aria-hidden>
          <path d="M2 12 Q20 4 40 12 L36 8 M40 12 L36 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <p className="sb-margin-note">— 우리만의 작은 이야기가 시작되는 날 —</p>
      </div>
    </section>
  );
}

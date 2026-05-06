import type { WeddingData } from '../../types';
import { THEME_MAP } from '../../data/themes';
import { formatKoreanDate } from '../../lib/calendar';
import { Countdown } from './Countdown';
import { CalendarButtons } from './CalendarButtons';
import { Divider } from './Divider';
import { DancheongCorners } from './Ornaments';
import { parseYouTubeId, youtubeEmbedSrc } from '../../lib/media';
import {
  TypographyPoster,
  WarmLetterpress,
  MinimalSplit,
  PolaroidScatter,
  Monogram,
  FloralArch,
  GardenVow,
  WatercolorWashCard,
  Constellation,
  HanjiEnvelope,
  StickerPack,
  CinematicLetterbox,
} from './Signatures';

interface Props {
  data: WeddingData;
}

function HeroMedia({
  data,
  className,
  loading,
}: Props & {
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

function ParentLine({
  father,
  mother,
  fatherDeceased,
  motherDeceased,
  childRole,
  child,
}: {
  father: string;
  mother: string;
  fatherDeceased?: boolean;
  motherDeceased?: boolean;
  childRole: string;
  child: string;
}) {
  const f = (fatherDeceased ? '故 ' : '') + father;
  const m = (motherDeceased ? '故 ' : '') + mother;
  return (
    <div className="parent-line">
      <div className="parents">{f} · {m}</div>
      <div className="child">
        <span className="role">{childRole}</span>
        <strong>{child}</strong>
      </div>
    </div>
  );
}

function ParentBlock({ data }: Props) {
  return (
    <div className="hero-parents">
      <ParentLine
        father={data.groom.father}
        mother={data.groom.mother}
        fatherDeceased={data.groom.fatherDeceased}
        motherDeceased={data.groom.motherDeceased}
        childRole="아들"
        child={data.groom.name}
      />
      <div className="parents-divider" aria-hidden />
      <ParentLine
        father={data.bride.father}
        mother={data.bride.mother}
        fatherDeceased={data.bride.fatherDeceased}
        motherDeceased={data.bride.motherDeceased}
        childRole="딸"
        child={data.bride.name}
      />
    </div>
  );
}

function HeroOverlay({ data }: Props) {
  const theme = THEME_MAP[data.theme];
  return (
    <section className="hero hero--overlay" data-treatment={theme.photoTreatment}>
      {(data.hero || data.videoHero) && (
        <div className="hero-bg">
          <HeroMedia data={data} loading="eager" />
          <div className="hero-vignette" aria-hidden />
          <div className="hero-overlay-tint" aria-hidden />
        </div>
      )}
      <div className="hero-overlay-content">
        {theme.fonts.script && <p className="hero-script">The Wedding</p>}
        <p className="hero-label">{data.wedding.date.replace(/-/g, '. ')}</p>
        <h1 className="hero-names hero-names--overlay">
          <span>{data.groom.name}</span>
          <span className="amp">&amp;</span>
          <span>{data.bride.name}</span>
        </h1>
        <Divider kind={theme.divider} inverted />
        <p className="hero-date">{formatKoreanDate(data.wedding.date, data.wedding.time)}</p>
        {data.wedding.venue && (
          <p className="hero-venue">
            {data.wedding.venue}
            {data.wedding.venueDetail ? ` · ${data.wedding.venueDetail}` : ''}
          </p>
        )}
        <div className="hero-scroll" aria-hidden><span /></div>
      </div>
    </section>
  );
}

function HeroFramed({ data }: Props) {
  const theme = THEME_MAP[data.theme];
  return (
    <section className="hero hero--framed">
      {theme.ornament === 'dancheong' && <DancheongCorners />}
      <div className="hero-framed-inner">
        <p className="hero-label">
          {theme.id === 'korean-traditional' ? '청 첩 장' : 'Wedding Invitation'}
        </p>
        <div className="framed-photo" data-treatment={theme.photoTreatment}>
          <HeroMedia data={data} />
          <div className="frame-corners" aria-hidden>
            <span /><span /><span /><span />
          </div>
        </div>
        {theme.fonts.script && (
          <p className="hero-script-large">{data.groom.name} &amp; {data.bride.name}</p>
        )}
        <h1 className="hero-names">
          {data.groom.name} <span className="amp">&amp;</span> {data.bride.name}
        </h1>
        <Divider kind={theme.divider} />
        <p className="hero-date">{formatKoreanDate(data.wedding.date, data.wedding.time)}</p>
        {data.wedding.venue && (
          <p className="hero-venue">
            {data.wedding.venue}
            {data.wedding.venueDetail ? ` · ${data.wedding.venueDetail}` : ''}
          </p>
        )}
        <ParentBlock data={data} />
      </div>
    </section>
  );
}

function HeroStacked({ data }: Props) {
  const theme = THEME_MAP[data.theme];
  return (
    <section className="hero hero--stacked">
      {(data.hero || data.videoHero) && (
        <div className="stacked-photo" data-treatment={theme.photoTreatment}>
          <HeroMedia data={data} loading="eager" />
        </div>
      )}
      <div className="hero-text">
        <p className="hero-label">Wedding Invitation</p>
        <h1 className="hero-names">
          {data.groom.name} <span className="amp">&amp;</span> {data.bride.name}
        </h1>
        <Divider kind={theme.divider} />
        <p className="hero-date">{formatKoreanDate(data.wedding.date, data.wedding.time)}</p>
        <ParentBlock data={data} />
        {data.wedding.venue && (
          <p className="hero-venue">
            {data.wedding.venue}
            {data.wedding.venueDetail ? ` · ${data.wedding.venueDetail}` : ''}
          </p>
        )}
      </div>
    </section>
  );
}

export function Hero({ data }: Props) {
  // Theme-specific signature dispatch — distinct structural identity per theme
  switch (data.theme) {
    case 'original-warm':
      return (
        <>
          <WarmLetterpress data={data} />
          <section className="invite-section section-couple">
            <ParentBlock data={data} />
          </section>
          <section className="invite-section section-cd">
            <Countdown date={data.wedding.date} time={data.wedding.time} />
            <CalendarButtons data={data} />
          </section>
        </>
      );

    case 'simple-clean':
      return (
        <>
          <TypographyPoster data={data} />
          <section className="invite-section section-cd">
            <Countdown date={data.wedding.date} time={data.wedding.time} />
            <CalendarButtons data={data} />
          </section>
          <section className="invite-section section-couple">
            <ParentBlock data={data} />
          </section>
        </>
      );

    case 'modern-minimal':
      return (
        <>
          <MinimalSplit data={data} />
          <section className="invite-section section-couple">
            <ParentBlock data={data} />
          </section>
          <section className="invite-section section-cd">
            <Countdown date={data.wedding.date} time={data.wedding.time} />
            <CalendarButtons data={data} />
          </section>
        </>
      );

    case 'vintage-film':
      return (
        <>
          <PolaroidScatter data={data} />
          <section className="invite-section section-couple">
            <ParentBlock data={data} />
          </section>
          <section className="invite-section section-cd">
            <Countdown date={data.wedding.date} time={data.wedding.time} />
            <CalendarButtons data={data} />
          </section>
        </>
      );

    case 'nature-green':
      return (
        <>
          <GardenVow data={data} />
          <section className="invite-section section-couple">
            <ParentBlock data={data} />
          </section>
          <section className="invite-section section-cd">
            <Countdown date={data.wedding.date} time={data.wedding.time} />
            <CalendarButtons data={data} />
          </section>
        </>
      );

    case 'classic-elegant':
      return (
        <>
          <Monogram data={data} />
          <section className="invite-section section-couple">
            <ParentBlock data={data} />
          </section>
          <section className="invite-section section-cd">
            <Countdown date={data.wedding.date} time={data.wedding.time} />
            <CalendarButtons data={data} />
          </section>
        </>
      );

    case 'watercolor-soft':
      return (
        <>
          <WatercolorWashCard data={data} />
          <section className="invite-section section-couple">
            <ParentBlock data={data} />
          </section>
          <section className="invite-section section-cd">
            <Countdown date={data.wedding.date} time={data.wedding.time} />
            <CalendarButtons data={data} />
          </section>
        </>
      );

    case 'romantic-flower':
      return (
        <>
          <FloralArch data={data} />
          <section className="invite-section section-couple">
            <ParentBlock data={data} />
          </section>
          <section className="invite-section section-cd">
            <Countdown date={data.wedding.date} time={data.wedding.time} />
            <CalendarButtons data={data} />
          </section>
        </>
      );

    case 'midnight-navy':
      return (
        <>
          <Constellation data={data} />
          <section className="invite-section section-couple">
            <ParentBlock data={data} />
          </section>
          <section className="invite-section section-cd">
            <Countdown date={data.wedding.date} time={data.wedding.time} />
            <CalendarButtons data={data} />
          </section>
        </>
      );

    case 'korean-traditional':
      return (
        <>
          <HanjiEnvelope data={data} />
          <section className="invite-section section-cd">
            <Countdown date={data.wedding.date} time={data.wedding.time} />
            <CalendarButtons data={data} />
          </section>
        </>
      );

    case 'pastel-dream':
      return (
        <>
          <StickerPack data={data} />
          <section className="invite-section section-couple">
            <ParentBlock data={data} />
          </section>
          <section className="invite-section section-cd">
            <Countdown date={data.wedding.date} time={data.wedding.time} />
            <CalendarButtons data={data} />
          </section>
        </>
      );

    case 'luxury-gold':
      return (
        <>
          <CinematicLetterbox data={data} />
          <section className="invite-section section-couple">
            <ParentBlock data={data} />
          </section>
          <section className="invite-section section-cd">
            <Countdown date={data.wedding.date} time={data.wedding.time} />
            <CalendarButtons data={data} />
          </section>
        </>
      );

    default: {
      // Runtime fallback for malformed decoded data.
      const theme = THEME_MAP['original-warm'];
      let inner;
      if (theme.layout === 'overlay') inner = <HeroOverlay data={data} />;
      else if (theme.layout === 'framed') inner = <HeroFramed data={data} />;
      else inner = <HeroStacked data={data} />;
      return (
        <>
          {inner}
          {theme.layout === 'overlay' && (
            <section className="invite-section section-couple">
              <ParentBlock data={data} />
            </section>
          )}
          <section className="invite-section section-cd">
            <Countdown date={data.wedding.date} time={data.wedding.time} />
            <CalendarButtons data={data} />
          </section>
        </>
      );
    }
  }
}

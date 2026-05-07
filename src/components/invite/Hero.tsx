import type { WeddingData } from '../../types';
import { Countdown } from './Countdown';
import { CalendarButtons } from './CalendarButtons';
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

    default:
      // Runtime fallback for malformed decoded data — render the warm signature.
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
  }
}

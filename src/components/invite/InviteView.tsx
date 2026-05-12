import { useEffect, useMemo } from 'react';
import type { WeddingData } from '../../types';
import { THEME_MAP, loadThemeFonts } from '../../data/themes';
import { Toast } from './Toast';
import { Curtain } from './Curtain';
import { Hero } from './Hero';
import { Greeting } from './Greeting';
import { Story } from './Story';
import { Gallery } from './Gallery';
import { Location } from './Location';
import { Accounts } from './Accounts';
import { Guestbook } from './Guestbook';
import { Rsvp } from './Rsvp';
import { BgmToggle } from './BgmToggle';
import { ShareBar } from './ShareBar';
import { OrnamentCanvas } from './Ornaments';
import { Divider } from './Divider';
import { CalendarWidget } from './CalendarWidget';
import { CalendarButtons } from './CalendarButtons';
import { Timeline } from './Timeline';
import { ShuttleBus } from './ShuttleBus';
import { LikeButton } from './LikeButton';
import { LifeEvents } from './LifeEvents';
import { SaveTheDate } from './SaveTheDate';
import { Interview } from './Interview';
import { DressCode } from './DressCode';
import { BrideGroomNotes } from './BrideGroomNotes';
import { useFadeUpObserver } from '../../lib/intersect';

interface Props {
  data: WeddingData;
  inviteId: string;
  shareUrl: string;
  isPreview?: boolean;
}

export function InviteView({ data, inviteId, shareUrl, isPreview = false }: Props) {
  const theme = THEME_MAP[data.theme] || THEME_MAP['original-warm'];

  useFadeUpObserver([
    data.theme,
    isPreview,
    data.story.enabled,
    data.gallery.length,
    data.shuttle.enabled,
    data.timeline.enabled && data.timeline.items.length,
    data.rsvp.enabled,
    data.guestbook.enabled,
    data.likes.enabled,
    data.interview?.enabled,
    data.dressCode?.enabled,
    data.notes?.enabled,
  ]);

  useEffect(() => {
    if (isPreview) return;
    loadThemeFonts(theme);
    const prevTitle = document.title;
    document.title = data.meta.title || `${data.groom.name} ♥ ${data.bride.name} 결혼합니다`;

    // Update Open Graph + meta description so link previews show couple-specific copy.
    function setMeta(selector: string, attr: 'content', value: string) {
      const el = document.querySelector(selector) as HTMLMetaElement | null;
      if (el) el.setAttribute(attr, value);
    }
    const desc = data.meta.description ||
      `${data.wedding.date.replace(/-/g, '.')} · ${data.wedding.venue}`;
    setMeta('meta[name="description"]', 'content', desc);
    setMeta('meta[property="og:title"]', 'content', document.title);
    setMeta('meta[property="og:description"]', 'content', desc);

    const ogImageUrl = data.ogImage || data.hero;
    if (ogImageUrl) {
      setMeta('meta[property="og:image"]', 'content', ogImageUrl);
      setMeta('meta[name="twitter:image"]', 'content', ogImageUrl);
    }
    setMeta('meta[name="twitter:title"]', 'content', document.title);
    setMeta('meta[name="twitter:description"]', 'content', desc);

    return () => { document.title = prevTitle; };
  }, [
    theme,
    data.meta.title,
    data.meta.description,
    data.groom.name,
    data.bride.name,
    data.wedding.date,
    data.wedding.venue,
    data.eventType,
    data.ogImage,
    data.hero,
    theme,
    isPreview,
  ]);

  const styleVars = useMemo(() => {
    return {
      ...theme.vars,
      '--font-display': theme.fonts.display,
      '--font-body': theme.fonts.body,
      '--font-script': theme.fonts.script || theme.fonts.display,
    } as React.CSSProperties;
  }, [theme]);

  const showStory =
    data.story.enabled && (data.story.body.trim() || data.story.photos.length > 0);

  return (
    <div className="invite-root" data-theme={data.theme} data-layout={theme.layout} style={styleVars}>
      <div className="invite-frame">
        {!isPreview && data.useCurtain && (
          <Curtain
            groomName={data.groom.name}
            brideName={data.bride.name}
            date={data.wedding.date}
            heroImage={data.hero}
            ornament={theme.ornament}
            layout={theme.layout}
          />
        )}
        {data.bgm && !isPreview && <BgmToggle src={data.bgm} />}

        {theme.ornament !== 'none' && (
          <div className="ornament-layer" aria-hidden>
            <OrnamentCanvas kind={theme.ornament} />
          </div>
        )}

        <Hero data={data} />

        <section className="invite-section invite-section--tight section-savedate fade-up">
          <p className="section-label">
            {theme.fonts.script ? <em className="script-label">Save the date</em> : 'SAVE THE DATE'}
          </p>
          <Divider kind={theme.divider} />
          <CalendarButtons data={data} />
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <SaveTheDate data={data} />
          </div>
        </section>

        {data.greeting.body.trim() && (
          <div className="fade-up">
            <Greeting
              title={data.greeting.title}
              body={data.greeting.body}
              theme={data.theme}
            />
          </div>
        )}

        {showStory && (
          <div className="fade-up">
            <Story
              title={data.story.title}
              body={data.story.body}
              photos={data.story.photos}
              theme={data.theme}
            />
          </div>
        )}

        {data.gallery.length > 0 && (
          <div className="fade-up">
            <Gallery photos={data.gallery} />
          </div>
        )}

        {data.interview?.enabled && data.interview.items.length > 0 && (
          <div className="fade-up">
            <Interview data={data} />
          </div>
        )}

        {data.notes?.enabled && (data.notes.groom.trim() || data.notes.bride.trim()) && (
          <div className="fade-up">
            <BrideGroomNotes data={data} />
          </div>
        )}

        <section className="invite-section section-calendar fade-up">
          <CalendarWidget date={data.wedding.date} theme={data.theme} />
        </section>

        <div className="fade-up">
          <Location data={data} />
        </div>

        {data.timeline.enabled && data.timeline.items.length > 0 && (
          <div className="fade-up">
            <Timeline
              title={data.timeline.title}
              items={data.timeline.items}
              theme={data.theme}
            />
          </div>
        )}

        {data.shuttle.enabled && data.shuttle.info.trim() && (
          <div className="fade-up">
            <ShuttleBus info={data.shuttle.info} theme={data.theme} />
          </div>
        )}

        {data.dressCode?.enabled && (
          <div className="fade-up">
            <DressCode data={data} />
          </div>
        )}

        <div className="fade-up">
          <Accounts
            groom={data.accounts.groom}
            bride={data.accounts.bride}
            eventType={data.eventType}
          />
        </div>

        {data.rsvp.enabled && (
          <div className="fade-up">
            <Rsvp inviteId={inviteId} deadline={data.rsvp.deadline} />
          </div>
        )}

        {(data.guestbook.enabled || data.likes.enabled) && (
          <div className="fade-up">
            {data.guestbook.enabled && <Guestbook inviteId={inviteId} />}
            {data.likes.enabled && (
              <section className="invite-section invite-section--tight section-likes">
                <LikeButton inviteId={inviteId} />
                <p className="like-caption">신랑 신부에게 응원의 마음을 전해주세요</p>
              </section>
            )}
          </div>
        )}

        {data.lifeEvents?.enabled && data.lifeEvents.items.length > 0 && (
          <div className="fade-up">
            <LifeEvents
              title={data.lifeEvents.title}
              intro={data.lifeEvents.intro}
              items={data.lifeEvents.items}
            />
          </div>
        )}

        {!isPreview && (
          <section className="invite-section invite-section--tight section-share fade-up">
            <p className="section-label">
              {theme.fonts.script ? <em className="script-label">Share</em> : 'SHARE'}
            </p>
            <h2 className="section-heading">초대장 공유하기</h2>
            <Divider kind={theme.divider} />
            <p className="share-intro">소중한 분들에게 청첩장을 전달해보세요</p>
            <ShareBar
              title={data.meta.title}
              description={data.meta.description}
              url={shareUrl}
              imageUrl={data.ogImage || data.hero}
            />
          </section>
        )}

        <footer className="invite-footer">
          <div className="footer-row">
            <span className="footer-line" aria-hidden />
            <span>{data.groom.name}&nbsp;&amp;&nbsp;{data.bride.name}</span>
            <span className="footer-dot">·</span>
            <span>{data.wedding.date.replace(/-/g, '.')}</span>
            <span className="footer-line" aria-hidden />
          </div>
          {!isPreview && (
            <a href="#/privacy" className="footer-link">
              개인정보 처리방침
            </a>
          )}
        </footer>
      </div>
      {!isPreview && <Toast />}
    </div>
  );
}

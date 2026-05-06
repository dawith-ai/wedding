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

interface Props {
  data: WeddingData;
  inviteId: string;
  shareUrl: string;
  isPreview?: boolean;
}

export function InviteView({ data, inviteId, shareUrl, isPreview = false }: Props) {
  const theme = THEME_MAP[data.theme] || THEME_MAP['original-warm'];

  useEffect(() => {
    if (isPreview) return;
    loadThemeFonts(theme);
    const prevTitle = document.title;
    document.title = data.meta.title || `${data.groom.name} ♥ ${data.bride.name} 결혼합니다`;
    return () => { document.title = prevTitle; };
  }, [theme, data.meta.title, data.groom.name, data.bride.name, isPreview]);

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
          />
        )}
        {data.bgm && !isPreview && <BgmToggle src={data.bgm} />}

        {theme.ornament !== 'none' && (
          <div className="ornament-layer" aria-hidden>
            <OrnamentCanvas kind={theme.ornament} />
          </div>
        )}

        <Hero data={data} />

        {data.greeting.body.trim() && (
          <Greeting
            title={data.greeting.title}
            body={data.greeting.body}
            theme={data.theme}
          />
        )}

        {showStory && (
          <Story
            title={data.story.title}
            body={data.story.body}
            photos={data.story.photos}
            theme={data.theme}
          />
        )}

        {data.gallery.length > 0 && <Gallery photos={data.gallery} />}

        <Location data={data} />

        <Accounts groom={data.accounts.groom} bride={data.accounts.bride} />

        {data.rsvp.enabled && (
          <Rsvp inviteId={inviteId} deadline={data.rsvp.deadline} />
        )}
        {data.guestbook.enabled && <Guestbook inviteId={inviteId} />}

        {!isPreview && (
          <section className="invite-section invite-section--tight section-share">
            <p className="section-label">
              {theme.fonts.script ? <em className="script-label">Share</em> : 'SHARE'}
            </p>
            <h2 className="section-heading">초대장 공유하기</h2>
            <Divider kind={theme.divider} />
            <p className="share-intro">소중한 분들에게 청첩장을 전달해보세요</p>
            <ShareBar title={data.meta.title} description={data.meta.description} url={shareUrl} />
          </section>
        )}

        <footer className="invite-footer">
          <span className="footer-line" aria-hidden />
          <span>{data.groom.name} &amp; {data.bride.name}</span>
          <span className="footer-dot">·</span>
          <span>{data.wedding.date.replace(/-/g, '.')}</span>
          <span className="footer-line" aria-hidden />
        </footer>
      </div>
      {!isPreview && <Toast />}
    </div>
  );
}

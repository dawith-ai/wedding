import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Camera,
  Check,
  Heart,
  Layers3,
  MapPin,
  MessageCircleHeart,
  Palette,
  Play,
  Share2,
  Smartphone,
  Sparkles,
  Ticket,
  WandSparkles,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toast } from '../components/invite/Toast';
import { DEFAULT_DATA } from '../data/defaults';
import { EVENT_LABELS, EVENT_LIST, applyEventTemplate } from '../data/events';
import { getThemeGenres, THEME_FILTERS, THEMES, loadThemeFonts } from '../data/themes';
import { buildShareUrl, encodeData } from '../lib/encode';
import { saveDraft } from '../lib/storage';
import { showToast } from '../lib/toast';
import type { BuiltInThemeId, EventType, ThemeId } from '../types';
import { Button } from '../components/ui/Button';

const FEATURED_THEME_IDS: BuiltInThemeId[] = ['kids-doodle', 'vintage-film', 'modern-hanok'];

const FEATURES = [
  { icon: Palette, label: '고르는 건 무드 하나', body: '사진과 문장을 넣기 전에, 두 사람에게 맞는 결부터 고르세요.' },
  { icon: Camera, label: '사진은 크게, 정보는 또렷하게', body: '첫 화면은 장면답게. 날짜·장소·길찾기는 한 번에 읽히게.' },
  { icon: MessageCircleHeart, label: '초대 뒤의 마음까지', body: 'RSVP, 방명록, 식순, 가족의 이야기가 하나의 흐름으로 이어져요.' },
  { icon: Smartphone, label: '링크 하나로 오래', body: '가입 없이 시작하고 카카오톡과 QR로 가볍게 건네요.' },
];

const STEPS = [
  { icon: Ticket, title: '샘플을 고르고', body: '그림책, 영화, 한옥, 미니멀 중 마음에 닿는 장면을 골라요.' },
  { icon: Layers3, title: '두 사람을 채우고', body: '이름·사진·예식 정보만 넣으면 문장과 섹션이 자연스럽게 이어져요.' },
  { icon: Share2, title: '링크를 보내요', body: '완성된 초대장을 카톡, 문자, QR로 보내고 오래 간직해요.' },
];

export function Home() {
  const navigate = useNavigate();
  const [demoUrls, setDemoUrls] = useState<Record<string, string>>({});
  const [mood, setMood] = useState<(typeof THEME_FILTERS)[number]['id']>('all');

  useEffect(() => {
    THEMES.forEach(loadThemeFonts);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const out: Record<string, string> = {};
      for (const theme of THEMES) {
        try {
          out[theme.id] = buildShareUrl(
            await encodeData({ ...DEFAULT_DATA, theme: theme.id, useCurtain: false }),
          );
        } catch {
          // A preview is a progressive enhancement; keep the card usable if it fails.
        }
      }
      if (!cancelled) setDemoUrls(out);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleThemes = useMemo(() => {
    if (mood === 'all') return THEMES;
    return THEMES.filter((theme) => getThemeGenres(theme).includes(mood));
  }, [mood]);

  const featuredThemes = useMemo(
    () => FEATURED_THEME_IDS.map((id) => THEMES.find((theme) => theme.id === id)).filter(Boolean),
    [],
  );

  function openDemo(themeId: ThemeId) {
    const url = demoUrls[themeId];
    if (url) {
      const hashIndex = url.indexOf('/#/');
      if (hashIndex >= 0) {
        navigate(url.slice(hashIndex + 2));
        return;
      }
      window.open(url, '_self');
      return;
    }
    navigate(`/builder?theme=${themeId}`);
  }

  function openCurrentDemo() {
    showToast('데모 청첩장 여는 중…');
    encodeData({ ...DEFAULT_DATA, useCurtain: false })
      .then((encoded) => navigate(`/v/${encoded}`))
      .catch(() => showToast('데모를 열지 못했어요'));
  }

  function startWithEvent(eventType: EventType, theme?: BuiltInThemeId) {
    const seed = applyEventTemplate(
      { ...DEFAULT_DATA, ...(theme ? { theme } : {}) },
      eventType,
    );
    saveDraft(seed);
    navigate('/builder');
  }

  return (
    <main className="home-shell">
      <header className="home-nav">
        <Link to="/" className="home-brand" aria-label="Moment home">
          <span className="brand-mark"><Heart size={13} fill="currentColor" /></span>
          <span>moment<span className="brand-dot">.</span></span>
        </Link>
        <span className="home-nav-note">A digital invitation atelier</span>
        <nav className="home-nav-meta" aria-label="주요 메뉴">
          <a href="#samples">샘플</a>
          <Link to="/manage">내 초대장</Link>
          <Link to="/builder" className="nav-create">새 초대장 <ArrowUpRight size={15} /></Link>
        </nav>
      </header>

      <section className="home-hero">
        <div className="hero-copy">
          <p className="hero-kicker"><span>01</span> MOMENT / DIGITAL INVITATION</p>
          <h1>
            <span className="hero-title-line">결혼 소식보다,</span>
            <span className="hero-title-line"><em>당신들의 장면</em>을</span>
            <span className="hero-title-line">먼저 보여주세요.</span>
          </h1>
          <p className="hero-lede">사진 한 장, 이름 두 개, 그리고 마음을 담을 시간. 오늘의 초대장을 고르는 가장 좋은 방법은 두 사람다운 장면에서 시작하는 거예요.</p>
          <div className="hero-actions">
            <Button asChild size="lg" className="button button-primary"><Link to="/builder">내 초대장 만들기 <ArrowRight size={17} /></Link></Button>
            <button type="button" className="button button-play" onClick={openCurrentDemo}><span><Play size={12} fill="currentColor" /></span> 완성본 먼저 보기</button>
          </div>
          <div className="hero-trust">
            <span><Check size={13} /> 가입 없이 시작</span>
            <span><Check size={13} /> 평생 무료</span>
            <span><Check size={13} /> {THEMES.length}개 테마</span>
          </div>
        </div>

        <div className="hero-showcase" aria-label="민수와 서연의 모바일 청첩장 샘플">
          <div className="showcase-topline"><span>THE INVITATION</span><span>SCROLL TO EXPLORE <ArrowRight size={12} /></span></div>
          <div className="showcase-surface">
            <div className="showcase-backdrop" />
            <motion.div
              className="hero-invite-card"
              initial={{ opacity: 0, y: 26, rotate: 3 }}
              animate={{ opacity: 1, y: 0, rotate: -4 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="hero-card-image" style={{ backgroundImage: `url(${DEFAULT_DATA.hero})` }}>
                <div className="hero-card-wash" />
                <div className="hero-card-date">SATURDAY<br /><strong>10.10</strong><br />2026</div>
                <div className="hero-card-names">민수 <i>&</i> 서연</div>
                <div className="hero-card-location"><MapPin size={11} /> 아펠가모 광화문</div>
              </div>
          <div className="hero-card-footer"><span>우리의 오늘에<br />당신을 초대합니다.</span><Heart size={14} fill="currentColor" /></div>
            </motion.div>
            <div className="hero-card-slip slip-one"><span>01</span><strong>OUR<br />DAY</strong><small>save the date</small></div>
            <div className="hero-card-slip slip-two"><CalendarDays size={15} /><span>13:00<br />SAT</span></div>
            <span className="showcase-caption">a little page<br />for a big day</span>
          </div>
          <div className="showcase-bottomline"><span>민수 &amp; 서연</span><span>2026. 10. 10 · 서울</span></div>
        </div>
      </section>

      <section className="proof-strip">
        <div className="proof-stat"><strong>{String(THEMES.length).padStart(2, '0')}</strong><span>visual languages</span></div>
        <div className="proof-stat"><strong>05</strong><span>min to first draft</span></div>
        <div className="proof-stat"><strong>∞</strong><span>your own moments</span></div>
        <p>청첩장은 한 번 보고 지나가는 링크가 아니라 <b>두 사람을 기억하게 하는 첫 장면</b>이어야 하니까요.</p>
      </section>

      <section id="samples" className="sample-panel section-shell">
        <div className="section-heading-row sample-heading-row">
          <div>
            <p className="eyebrow eyebrow-coral">02 · browse the collection</p>
            <h2>샘플에서 <em>마음에 닿는 결</em>을 찾으세요.</h2>
          </div>
          <div className="heading-aside"><span>세 장면을 먼저 골라봤어요.</span><Link to="/builder">전체 테마 보기 <ArrowUpRight size={14} /></Link></div>
        </div>
        <div className="sample-feature-grid">
          {featuredThemes.map((theme, index) => theme && (
            <button
              key={theme.id}
              type="button"
              className={`sample-card sample-card-${index + 1}`}
              onClick={() => openDemo(theme.id)}
            >
              <span className="sample-card-index">0{index + 1}</span>
              <div className="sample-card-art" style={{ background: theme.preview.bg, color: theme.preview.text }}>
                <div className="sample-card-frame" />
                {index === 0 && (
                  <div className="sample-doodle-scene" aria-hidden>
                    <svg viewBox="0 0 360 420" role="presentation">
                      <path className="doodle-sun" d="M62 76c20-19 49-13 55 10 21-2 32 13 22 29-11 16-40 13-57 8-20 8-42-7-35-25 3-9 8-16 15-22Z" />
                      <path className="doodle-cloud" d="M245 91c9-19 38-17 45 4 19-8 37 8 32 25-4 14-21 19-43 15-18 8-42 3-44-17-1-11 3-21 10-27Z" />
                      <path className="doodle-hill" d="M-8 331c62-62 111-70 164-27 40 33 67 32 105 0 41-35 72-22 108 21v112H-8Z" />
                      <path className="doodle-house" d="M124 267 181 218l59 49v94h-116Z" />
                      <path className="doodle-roof" d="m113 270 68-59 70 59" />
                      <path className="doodle-door" d="M170 361v-50h25v50" />
                      <path className="doodle-person person-one" d="M89 327c-5-29 5-48 23-49 18 1 25 20 18 49m-19-49c-2-12 3-22 13-22 11 0 16 10 13 22m-24 7 18 0" />
                      <path className="doodle-person person-two" d="M253 326c-4-28 5-47 22-48 18 1 26 20 19 48m-18-48c-2-12 3-22 13-22 10 0 15 10 12 22m-24 8 18 0" />
                      <path className="doodle-heart" d="M181 172c-13-18-38 1 0 30 38-29 13-48 0-30Z" />
                      <path className="doodle-flower" d="M54 373c3-35 2-55 18-80m-17 31c-20-13-24-30-10-36 17-6 22 18 10 36Zm1-8c22-12 36-5 35 10-1 16-25 18-35-10Z" />
                    </svg>
                    <span className="doodle-caption">우리 둘의<br />작은 그림책</span>
                  </div>
                )}
                {index === 1 && <div className="sample-film-grid"><span>LOVE<br />STORY</span><i>FRAME 04 / 24</i></div>}
                {index === 2 && <div className="sample-hanji-mark">민수<br /><span>그리고</span><br />서연</div>}
                <span className="sample-card-arrow"><ArrowUpRight size={15} /></span>
              </div>
              <div className="sample-card-meta">
                <span>{theme.name}</span>
                <strong>{index === 0 ? '아이의 크레용처럼 서툴고 다정한 우리' : index === 1 ? '한 편의 영화처럼 흐르는 하루' : '한옥의 선 위에 남기는 오래된 약속'}</strong>
                <small>샘플 보기 <ArrowRight size={13} /></small>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="workflow-panel">
        <div className="section-shell workflow-inner">
          <div className="workflow-intro">
            <p className="eyebrow eyebrow-light"><WandSparkles size={14} /> no blank canvas</p>
            <h2>빈 화면 앞에서 <em>막막하지 않게.</em></h2>
            <p>샘플 문구와 실시간 미리보기를 보면서 두 사람의 이야기를 한 장면씩 채워요.</p>
          </div>
          <div className="workflow-steps">
            {STEPS.map(({ icon: Icon, title, body }, index) => (
              <article className="workflow-step" key={title}>
                <div className="workflow-step-top"><span>0{index + 1}</span><Icon size={18} strokeWidth={1.7} /></div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="event-panel section-shell">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow eyebrow-coral">03 · more than weddings</p>
            <h2>결혼식이 아니어도, <em>초대할 이유</em>는 충분해요.</h2>
          </div>
          <p>생일·돌잔치·집들이까지 같은 편집 방식으로 시작하세요.</p>
        </div>
        <div className="event-grid">
          {EVENT_LIST.map((eventType, index) => {
            const meta = EVENT_LABELS[eventType];
            return (
              <motion.button
                key={eventType}
                type="button"
                className="event-card"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startWithEvent(eventType)}
              >
                <span className="event-number">0{index + 1}</span>
                <span className="event-emoji">{meta.emoji}</span>
                <span className="event-name">{meta.name}</span>
                <span className="event-description">{meta.description}</span>
                <ArrowUpRight className="event-arrow" size={17} />
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="feature-panel section-shell">
        <div className="section-heading-row feature-heading-row">
          <div>
            <p className="eyebrow eyebrow-coral">04 · the details matter</p>
            <h2>예쁜 첫 화면 뒤에 <em>필요한 것까지</em> 담았어요.</h2>
          </div>
          <p>받는 사람은 한 번만 눌러도 정보를 찾을 수 있어야 하니까요.</p>
        </div>
        <div className="feature-grid">
          {FEATURES.map(({ icon: Icon, label, body }, index) => (
            <article className="feature-item" key={label}>
              <div className="feature-icon"><Icon size={18} strokeWidth={1.6} /></div>
              <span className="feature-index">0{index + 1}</span>
              <h3>{label}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="theme-panel section-shell">
        <div className="section-heading-row theme-heading-row">
          <div>
            <p className="eyebrow eyebrow-coral">05 · find your visual language</p>
            <h2>테마를 고르는 일은 <em>우리의 말투</em>를 고르는 일.</h2>
          </div>
          <p>마음에 닿는 결을 누르면 실제 샘플을 바로 볼 수 있어요.</p>
        </div>
        <div className="mood-tabs" role="tablist" aria-label="테마 무드 필터">
          {THEME_FILTERS.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={mood === item.id} className={mood === item.id ? 'active' : ''} onClick={() => setMood(item.id)}>
              <span>{item.label}</span><small>{item.detail}</small>
            </button>
          ))}
        </div>
        <div className="theme-showcase">
          {visibleThemes.map((theme, index) => (
            <motion.article
              key={theme.id}
              className={`theme-tile theme-tile-${index + 1} theme-tile--${theme.id}`}
              style={{ backgroundColor: theme.preview.bg, color: theme.preview.text }}
              whileHover={{ y: -6 }}
              onClick={() => openDemo(theme.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') openDemo(theme.id);
              }}
            >
              <div className="theme-tile-top"><span>{String(theme.id).replaceAll('-', ' ')}</span><ArrowUpRight size={15} /></div>
              <div className="theme-tile-center" style={{ fontFamily: theme.fonts.display }}><span>민수</span><i>♥</i><span>서연</span></div>
              <div className="theme-tile-bottom"><span>{theme.name}</span><span className="theme-dots"><i style={{ background: theme.preview.accent }} /><i style={{ background: theme.preview.text, opacity: 0.35 }} /></span></div>
            </motion.article>
          ))}
        </div>
        <div className="theme-footer"><span><Sparkles size={15} /> {THEMES.length}개 테마 · AI로 무한 확장</span><Link to="/builder" className="text-link">모든 테마로 시작하기 <ArrowUpRight size={15} /></Link></div>
      </section>

      <section className="closing-panel section-shell">
        <div className="closing-card"><div><p className="eyebrow eyebrow-light">your day, your page</p><h2>당신들의 장면을 <em>첫 페이지로.</em></h2></div><Button asChild size="lg" variant="soft" className="button button-light"><Link to="/builder">5분 만에 시작하기 <ArrowUpRight size={17} /></Link></Button></div>
        <footer className="home-footer"><span>moment. invitation atelier</span><span>가입 없음 · 평생 무료 · 내 데이터는 내 것</span><Link to="/privacy">개인정보 처리방침</Link></footer>
      </section>
      <Toast />
    </main>
  );
}

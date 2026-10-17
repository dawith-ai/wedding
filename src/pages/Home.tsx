import { motion } from 'motion/react';
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Camera,
  Check,
  Heart,
  MapPin,
  MessageCircleHeart,
  Music2,
  Palette,
  Sparkles,
  Smartphone,
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

const FEATURES = [
  { icon: Palette, label: '취향을 먼저 고르는 흐름', body: '행사와 무드를 고르면 어울리는 시작점을 바로 제안해요.' },
  { icon: Camera, label: '사진이 주인공이 되는 화면', body: '세로 사진 한 장만으로도 첫 화면이 완성되도록 설계했어요.' },
  { icon: MessageCircleHeart, label: '초대 뒤의 장면까지', body: 'RSVP, 방명록, 식순, 가족의 기록이 한 링크에 이어집니다.' },
  { icon: Smartphone, label: '링크 하나로 오래', body: '가입 없이 만들고, 카톡·QR·홈 화면으로 자연스럽게 공유해요.' },
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
          <span className="brand-mark"><Heart size={14} fill="currentColor" /></span>
          <span>moment<span className="brand-dot">.</span></span>
        </Link>
        <div className="home-nav-meta">
          <span className="nav-status"><span className="status-dot" /> 가입 없이 시작</span>
          <Link to="/manage" className="nav-create">내 초대장</Link>
          <Link to="/builder" className="nav-create">만들기 <ArrowUpRight size={15} /></Link>
        </div>
      </header>

      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={14} /> private invitation studio · 2026</p>
          <h1>두 사람의 이야기를<br /><em>한 장면씩,</em><br />초대합니다.</h1>
          <p className="hero-lede">
            사진 한 장과 두 사람의 이름에서 시작해<br />
            오래 남을 한 페이지를 함께 만듭니다.
          </p>
          <div className="hero-actions">
            <Button asChild size="lg" className="button button-dark"><Link to="/builder">내 초대장 만들기 <ArrowUpRight size={17} /></Link></Button>
            <button type="button" className="button button-quiet" onClick={openCurrentDemo}>완성본 먼저 보기 <ArrowDownRight size={16} /></button>
          </div>
          <div className="hero-proof">
            <span><Check size={13} /> 평생 무료</span>
            <span><Check size={13} /> 링크 하나</span>
            <span><Check size={13} /> 서버비 0원</span>
          </div>
        </div>

        <div className="hero-stage" aria-label="모바일 청첩장 미리보기">
          <div className="stage-orbit orbit-one" />
          <div className="stage-orbit orbit-two" />
          <motion.div
            className="preview-paper"
            initial={{ opacity: 0, y: 28, rotate: 3 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="preview-paper-top">
              <span>THE INVITATION</span>
              <span>01 / 06</span>
            </div>
            <div className="preview-photo" style={{ backgroundImage: `url(${DEFAULT_DATA.hero})` }}>
              <div className="preview-photo-wash" />
              <span className="preview-date">SAT · 10 OCT · 2026</span>
              <div className="preview-names">민수 <i>&</i> 서연</div>
              <span className="preview-place"><MapPin size={12} /> 아펠가모 광화문</span>
            </div>
            <div className="preview-paper-bottom">
              <span>소중한 분들을 초대합니다</span>
              <span className="preview-heart"><Heart size={14} fill="currentColor" /></span>
            </div>
          </motion.div>
          <motion.div className="stage-sticker sticker-calendar" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <CalendarDays size={16} /> <span>2026.10.10</span>
          </motion.div>
          <motion.div className="stage-sticker sticker-note" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
            <Music2 size={15} /> <span>우리의 노래도 함께</span>
          </motion.div>
          <span className="stage-caption">a little page<br />for a big day</span>
        </div>
      </section>

      <section className="event-panel section-shell">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow eyebrow-dark">01 · start with a feeling</p>
            <h2>초대의 모양부터<br />고르세요.</h2>
          </div>
          <p>가장 가까운 시작점을 고르면<br />문구와 구조가 함께 따라와요.</p>
        </div>
        <div className="event-grid">
          {EVENT_LIST.map((eventType, index) => {
            const meta = EVENT_LABELS[eventType];
            return (
              <motion.button
                key={eventType}
                type="button"
                className={`event-card event-card-${index + 1}`}
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

      <section className="feature-band">
        <div className="section-shell">
          <div className="feature-intro">
            <p className="eyebrow"><WandSparkles size={14} /> beyond the template</p>
            <h2>완성된 링크보다,<br /><em>기억되는 순간</em>을.</h2>
          </div>
          <div className="feature-grid">
            {FEATURES.map(({ icon: Icon, label, body }) => (
              <article className="feature-item" key={label}>
                <div className="feature-icon"><Icon size={18} strokeWidth={1.6} /></div>
                <h3>{label}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="theme-panel section-shell">
        <div className="section-heading-row theme-heading-row">
          <div>
            <p className="eyebrow eyebrow-dark">02 · find your visual language</p>
            <h2>테마가 아니라,<br />두 사람의 결을 고르세요.</h2>
          </div>
          <p>먼저 마음에 닿는 결을 고르고,<br />빌더에서 이야기를 채워보세요.</p>
        </div>
        <div className="mood-tabs" role="tablist" aria-label="테마 무드 필터">
          {THEME_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={mood === item.id}
              className={mood === item.id ? 'active' : ''}
              onClick={() => setMood(item.id)}
            >
              <span>{item.label}</span><small>{item.detail}</small>
            </button>
          ))}
        </div>
        <div className="theme-showcase">
          {visibleThemes.map((theme, index) => (
            <motion.article
              key={theme.id}
              className={`theme-tile theme-tile-${index + 1}`}
              style={{ background: theme.preview.bg, color: theme.preview.text }}
              whileHover={{ y: -6 }}
              onClick={() => openDemo(theme.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') openDemo(theme.id);
              }}
            >
              <div className="theme-tile-top">
                <span>{String(theme.id).replaceAll('-', ' ')}</span>
                <ArrowUpRight size={15} />
              </div>
              <div className="theme-tile-center" style={{ fontFamily: theme.fonts.display }}>
                <span>민수</span><i>♥</i><span>서연</span>
              </div>
              <div className="theme-tile-bottom">
                <span>{theme.name}</span>
                <span className="theme-dots"><i style={{ background: theme.preview.accent }} /><i style={{ background: theme.preview.text, opacity: 0.35 }} /></span>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="theme-footer">
          <span><Sparkles size={15} /> {THEMES.length}개 테마 · AI로 무한 확장</span>
          <Link to="/builder" className="text-link">모든 테마로 시작하기 <ArrowUpRight size={15} /></Link>
        </div>
      </section>

      <section className="closing-panel section-shell">
        <div className="closing-card">
          <div>
            <p className="eyebrow">your day, your page</p>
            <h2>당신들의 장면을<br /><em>시작하세요.</em></h2>
          </div>
          <Button asChild size="lg" variant="soft" className="button button-light"><Link to="/builder">5분 만에 시작하기 <ArrowUpRight size={17} /></Link></Button>
        </div>
        <footer className="home-footer">
          <span>moment. invitation atelier</span>
          <span>가입 없음 · 평생 무료 · 내 데이터는 내 것</span>
          <Link to="/privacy">개인정보 처리방침</Link>
        </footer>
      </section>
      <Toast />
    </main>
  );
}

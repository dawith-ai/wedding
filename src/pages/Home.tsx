import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { THEMES, loadThemeFonts } from '../data/themes';
import type { BuiltInThemeId, EventType } from '../types';
import { DEFAULT_DATA } from '../data/defaults';
import { EVENT_LIST, EVENT_LABELS, applyEventTemplate } from '../data/events';
import { buildShareUrl, encodeData } from '../lib/encode';
import { saveDraft } from '../lib/storage';
import { showToast } from '../lib/toast';
import { Toast } from '../components/invite/Toast';

export function Home() {
  const navigate = useNavigate();
  const [demoUrls, setDemoUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    THEMES.forEach(loadThemeFonts);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const out: Record<string, string> = {};
      for (const t of THEMES) {
        try {
          const data = { ...DEFAULT_DATA, theme: t.id, useCurtain: false };
          out[t.id] = buildShareUrl(await encodeData(data));
        } catch { /* skip */ }
      }
      if (!cancelled) setDemoUrls(out);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function openDemo(themeId: BuiltInThemeId, fallback: () => void) {
    const url = demoUrls[themeId];
    if (url) {
      const hashIndex = url.indexOf('/#/');
      if (hashIndex >= 0) {
        navigate(url.slice(hashIndex + 2));
        return;
      }
      window.location.assign(url);
      return;
    }
    fallback();
  }

  async function openCurrentDemo() {
    showToast('데모 청첩장 여는 중…');
    try {
      const data = { ...DEFAULT_DATA, useCurtain: false };
      const encoded = await encodeData(data);
      navigate(`/v/${encoded}`);
    } catch {
      showToast('데모 열기 실패');
    }
  }

  function startWithEvent(ev: EventType) {
    const seed = applyEventTemplate({ ...DEFAULT_DATA }, ev);
    saveDraft(seed);
    navigate('/builder');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <header style={{ padding: '60px 24px 36px', textAlign: 'center', background: '#fff', borderBottom: '1px solid #eee' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, margin: 0, letterSpacing: '0.05em' }}>
          모바일 청첩장 <span style={{ color: '#b76e79' }}>♥</span>
        </h1>
        <p style={{ color: '#333', marginTop: 14, fontSize: 16, lineHeight: 1.65, fontWeight: 500 }}>
          AI로 만드는 모바일 청첩장 · 평생 보관
        </p>
        <p style={{ color: '#666', marginTop: 8, fontSize: 13, lineHeight: 1.7 }}>
          셀카 1장으로 웨딩 사진 합성 · 본인 목소리 음성 인사말 · 결혼 후에도 살아있는 가족 페이지
        </p>
        <div style={{ marginTop: 22, display: 'inline-flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            to="/builder"
            style={{
              background: '#222',
              color: '#fff',
              padding: '14px 36px',
              borderRadius: 999,
              fontSize: 15,
              letterSpacing: '0.05em',
            }}
          >
            지금 만들기 시작
          </Link>
          <button
            onClick={openCurrentDemo}
            type="button"
            style={{
              background: 'transparent',
              border: '1px solid #222',
              color: '#222',
              padding: '14px 28px',
              borderRadius: 999,
              fontSize: 14,
              letterSpacing: '0.05em',
              cursor: 'pointer',
            }}
          >
            예시 청첩장 둘러보기
          </button>
        </div>
        <p style={{ color: '#aaa', marginTop: 14, fontSize: 12 }}>
          가입 없음 · 서버비 0원 · 카톡 공유 · 한 번 만들면 평생 보관
        </p>
      </header>

      <section style={{ padding: '40px 20px 12px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, marginBottom: 8, fontWeight: 500 }}>
          어떤 행사인가요?
        </h2>
        <p style={{ textAlign: 'center', color: '#888', fontSize: 13, marginBottom: 24 }}>
          결혼식 외에도 다양한 초대장을 만들 수 있어요. 클릭하면 해당 톤으로 시작합니다.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
          {EVENT_LIST.map((ev) => {
            const meta = EVENT_LABELS[ev];
            return (
              <button
                key={ev}
                type="button"
                onClick={() => startWithEvent(ev)}
                style={{
                  background: '#fff',
                  border: '1px solid #e6e2dc',
                  borderRadius: 12,
                  padding: '20px 14px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'transform 0.12s, box-shadow 0.12s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 18px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'none';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: 32 }}>{meta.emoji}</div>
                <div style={{ marginTop: 8, fontSize: 14, fontWeight: 600, color: '#333' }}>{meta.name}</div>
                <div style={{ marginTop: 4, fontSize: 11, color: '#888', lineHeight: 1.5 }}>{meta.description}</div>
              </button>
            );
          })}
        </div>
      </section>

      <section style={{ padding: '36px 20px 16px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 20, marginBottom: 18, fontWeight: 500, color: '#333' }}>
          왜 우리 청첩장?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <FeatureCard
            emoji="🎀"
            title="AI 사진 스튜디오"
            body='셀카 1장으로 한복·드레스·턱시도 자동 합성. 야외/스튜디오/비치/한국 전통 무드까지. "스튜디오 촬영 200~400만원"을 우회하는 진짜 차별화.'
          />
          <FeatureCard
            emoji="🎙️"
            title="본인 목소리 인사말"
            body='AI 음성으로 인사말을 한국어 mp3로 변환. 6가지 보이스 + 속도 조절. 텍스트 인사말의 10배 정서적 임팩트.'
          />
          <FeatureCard
            emoji="∞"
            title="평생 가족 페이지"
            body="청첩장은 결혼식 그날로 끝나지 않아요. 1주년·돌·가족 여행·기념일이 시간이 갈수록 누적되는 라이프 페이지. 영구 URL이라 가능."
          />
          <FeatureCard
            emoji="✨"
            title="AI로 무한 테마"
            body='"시카고 60년대 빈티지"처럼 묘사하면 AI가 우리만의 테마를 생성. 13개 고정 템플릿 한계 돌파, BYOK 방식이라 비용 0원 유지.'
          />
          <FeatureCard
            emoji="💾"
            title="평생 무료 + 만료 없음"
            body="공유 링크 = 데이터 그 자체. 카톡에 한 번만 공유해도 영원히 그 모습 그대로. 데어무드/디얼디어처럼 만료되지 않음, 서버 비용 0원."
          />
          <FeatureCard
            emoji="🎊"
            title="결혼식 외 모든 행사"
            body="돌잔치·환갑·칠순·생일파티·회사 행사·일반 모임까지. 6개 이벤트 타입을 한 빌더로."
          />
        </div>
      </section>

      <section style={{ padding: '24px 20px 60px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, marginTop: 24, marginBottom: 8, fontWeight: 500 }}>
          기본 제공 13개 테마
        </h2>
        <p style={{ textAlign: 'center', color: '#888', fontSize: 13, marginBottom: 28 }}>
          카드를 누르면 실제 청첩장 데모를 볼 수 있어요. 빌더에서 AI 프롬프트로 무한 테마 추가도 가능.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {THEMES.map((t) => (
            <article
              key={t.id}
              style={{
                background: t.preview.bg,
                border: `1px solid ${t.preview.text}20`,
                borderRadius: 12,
                padding: 24,
                color: t.preview.text,
                aspectRatio: '4 / 5',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: t.fonts.body,
                cursor: 'pointer',
              }}
              onClick={() =>
                openDemo(t.id as BuiltInThemeId, () => {
                  navigate(`/builder?theme=${t.id}`);
                })
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openDemo(t.id as BuiltInThemeId, () => {
                    navigate(`/builder?theme=${t.id}`);
                  });
                }
              }}
            >
              <div>
                <p style={{ fontSize: 11, letterSpacing: '0.3em', opacity: 0.7, margin: 0 }}>
                  {String(t.id).toUpperCase()}
                </p>
                <h3
                  style={{
                    fontFamily: t.fonts.display,
                    fontSize: 26,
                    fontWeight: 400,
                    margin: '14px 0 8px',
                    letterSpacing: '0.04em',
                  }}
                >
                  {t.name}
                </h3>
                <p style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, margin: 0 }}>
                  {t.description}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 16, alignItems: 'center' }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: t.preview.accent }} />
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: t.preview.text, opacity: 0.4 }} />
                <Link
                  to={`/builder?theme=${t.id}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    fontSize: 11,
                    marginLeft: 'auto',
                    border: `1px solid ${t.preview.text}40`,
                    padding: '3px 10px',
                    borderRadius: 999,
                    color: t.preview.text,
                    textDecoration: 'none',
                  }}
                >
                  이 테마로 만들기 →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: 56, textAlign: 'center', color: '#888', fontSize: 13, lineHeight: 1.9 }}>
          <p style={{ margin: 0 }}>· 사진 / 영상 / BGM / 카카오톡 공유 / 식순 / 응원하기 / 방명록 / RSVP</p>
          <p style={{ margin: 0 }}>· 공유 링크 = URL에 모든 데이터 인코딩 — 서버 비용 0원, 영구 작동</p>
          <p style={{ margin: 0 }}>· PWA 지원, 홈 화면 추가, 오프라인 재오픈 가능</p>
          <p style={{ margin: '14px 0 0' }}>
            <Link to="/privacy" style={{ color: '#888', fontSize: 12 }}>
              개인정보 처리방침
            </Link>
          </p>
        </div>
      </section>
      <Toast />
    </div>
  );
}

function FeatureCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #eee',
      borderRadius: 12,
      padding: '20px 18px',
    }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{emoji}</div>
      <h3 style={{ fontSize: 15, margin: '0 0 6px', fontWeight: 600, color: '#222' }}>{title}</h3>
      <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7, margin: 0 }}>{body}</p>
    </div>
  );
}

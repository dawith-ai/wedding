import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { THEMES, loadThemeFonts } from '../data/themes';
import type { ThemeId } from '../types';
import { DEFAULT_DATA } from '../data/defaults';
import { buildShareUrl, encodeData } from '../lib/encode';
import { showToast } from '../lib/toast';
import { Toast } from '../components/invite/Toast';

export function Home() {
  const navigate = useNavigate();
  const [demoUrls, setDemoUrls] = useState<Record<ThemeId, string>>({} as Record<ThemeId, string>);

  useEffect(() => {
    THEMES.forEach(loadThemeFonts);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const out = {} as Record<ThemeId, string>;
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

  async function openDemo(themeId: ThemeId, fallback: () => void) {
    const url = demoUrls[themeId];
    if (url) {
      // Internal navigation — strip origin prefix to use SPA router
      const hashIndex = url.indexOf('/#/');
      if (hashIndex >= 0) {
        navigate(url.slice(hashIndex + 2));
        return;
      }
      window.location.href = url;
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

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <header style={{ padding: '60px 24px 40px', textAlign: 'center', background: '#fff', borderBottom: '1px solid #eee' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, margin: 0, letterSpacing: '0.05em' }}>
          Wedding <span style={{ color: '#b76e79' }}>♥</span> Invitation
        </h1>
        <p style={{ color: '#666', marginTop: 12, fontSize: 15, lineHeight: 1.7 }}>
          12가지 테마로 만드는 모바일 청첩장
          <br />
          정보 입력만으로 5분 안에 완성하세요
        </p>
        <div style={{ marginTop: 24, display: 'inline-flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
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
            청첩장 만들기 시작
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
          별도 가입 없이 작동 · 서버 비용 0원 · 카카오톡 공유 지원
        </p>
      </header>

      <section style={{ padding: '40px 20px 60px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, marginBottom: 8, fontWeight: 500 }}>
          12가지 테마
        </h2>
        <p style={{ textAlign: 'center', color: '#888', fontSize: 13, marginBottom: 32 }}>
          카드를 누르면 실제 청첩장 데모를 볼 수 있어요. 마음에 드는 무드로 빌더 시작.
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
                openDemo(t.id, () => {
                  navigate(`/builder?theme=${t.id}`);
                })
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openDemo(t.id, () => {
                    navigate(`/builder?theme=${t.id}`);
                  });
                }
              }}
            >
              <div>
                <p style={{ fontSize: 11, letterSpacing: '0.3em', opacity: 0.7, margin: 0 }}>
                  {t.id.toUpperCase()}
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

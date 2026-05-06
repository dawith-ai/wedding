import { Link } from 'react-router-dom';
import { THEMES, loadThemeFonts } from '../data/themes';
import { useEffect } from 'react';

export function Home() {
  useEffect(() => {
    THEMES.forEach(loadThemeFonts);
  }, []);

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
        <Link
          to="/builder"
          style={{
            display: 'inline-block',
            marginTop: 24,
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
      </header>

      <section style={{ padding: '40px 20px 60px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, marginBottom: 8, fontWeight: 500 }}>
          12가지 테마
        </h2>
        <p style={{ textAlign: 'center', color: '#888', fontSize: 13, marginBottom: 32 }}>
          마음에 드는 무드를 골라보세요. 빌더에서 자유롭게 변경할 수 있어요.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {THEMES.map((t) => (
            <Link
              key={t.id}
              to={`/builder?theme=${t.id}`}
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
              <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: t.preview.accent }} />
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: t.preview.text, opacity: 0.4 }} />
                <span
                  style={{
                    fontSize: 11,
                    marginLeft: 'auto',
                    border: `1px solid ${t.preview.text}40`,
                    padding: '3px 10px',
                    borderRadius: 999,
                  }}
                >
                  미리보기 →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 56, textAlign: 'center', color: '#888', fontSize: 13 }}>
          <p>· 사진은 직접 업로드 (Imgur) 또는 외부 URL 입력 모두 지원</p>
          <p>· 방명록 / RSVP / BGM / 카운트다운 기본 포함</p>
          <p>· 공유 링크 한 번 만들면 영구적으로 작동, 서버 비용 0원</p>
        </div>
      </section>
    </div>
  );
}

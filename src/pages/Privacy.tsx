import { Link } from 'react-router-dom';

export function Privacy() {
  return (
    <div
      style={{
        background: '#fafaf8',
        minHeight: '100vh',
        padding: '48px 20px 80px',
        color: '#222',
        fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
      }}
    >
      <article style={{ maxWidth: 720, margin: '0 auto', lineHeight: 1.75, fontSize: 15 }}>
        <Link to="/" style={{ fontSize: 13, color: '#666' }}>
          ← 홈으로
        </Link>

        <h1 style={{ fontSize: 28, marginTop: 18, fontWeight: 500, letterSpacing: '0.02em' }}>
          개인정보 처리방침
        </h1>
        <p style={{ color: '#888', fontSize: 12 }}>마지막 업데이트: 2026-05-07</p>

        <h2 style={H2}>1. 수집·이용하는 정보</h2>
        <p>
          본 서비스는 청첩장을 만들고 공유하는 정적 웹앱입니다. 자체 서버에 사용자 데이터를
          저장하지 않으며, 청첩장 정보는 사용자가 만든 공유 링크의 URL 안에 인코딩됩니다.
        </p>
        <ul style={UL}>
          <li>청첩장 정보 (신랑·신부 정보, 일시·장소, 사진 URL, 인사말 등) — 공유 URL에 포함</li>
          <li>방명록·RSVP·응원 — 기본은 보는 사람의 브라우저 localStorage. Firebase 연결시 해당 프로젝트에 저장</li>
          <li>이미지 — 사용자가 입력한 외부 URL(Imgur 등) 그대로 표시</li>
        </ul>

        <h2 style={H2}>2. 외부 서비스 이용</h2>
        <p>다음 외부 서비스를 사용자가 활성화한 경우에만 통신합니다.</p>
        <ul style={UL}>
          <li>
            <b>Imgur</b> — 사진 업로드. 본 서비스는 사용자가 발급한 Client ID로
            <code style={CODE}>api.imgur.com</code>에 직접 업로드하며 본 서버를 거치지 않습니다.
          </li>
          <li>
            <b>Firebase Firestore</b> — 사용자가 자신의 프로젝트 키를 입력한 경우, 방명록·RSVP·응원
            카운터를 사용자 본인의 Firestore에 저장합니다.
          </li>
          <li>
            <b>Kakao 공유</b> — 카카오 JavaScript SDK를 동적 로드하여 카카오톡 공유에 사용합니다.
            카카오는 자체 정책에 따라 공유 이벤트를 처리합니다.
          </li>
          <li>
            <b>Google Fonts</b> — 테마별 웹폰트 로드. 사용자의 브라우저가 직접 fonts.googleapis.com에 요청합니다.
          </li>
        </ul>

        <h2 style={H2}>3. 쿠키·로컬 저장소</h2>
        <p>
          서비스 동작에 필요한 최소 정보를 브라우저 localStorage에 저장합니다.
          (예: 빌더 임시 저장, 응원 누적, 방명록 게시물, 외부 키)
          기기 외부로 전송되지 않습니다.
        </p>

        <h2 style={H2}>4. 제3자 제공·국외 이전</h2>
        <p>
          본 서비스는 사용자 정보를 제3자에게 제공하지 않으며, 사용자가 직접 외부 서비스를
          연결한 경우에만 해당 서비스로 정보가 이전됩니다 (Imgur, Firebase, Kakao, Google Fonts).
        </p>

        <h2 style={H2}>5. 보유·삭제</h2>
        <p>
          공유 URL은 사용자가 만든 링크 자체이며 서버에 저장되지 않습니다. 링크 폐기는 해당 링크의
          유통을 중단하면 됩니다. 방명록·RSVP는 보는 사람의 기기 또는 사용자 본인의 Firebase에서
          직접 삭제할 수 있습니다.
        </p>

        <h2 style={H2}>6. 책임의 한계</h2>
        <p>
          본 서비스는 코드만 제공하며 운영자는 사용자가 입력한 데이터를 보관하지 않습니다.
          외부 서비스 장애·정책 변경에 대해 운영자는 책임을 지지 않습니다.
        </p>

        <h2 style={H2}>7. 문의</h2>
        <p>
          본 프로젝트는 오픈소스(MIT)로 운영됩니다. 코드 저장소{' '}
          <a href="https://github.com/dawith-ai/wedding" target="_blank" rel="noopener" style={{ color: '#3a6' }}>
            github.com/dawith-ai/wedding
          </a>
          의 Issues로 문의해주세요.
        </p>
      </article>
    </div>
  );
}

const H2: React.CSSProperties = {
  fontSize: 17,
  marginTop: 28,
  marginBottom: 8,
  fontWeight: 600,
  letterSpacing: '0.02em',
};
const UL: React.CSSProperties = {
  paddingLeft: 18,
  margin: '8px 0 8px',
};
const CODE: React.CSSProperties = {
  background: '#f0efeb',
  padding: '1px 6px',
  borderRadius: 4,
  fontFamily: 'ui-monospace, monospace',
  fontSize: 13,
};

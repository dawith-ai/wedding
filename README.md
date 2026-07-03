# Wedding · 모바일 청첩장 빌더

**평생 무료 · 만료 없음 · AI로 무한 테마**

13개 기본 테마 + AI 프롬프트 기반 무한 커스터마이징. 결혼식부터 돌잔치·환갑·생일·회사 행사까지 모두 지원.
정보 입력만으로 5분 안에 완성하고, 링크 하나·QR 코드로 공유할 수 있습니다.
공유 링크에 모든 데이터를 인코딩하므로 서버 비용 0원·영구 작동.
홈 화면에 추가해서 앱처럼 사용 가능하며, 구글 플레이스토어/앱스토어 배포도 지원합니다.

## 차별점

- **평생 무료, 만료 없음** — 데어무드/디얼디어 등 기존 서비스는 일정 기간 후 사라지거나 유료 플랜 필요
- **AI로 무한 테마** — "시카고 60년대 빈티지" 같이 묘사 → AI가 우리만의 테마 생성. 13개 고정 템플릿 한계 돌파
- **결혼식 외 모든 행사** — 돌잔치/환갑·칠순/생일/회사 행사/일반 모임도 한 빌더로
- **내 데이터는 내 것** — 공유 링크가 곧 데이터. 백업·이사·복구 걱정 없음

## 프로젝트 상태 · 유지관리

**활발히 유지관리 중인 공개 프로젝트입니다.** 개인 프로젝트로 시작해 실제 사용자가
청첩장·돌잔치·환갑 등에 사용할 수 있는 완성된 도구로 발전시켰고, 계속 개선하고 있습니다.

- **CI 품질 게이트**: `main` 푸시마다 GitHub Actions가 빌드 → 12테마 Playwright 스모크
  (콘솔 에러·요청 실패·어설션 검증) → Lighthouse(PWA/성능/접근성/SEO) → Pages 배포를
  자동 실행합니다. 스모크 실패 시 배포가 차단되어 항상 동작하는 상태를 유지합니다.
- **유지관리 방향**: 이슈/버그 리포트 대응, 테마·이벤트 타입 확장, 접근성·성능 개선,
  문서 보완을 지속합니다. 코드는 모듈화(테마 시스템 / 인코딩 레이어 / 빌더 / 공유)되어
  있고 MIT 라이선스로 누구나 포크·재사용할 수 있습니다.
- **기여 환영**: 새 테마, 이벤트 타입, 번역, 버그 수정 PR을 받습니다.

## 로드맵

현재 구현을 기반으로 한 개선 계획입니다.

- **AI 테마 생성 자동화** — 지금은 "묘사 → 프롬프트 복사 → JSON 붙여넣기"의 수동
  워크플로입니다. 이를 빌더 안에서 자연어 입력만으로 테마 JSON을 바로 생성하는
  인앱 자동화로 발전시킬 예정입니다.
- **AI 인사말·카피 초안** — 이벤트 타입별 인사말/식순 문구를 자연어로 초안 생성.
- **다국어(i18n)** — 현재 한국어 중심 → 영문 등 다국어 청첩장 지원.
- **테마·이벤트 타입 확장** — 기본 테마 및 행사 유형 추가.
- **접근성 강화** — 스크린리더·키보드 내비게이션 커버리지 확대.
- **스모크 커버리지 확대** — 빌더 상호작용·공유 링크 왕복까지 E2E 확장.

## 라이브 데모

빌드 후 GitHub Pages에 자동 배포됩니다. `https://<your-username>.github.io/wedding/`

## 앱 스토어 배포

PWA로 빌드된 `dist/`를 [PWABuilder](https://www.pwabuilder.com) / Bubblewrap 으로
래핑해 구글플레이/앱스토어에 출시할 수 있습니다. 자세한 절차는 [MOBILE_APP.md](./MOBILE_APP.md) 참조.

## 주요 기능

### 청첩장 콘텐츠
- **13개 기본 테마** (awesome-claude-design 기반): 온화한 크림 / 갤러리 화이트 / 기하 미니멀 / 로맨틱 코랄 / 가든 그린 / 대성당 골드 / 라벤더 미니멀 / 브로드시트 필름 / 핸드크래프트 워시 / 미드나잇 일렉트릭 / 파스텔 타일 / 한지 단청 / 시네마 모노
- **AI 커스텀 테마**: "시카고 60년대 빈티지" 같이 묘사 → AI가 JSON 생성 → 즉시 적용. 빌더 안에서 ChatGPT/Claude 프롬프트 복사 + JSON 붙여넣기 워크플로 제공
- **이벤트 타입 6종**: 결혼식 / 돌잔치 / 환갑·칠순 / 생일파티 / 회사 행사 / 일반 초대 — 각각 라벨·기본 카피 자동 매핑
- **실시간 빌더**: 좌측 폼, 우측 미리보기. 입력 즉시 반영
- **이미지 업로드**: Imgur 익명 업로드 지원 (또는 외부 URL 직접 입력)
- **카운트다운**: 결혼식까지 D-Day 실시간 표시
- **캘린더 추가**: 구글 캘린더 / Apple .ics 다운로드
- **지도 통합**: 카카오맵 / 네이버지도 / T맵 자동 링크
- **계좌번호 복사**: 신랑·신부측 각각 펼침 + 복사 버튼
- **방명록**: 비밀번호 보호, 본인 글 삭제 가능
- **RSVP 참석 응답**: 측 / 인원수 / 식사 / 연락처 / 메시지
- **BGM**: 외부 mp3 URL 입력해서 배경음악, 탭 숨김 시 자동 일시정지
- **커튼 인트로**: 초대장 열기 애니메이션 (선택적)
- **식순 / 셔틀버스 / 응원하기 / Save the Date 이미지**
- **故 표시**: 작고하신 부모님 표시 옵션
- **Firebase 연동(선택)**: 방명록·RSVP를 모든 기기에서 공유

### 공유·배포
- **공유 링크**: 모든 데이터를 URL에 인코딩 → 서버 비용 0원, 영구 작동
- **QR 코드 자동 생성**: 인쇄·키오스크 게시용
- **Web Share API**: 카카오톡 공유 시트 직접 호출 (모바일)
- **Open Graph 동적 갱신**: 카카오톡 링크 미리보기에 신랑·신부 정보 노출

### PWA / 앱
- **홈 화면 설치**: manifest + 서비스 워커, 오프라인 지원
- **구글플레이/앱스토어 배포 가능** ([MOBILE_APP.md](./MOBILE_APP.md))
- **노치·홈인디케이터 안전영역** 지원
- **`prefers-reduced-motion`** 시스템 설정 존중
- **인쇄 모드** — 종이 청첩장 백업으로 출력 가능

### 견고함
- **에러 바운더리**: 일시 오류 시 복구 안내
- **localStorage quota·시크릿 모드** 안전 처리
- **PhotoViewer 핀치-줌 + 더블탭 + 스와이프**

## 기술 스택

- React 19 + TypeScript + Vite
- React Router (HashRouter)
- 데이터 인코딩: `CompressionStream(deflate-raw)` + base64url
- 이미지: Imgur API (anonymous)
- 영속 데이터: localStorage 기본 / Firebase Firestore REST 옵션

## 개발

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 미리보기
```

## 배포 (GitHub Pages)

`main` 브랜치에 푸시하면 `.github/workflows/deploy.yml`이 자동 빌드 + 배포합니다.

레포 Settings → Pages → Source를 **GitHub Actions**로 설정해주세요.

## 사용법

1. 홈에서 마음에 드는 테마 클릭 → 빌더로 이동
2. 신랑·신부 정보, 일시, 장소, 사진 입력
3. (선택) 우측 상단 **설정**에서 Imgur Client ID 입력 → 사진 업로드 활성화
4. (선택) Firebase 설정 입력 → 방명록·RSVP 모든 기기 공유
5. 우측 상단 **공유 링크 생성** → 카카오톡 등으로 전송

## Imgur Client ID 발급

1. https://api.imgur.com/oauth2/addclient 접속
2. "Anonymous usage without user authorization" 선택
3. 발급된 Client ID를 빌더 설정에 입력

## Kakao 공유 설정 (선택)

카카오톡 네이티브 공유(노란색 버튼) 활성화. 미설정시 Web Share API / 링크 복사로 자동 폴백.

1. https://developers.kakao.com/console/app 에서 앱 등록
2. 앱 키 → **JavaScript 키** 복사
3. 플랫폼 → **Web** → 사이트 도메인에 배포 URL 등록 (예: `https://dawith-ai.github.io`)
4. 빌더 우상단 **설정** → JavaScript Key 입력 → 저장

## Firebase 설정 (선택)

1. https://console.firebase.google.com/ 에서 프로젝트 생성
2. Firestore Database 생성 (테스트 모드)
3. 프로젝트 설정 → 일반 → 웹 앱 추가 → `apiKey`, `authDomain`, `projectId` 복사
4. 빌더 설정에 입력
5. Firestore 규칙: 개인 청첩장 용도라면 `allow read, write: if true;` 무방

## 자동화 / 품질 검증

```bash
npm run smoke       # 12 테마 × 6 어설션 Playwright 스모크 (모바일 viewport)
npm run audit:pwa   # Lighthouse — PWA / 성능 / 접근성 / SEO 점수 임계값 검증
npm run icons:generate  # SVG → PNG 6장 (192/512/1024 + maskable + apple-touch)
```

`npm run prebuild`은 `build` 직전에 자동 실행되어 PNG가 SVG 소스에서 드리프트되지 않도록 합니다.

`main` 브랜치 푸시 시 GitHub Actions(`.github/workflows/deploy.yml`)가 자동으로:
1. 빌드 (icons + tsc + vite)
2. Playwright 스모크 (12 테마, 콘솔 에러·요청 실패·어설션 검증)
3. GitHub Pages 배포
4. 스크린샷 아티팩트 업로드 (`scripts/.smoke-out/`)

스모크 실패 시 배포 차단됩니다. 아티팩트는 Actions 탭에서 14일 보관.

## 데이터 구조

`src/types.ts` 참조. URL에 인코딩되는 데이터는 신랑·신부 정보, 일시, 장소, 인사말, 사진 URL, 계좌, 옵션입니다. 사진 자체는 외부 호스팅(Imgur 등)에 있으므로 URL만 인코딩됩니다.

## 디자인 크레딧

타이포그래피 스케일·top-biased 히어로·드롭 캡·off-white 톤 등 에디토리얼 원칙은
[nexu-io/open-design](https://github.com/nexu-io/open-design)의 `warm-editorial`
스타터 가이드(Apache-2.0)에서 가져왔습니다. 코드 구현은 모두 자체 작성입니다.
자세한 attribution은 [NOTICE](./NOTICE) 참조.

## 라이선스

MIT (소스 코드)


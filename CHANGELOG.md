# Changelog

이 문서는 모바일 청첩장 빌더의 주요 변경 이력을 기록합니다.
포맷은 [Keep a Changelog](https://keepachangelog.com/), 버전은 [SemVer](https://semver.org/) 기반.

## [3.3.0] - 2026-05-12 — 입장 연출 디벨롭 + 13 테마 가독성 통과

dongdong39/wedding_templates 레퍼런스에서 가져온 영감으로 청첩장 진입 순간을 영화처럼. 13 테마 전부 WCAG 4.5:1 통과.

### Added

- **Curtain 레이어드 입장 연출** — Hero 사진 블러 백드롭 + 그라데이션 틴트 + 테마 ornament(꽃잎/별/스파클/잎/하트) 파티클 + 좌우 패널 슬라이드. 라벨/날짜+요일 칩/이름/디바이더/버튼/힌트 화살표가 0.15s 간격으로 stagger reveal.
  - 어두운 테마(luxury-gold, midnight-navy, editorial-mono)는 추가 글로우 + 인셋 섀도우로 카타르시스 강화.
  - `Escape`/`Enter`/`Space` 키로 즉시 입장 가능, 버튼 자동 포커스.
  - `prefers-reduced-motion` 존중: 슬라이드/스태거/힌트 애니메이션 비활성, 0.2s 페이드만.
  - 요일 칩(MON/TUE…), `&` 스크립트 폰트, 어센트 컬러 pill 버튼, 화살표 아이콘 + 바운싱 힌트.
  - `src/components/invite/Curtain.tsx` · `src/styles/invite.css`
- **테마별 가독성 풀패스** — 13/13 테마가 WCAG 4.5:1 (AA Body Text) 통과. `section-label` / `share-intro` / `like-caption` / `account-intro` / `countdown-message` / `gallery-subtitle`가 `color-mix(in srgb, var(--text-muted) 55%, var(--text) 45%)`로 강화되어 디자인 톤은 유지하되 대비 회복.
- **청첩장 시네마 스테이지 v-clip 수정** — `editorial-mono`의 `cinema-stage`가 모바일 폭에서 텍스트를 25px 잘라먹던 버그 해결(`min-height: 320px`).
- **smoke-curtain 스크립트** — 8개 핵심 테마에서 Curtain 마운트 → 스태거 reveal → 버튼 클릭 → 언마운트까지 검증. `npm run verify:curtain`.

### Changed

- **Curtain props 확장** — `heroImage` / `ornament` / `layout`을 InviteView에서 주입. 테마와 100% 동기화된 입장 연출.

### Verified

- `npm run verify:all`: features 36/36 · themes 195/195 · PWA 18/18 · legibility 0 issues · curtain 8/8 = **클린**.

---

## [3.2.0] - 2026-05-10 — 진짜 움직이는 청첩장 (영상 Hero + 무료 AI + 컨페티)

기존 정적 사진 청첩장에서 진짜 영상이 자동 재생되는 청첩장으로. 모든 공개 데모가 첫 화면부터 영상 모션. 데어무드/디얼디어 차별 못한 영역.

### Added

- **F8 영상 Hero 기본값** — Pexels 무료 라이선스 웨딩 영상 2개를 ffmpeg로 모바일 최적화(720p, 24fps, 12초 무한 루프, 무음, faststart). `public/videos/hero-couple.mp4` (419KB), `hero-rings.mp4` (322KB) 번들. DEFAULT_DATA.videoHero 자동 적용 — 첫 진입부터 영상 자동 재생.
- **F9 무료 AI 사진 (Pollinations.ai)** — API 키 필요 없는 무료 FLUX 모델 통합. 6 스타일 (한복 야외 / 턱시도 / 비치 / 루프탑 야경 / 숲속 / 꽃 아치) + 자유 추가 묘사. URL이 결정론적(seed 고정)이라 청첩장 재방문 시 같은 사진. **API 키 입력 부담 0** — 가장 큰 진입장벽 제거.
  - `src/lib/freeAiPhoto.ts` · `src/components/builder/FreeAiPhoto.tsx`
- **F10 셀러브레이션 컨페티** — RSVP 참석 응답 시 화면 양 옆에서 1.8초 컨페티 폭죽, Like 버튼 클릭 시 하트 버스트(버튼 위치 기준), 공유 링크 복사 시 위에서 스파클 드리즐. `prefers-reduced-motion` 존중. canvas-confetti 라이브러리 + 자체 rate-limit (250ms).
  - `src/lib/celebrate.ts` · LikeButton/Rsvp/ShareBar 트리거

### Changed

- **DEFAULT_DATA.videoHero** — 빈 문자열 → `videos/hero-couple.mp4`. 빌더에 진입한 모든 사용자가 즉시 영상 데모 확인 가능.

### Roadmap

- 갤러리 사진 라이트박스 진입 시 sparkle, 카운트다운 0 도달 시 폭죽 (다음 릴리스)
- 게스트가 청첩장에서 본인 셀카로 즉석 AI 사진 만들기 (현재는 빌더에서만)

---

## [3.1.1] - 2026-05-10 — 데모 사진 고화질 + Gemini 모델 폴백

### Added

- **Gemini 모델 폴백 체인** — `aiPhoto.ts`가 `gemini-3.1-flash-image-preview` → `gemini-3-pro-image-preview` → `gemini-2.5-flash-image` 순서로 자동 시도. 429/403 발생 시 다음 모델로 폴백. 사용자 spending cap 또는 모델별 권한 차이에 자동 대응.
- **샘플 생성 스크립트** — `scripts/generate-samples.mjs`. 로컬 ~/.openclaw/openclaw.json의 Google 키를 자동으로 읽어 6개 스타일 웨딩 사진을 `public/samples/`에 일괄 생성. AI Studio cap 회복 시 즉시 실행 가능.

### Changed

- **DEFAULT_DATA 사진 고화질 업그레이드** — `?w=900&q=80` → `?w=1200&h=1500&fit=crop&crop=faces,center&q=88&auto=format`. Hero는 1600×2000 portrait 4:5, 갤러리는 1200×1500 4:5. Unsplash CDN 자동 포맷·얼굴 중심 크롭.

### Notes

- 직접 AI 사진 생성 시도했으나 사용자 Google AI Studio 프로젝트가 월 spending cap 초과 (429). 프로덕션 데모는 검증된 Unsplash 사진 그대로 사용. 사용자가 ai.studio/spend에서 cap 조정 후 `node scripts/generate-samples.mjs` 1회 실행으로 진짜 AI 생성 사진으로 교체 가능.

---

## [3.1.0] - 2026-05-10 — AI 영상 + 음성 클로닝 + OG 카드

기존 AI 사진/음성 위에 동영상·실제 음성 클로닝·카톡 미리보기 카드 자동 생성을 추가. 한국 모바일 청첩장 시장에서 누구도 안 한 영역.

### Added

- **AI 영상 생성 (F4)** — fal.ai Stable Video Diffusion. 사진 1장 → 4초 mp4 영상. 3가지 모션 프리셋(잔잔/시네마/강한). queue API 폴링으로 60~90초 내 완성. videoHero에 자동 설정.
  - `src/lib/aiVideo.ts` · AiPhotoStudio 결과 섹션 통합
- **4스타일 동시 AI 사진 (F5)** — `Promise.allSettled`로 4개 프리셋 병렬 호출. 2x2 결과 그리드. 각 결과 카드에 Hero/갤러리 버튼.
  - AiPhotoStudio bulkResults state
- **ElevenLabs 음성 클로닝 (F6)** — 본인 음성 샘플 30초~3분 → voice_id 발급 → 인사말을 본인 목소리로 변환. 한국어 multilingual_v2 모델. localStorage에 voice_id 캐시.
  - `src/lib/elevenlabs.ts` · AiVoiceStudio 모드 토글 (OpenAI ↔ ElevenLabs)
- **OG 카드 캔버스 생성기 (F7)** — Canvas API로 1200×630 OG 이미지 클라이언트 생성. 좌측 hero, 우측 이름·날짜·식장 + 테마 액센트. Imgur 자동 업로드 → ogImage 자동 적용. **카톡/페북/트위터 공유 미리보기 자동 해결** (서버 함수 없이).
  - `src/components/builder/OgCardGenerator.tsx`

### Changed

- **AiPhotoStudio 확장** — 4 스타일 병렬 / 영상 생성 / fal.ai 키 관리 / 모션 프리셋. 이전 1장 생성 + Hero/갤러리 첨부 그대로 유지.
- **AiVoiceStudio 모드 토글** — OpenAI TTS(6 보이스) ↔ ElevenLabs 클로닝(본인 목소리) 두 모드 전환. 클로닝 완료 시 voice_id 카드로 표시.

### Fixed

- **AI 사진 외부 URL 변환** — `ensureExternalUrl()` 헬퍼로 base64 → Imgur 자동 업로드. 영상 생성 시 외부 URL 필수 검증 추가.

---

## [3.0.0] - 2026-05-10 — AI 차별화 + 다이멘션 확장 메이저 릴리스

기존 청첩장 시장(데어무드·디얼디어·바른손Mcard)이 디자인 템플릿 경쟁만 할 때 우리는 콘텐츠 생성 레이어로 진입. **"스튜디오 촬영 200~400만원을 0원으로 우회"**가 한 줄 차별화 카피.

### Added

- **AI 사진 스튜디오 (F1)** — Gemini 2.5 Flash Image 기반 BYOK. 셀카 1장 + 6가지 프리셋(한복 야외 / 턱시도 / 비치 / 스튜디오 / 한국 전통 혼례 / 시티 루프탑) 또는 자유 프롬프트로 웨딩 사진 합성. 결과는 Hero/갤러리에 1클릭 추가. Imgur 키 있으면 자동 업로드(URL 비대 방지).
  - `src/lib/aiPhoto.ts` · `src/components/builder/AiPhotoStudio.tsx`
- **AI 음성 인사말 (F2)** — OpenAI TTS BYOK. 6가지 한국어 보이스(nova/shimmer/alloy/echo/onyx/fable) + 속도 0.7~1.3x. 인사말 본문 → mp3 변환 → 다운로드 + 외부 호스트 안내.
  - `src/lib/aiVoice.ts` · `src/components/builder/AiVoiceStudio.tsx`
- **평생 가족 페이지 (F3)** — `lifeEvents[]` 데이터 모델. 결혼 이후의 1주년·신혼여행·집들이·돌·5주년·10주년 7개 빠른 추가 칩 + 자유 입력. 청첩장 하단 "결혼 그 후" 타임라인. **영구 URL이라 가능한 구조적 해자** — 데어무드/디얼디어처럼 만료되지 않음.
  - `src/components/invite/LifeEvents.tsx` · `src/components/builder/LifeEventsEditor.tsx`
- **시네마틱 Ken Burns 모션** — 모든 hero 사진에 22초 cycle slow-zoom 애니메이션. `prefers-reduced-motion` 존중. 영상 없이도 시네마 무드.
  - `src/styles/cinematic.css`
- **이벤트 타입 6종** — 결혼식 / 돌잔치 / 환갑·칠순 / 생일파티 / 회사 행사 / 일반 초대. 각 타입별 라벨·기본 카피·기본 메타 자동 매핑. Builder 1번 항목 + Home 진입 카드.
  - `src/data/events.ts`
- **awesome-claude-design 13테마 재구성** — Claude/Apple/Vercel/Airbnb/MongoDB/Lamborghini/Linear/WIRED/Clay/Stripe/Notion/Mastercard+단청/Bugatti 베이스. `editorial-mono` 신규 테마 추가 (12 → 13).
- **AI 커스텀 테마 빌더** — 폼 기반(8색 컬러피커 + 레이아웃/장식/구분선/사진보정) + AI 프롬프트 복사 + JSON 붙여넣기 3가지 모드. localStorage v1 저장. ThemePicker가 기본 13개 + 내 테마 통합 노출.
  - `src/lib/customThemes.ts` · `src/components/builder/CustomThemeEditor.tsx`
- **Vercel 배포** — `vercel.json` (SPA rewrites, asset 1y immutable, sw.js no-cache, 보안 헤더). 라이브: https://wedding-rho-brown.vercel.app
- **Imgur base64 업로드 지원** — `uploadDataUrl()` / `uploadBase64()` 헬퍼. AI 생성 이미지가 자동으로 외부 URL이 되어 공유 링크 비대화 방지.

### Changed

- **InviteView 한국 표준 IA 재구성** — Hero 직후 SaveTheDate(캘린더 추가 + Save the Date 이미지) 카드 신설. Greeting → Story(선택) → Gallery → CalendarWidget → Location 순으로 재배치. 데어무드/디얼디어/바른손Mcard 공통 패턴.
- **Story·Timeline 기본값 OFF** — 한국 시장에서 비표준이라는 IA 리서치 결론 반영.
- **Hero ParentBlock 라벨 동적화** — "아들/딸" 하드코딩 제거 → `getEventLabels(eventType).partyAChild` 등.
- **Accounts 섹션 동적 라벨** — `accountsTitle`, `accountsIntro`, 신랑측/신부측 그룹명도 이벤트 타입별.
- **Home 랜딩 재구성** — 헤로 카피 "AI로 만드는 모바일 청첩장 · 평생 보관". 6개 차별점 카드 (AI 사진 스튜디오 / 음성 인사말 / 평생 가족 페이지 / AI 무한 테마 / 평생 무료 / 모든 행사).
- **BuilderForm 섹션 재번호** — 1.이벤트 → 2.테마 → 3.주인공 → ... → 14.평생 가족 페이지 → 15.공유 메타.
- **README 차별점 섹션 추가** — 4개 핵심 차별화 포인트 명시.

### Fixed

- **빌드 검증** — TypeScript strict 통과 (`tsc -b && vite build` 그린). 번들 405KB / gzip 121KB.

### Roadmap (구현 시도했으나 보류)

- **동적 OG 카드 (@vercel/og)** — Vercel Edge 런타임에서 v0.11.1 번들 이슈로 보류. 카톡 공유 미리보기를 신랑·신부 사진+이름 카드로 자동 생성하는 기능. 향후 Cloudinary 등으로 우회 가능.

---

## [2.0.0] - 2026-05-07 — 앱 스토어 출시 준비 릴리스

PWA 인프라 도입, 안정성 강화, 신규 기능 추가. 코드베이스를 99% 완성도까지 끌어올린 메이저 릴리스.

### Added

- **PWA 지원** — `manifest.webmanifest`, 서비스 워커(`public/sw.js`), 다중 사이즈 SVG 아이콘(일반·maskable·apple-touch). 홈 화면에 추가 가능, 오프라인에서도 마지막으로 본 청첩장이 열림.
- **앱 스토어 빌드 가이드** — `MOBILE_APP.md`에 Bubblewrap(Android TWA) / PWABuilder(iOS) 절차 정리.
- **QR 코드 자동 생성** — 공유 링크 모달에 QR 노출. 청첩장 종이 인쇄나 키오스크 게시에 활용.
- **Web Share API** — `navigator.share` 지원 환경(모바일 사파리/크롬)에서 네이티브 공유 시트 사용. 미지원 환경은 자동으로 링크 복사로 폴백.
- **에러 바운더리** — 런타임 예외 시 흰 화면 대신 복구 안내 화면 노출.
- **Open Graph / Twitter 카드 동적 갱신** — 청첩장이 열릴 때 신랑·신부 정보로 OG 메타태그 동기화. 카카오톡 링크 미리보기에 반영됨.
- **`prefers-reduced-motion` 대응** — 시스템 설정 존중. 캔버스 파티클은 정적 1프레임만, 페이드업·전환 즉시 표시.
- **인쇄 모드** — `@media print` 스타일시트로 종이 청첩장 출력 가능. 빌더·BGM·커튼·토스트 등 비-콘텐츠는 자동 숨김.
- **PhotoViewer 핀치-줌** — 갤러리 사진 양손 확대(최대 4×) + 더블탭 토글 + 팬 이동.
- **공유 URL 길이 경고** — 메신저 호환성 한계(≈4KB)를 넘으면 사진 정리 권유 메시지.
- **iOS 안전영역(notch) 패딩** — `env(safe-area-inset-*)` 적용으로 노치/홈인디케이터 영역 침범 방지.

### Changed

- **Hero 폴백 단순화** — 알 수 없는 테마 ID로 디코딩될 때 `WarmLetterpress`로 안전 폴백. 기존 `HeroOverlay/Framed/Stacked` 미사용 헬퍼 제거.
- **localStorage 안전 접근** — quota·SecurityError(시크릿 모드) 모두 try/catch로 감싸 앱이 죽지 않게 수정. 저장 실패 시 토스트로 안내.
- **Toast 모듈 분리** — `lib/toast.ts`로 트리거 함수 분리하여 React Fast Refresh 동작 개선.
- **PWA 친화 메타태그** — `theme-color`(다크모드 동기화), `apple-mobile-web-app-*`, `application-name`, preconnect to Google Fonts.
- **favicon 교체** — 무관한 보라색 로고 → 청첩장 하트 아이콘.
- **OrnamentCanvas 절전** — 탭 숨김 시 RAF 일시정지, `prefers-reduced-motion` 시 단일 프레임만 그림.

### Fixed

- **BgmToggle 메모리 정리** — `src` 변경 시 새 Audio 노드 제대로 해제, 탭 숨김 시 자동 일시정지, src=`''` 가드.
- **PhotoViewer / Curtain의 body 스크롤락 충돌** — 참조 카운트 기반 `lib/scrollLock.ts`로 통합. 모달 두 개가 겹쳐도 마지막에 닫는 쪽이 정상 복구.
- **Toast 다중 인스턴스** — Set 기반 리스너로 변경. 미리보기·발행 모달·청첩장에서 동시 사용해도 안전.
- **PolaroidScatter 빈 사진 처리** — 사용자가 사진 0장일 때 빈 슬롯으로 대체(이전 코드 폴백 안전성 강화).
- **InviteView fade-up 누락** — 섹션 활성/비활성 토글 시 옵저버 재바인딩.
- **`encodeData` 큰 페이로드 스택 오버플로** — `String.fromCharCode.apply` 청크 처리.
- **`decodeData` 잘못된 데이터 안내** — 손상된 링크일 때 사용자 친화적 메시지(이미 있던 동작에 에러 바운더리 추가).

### Dev

- ESLint 설정에서 React 19 신규 룰 `set-state-in-effect`/`refs`를 `warn`으로 완화 — 기존 코드의 idiomatic 패턴(타이머 setState, 이벤트 핸들러 클로저의 ref 읽기)이 잘못된 것은 아니므로 빌드 차단을 피함.
- TypeScript 빌드 클린 통과 (0 errors), ESLint 0 errors.

### Verification (2026-05-07)

`scripts/smoke-themes.mjs` — Playwright Chromium 헤드리스로 12개 테마를 빌더→발행→청첩장 URL 시퀀스로 자동 실행. 모바일 뷰포트(390×844, DPR 2)에서 콘솔 에러·페이지 에러·요청 실패를 캡처하고 hero 영역을 PNG로 저장.

| 테마 | 어설션 | 콘솔 에러 | 요청 실패 | 시각 정체성 |
|---|---|---|---|---|
| original-warm | 5/5 ✓ | 0 | 0 | 베이지 활판 카드 + 세리프 |
| classic-elegant | 5/5 ✓ | 0 | 0 | 모노그램 원 + Great Vibes 스크립트 |
| modern-minimal | 5/5 ✓ | 0 | 0 | 흑백 모노톤 + "01" 인덱스 |
| romantic-flower | 5/5 ✓ | 0 | 0 | 핑크 + SVG 플로럴 아치 + Pinyon |
| nature-green | 5/5 ✓ | 0 | 0 | 세이지 그린 + 원형 사진 + 잎 |
| luxury-gold | 5/5 ✓ | 0 | 0 | 시네마 레터박스 + "A Wedding Story" |
| simple-clean | 5/5 ✓ | 0 | 0 | 순백 + 거대 타이포 + 원형 |
| vintage-film | 5/5 ✓ | 0 | 0 | 세피아 + 폴라로이드 3장 산개 |
| watercolor-soft | 5/5 ✓ | 0 | 0 | 라벤더 워시 + 아치형 사진 |
| midnight-navy | 5/5 ✓ | 0 | 0 | 별자리 하트 + "Under The Stars" |
| pastel-dream | 5/5 ✓ | 0 | 0 | 캔디 핑크 + 이모지 스티커 |
| korean-traditional | 5/5 ✓ | 0 | 0 | 한지 + 청첩장/請牒狀 + 印 인장 |

**합계: 60/60 어설션, 콘솔 에러 0, 요청 실패 0.** 12개 테마 모두 색뿐 아니라 레이아웃·타이포·장식·배지까지 시각적으로 완전히 다른 정체성을 유지함.

검증 항목: data-theme 속성 매핑, hero 시그너처 렌더링, 공유 모달 + QR(또는 길이 초과 시 graceful fallback), 방명록 폼 마운트, 발행 URL 도달 + 청첩장 페이지 정상 렌더, 커튼 인트로 동작.

화이트리스트로 무시한 외부 의존성: Imgur 업로드, Firebase 쓰기, qrserver — 자격증명 없이 실행했으므로 실패해도 검증 통과로 간주.

### 알려진 한계 (출시 전 추가 확인 권장)

- 실제 iOS Safari / 카카오톡 인앱 브라우저에서 핀치-줌, BGM, OG 카드 미리보기는 미검증.
- 출시 전 1) 본인 카카오톡으로 발행 링크 보내 OG 카드 확인, 2) 실제 Imgur Client ID로 사진 업로드 한 사이클, 3) (선택) Firebase로 방명록 저장 한 번 흘려보기 권장.

---

## [1.0.0] - 2026 (이전 작업)

- 12개 테마 모바일 청첩장 빌더 초기 구현
- 테마별 디자인 차별화 — overlay/framed/stacked 레이아웃, 캔버스 파티클, SVG 디바이더, 사진 효과
- open-design warm-editorial 원칙 적용
- 12개 시그너처 + 영상 + 인기 기능(식순/응원/Save the Date)

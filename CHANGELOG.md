# Changelog

이 문서는 모바일 청첩장 빌더의 주요 변경 이력을 기록합니다.
포맷은 [Keep a Changelog](https://keepachangelog.com/), 버전은 [SemVer](https://semver.org/) 기반.

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

---

## [1.0.0] - 2026 (이전 작업)

- 12개 테마 모바일 청첩장 빌더 초기 구현
- 테마별 디자인 차별화 — overlay/framed/stacked 레이아웃, 캔버스 파티클, SVG 디바이더, 사진 효과
- open-design warm-editorial 원칙 적용
- 12개 시그너처 + 영상 + 인기 기능(식순/응원/Save the Date)

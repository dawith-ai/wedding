# 모바일 앱 (구글 플레이스토어 / 앱스토어) 배포 가이드

이 프로젝트는 PWA(Progressive Web App)로 빌드되며, 추가 코드 변경 없이
**Android(TWA, Trusted Web Activity)** 및 **iOS(WebView 래핑)** 으로
앱 스토어에 제출할 수 있습니다.

---

## 사전 준비

```bash
npm install
npm run build      # dist/ 산출물에 manifest, sw.js, icons 포함
```

`dist/`를 GitHub Pages 등에 배포해서 **HTTPS 공개 URL**을 확보하세요.
이 URL이 앱의 시작 주소가 됩니다.

PWA 자가검증:

1. 배포 URL을 크롬에서 열고 DevTools → Application → Manifest → 오류 없는지 확인
2. Lighthouse → Progressive Web App 카테고리 90+ 확보
3. iOS 사파리에서 "홈 화면에 추가" 시 아이콘이 깨지지 않는지 확인

---

## Android — 구글 플레이스토어

### 방법 1. PWABuilder (권장, 비코딩)

1. https://www.pwabuilder.com 접속
2. 배포 URL 입력 → "Score My PWA"
3. **Package for Stores** → **Android** 선택
4. 옵션 입력:
   - Package ID: `com.yourorg.wedding`
   - App name: `모바일 청첩장`
   - Display mode: `standalone`
   - 서명 키: 새로 생성 또는 기존 키 업로드
5. 다운로드된 `.aab` 파일을 [Google Play Console](https://play.google.com/console) 에 업로드
6. 스토어 설명·스크린샷 작성 → 출시

### 방법 2. Bubblewrap CLI

```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest=https://your-domain.com/manifest.webmanifest
bubblewrap build           # → app-release-bundle.aab 생성
```

자세한 내용: https://github.com/GoogleChromeLabs/bubblewrap

### Digital Asset Links 등록

TWA가 주소창 없이 풀스크린으로 동작하려면 도메인이 앱을 신뢰함을 선언해야 합니다.
앱 빌드 시 자동 생성되는 **assetlinks.json**을 다음 경로에 호스팅:

```
https://your-domain.com/.well-known/assetlinks.json
```

GitHub Pages는 `.well-known` 디렉토리도 그대로 서빙되므로,
`public/.well-known/assetlinks.json` 으로 커밋하면 끝납니다.

---

## iOS — 앱스토어

iOS는 PWA를 직접 받지 않으므로, **WebView를 감싸는 네이티브 래퍼**가 필요합니다.

### 방법 1. PWABuilder iOS 패키지

1. PWABuilder에서 **Package for Stores** → **iOS** 선택
2. 다운로드된 Xcode 프로젝트 열기
3. Bundle ID, 팀 서명 설정 후 Archive → App Store Connect 업로드

### 방법 2. Capacitor 직접 래핑

```bash
npm i @capacitor/core @capacitor/ios
npx cap init "모바일 청첩장" com.yourorg.wedding --web-dir=dist
npx cap add ios
npx cap copy
npx cap open ios
```

iOS는 사파리 WebView이므로 외부 도메인(`api.imgur.com`, `firestore.googleapis.com`)에
대한 ATS 예외를 `Info.plist`의 `NSAppTransportSecurity`에 추가해야 합니다.

---

## 아이콘 준비

플레이스토어와 앱스토어는 **PNG 래스터** 아이콘을 요구합니다.
SVG 원본(`public/icons/icon.svg`)에서 PNG를 일괄 생성:

```bash
# 옵션 A — pwa-asset-generator (Puppeteer 기반, 가장 광범위)
npx pwa-asset-generator public/icons/icon.svg public/icons \
  --icon-only --type png --background "#fbf7ee" --padding "10%"

# 옵션 B — sharp 기반 간단 변환
npm i -D sharp
node -e "require('sharp')('public/icons/icon.svg').resize(512).png().toFile('icon-512.png')"
```

스토어별 필요 사이즈:
- **Play Store**: 512×512 (스토어), 192×192 + 512×512 (앱 내부)
- **App Store**: 1024×1024 (스토어), 180×180 (홈), 120×120 (스폿라이트)

---

## 출시 체크리스트

- [ ] 프라이버시 정책 URL — Imgur·Firebase 사용 시 데이터 처리 명시 필요
- [ ] 앱 설명, 스크린샷 5장 이상
- [ ] 등급 분류(Korea Communications Commission 기준 전체관람가)
- [ ] 앱 아이콘 PNG 일괄 생성 완료
- [ ] Lighthouse PWA 점수 90+
- [ ] 서비스 워커가 오프라인에서 청첩장을 다시 열 수 있는지 검증
- [ ] HTTPS 도메인 확보 (Play Store는 HTTPS 필수)
- [ ] (Android) `.well-known/assetlinks.json` 호스팅
- [ ] (iOS) ATS 예외 설정

---

## 참고 자료

- PWABuilder: https://docs.pwabuilder.com
- Bubblewrap: https://github.com/GoogleChromeLabs/bubblewrap/blob/main/README.md
- Apple App Store Review Guidelines (4.7 항목): https://developer.apple.com/app-store/review/guidelines/
- Google Play TWA 정책: https://developer.chrome.com/docs/android/trusted-web-activity/quick-start

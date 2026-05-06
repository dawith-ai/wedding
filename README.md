# Wedding · 모바일 청첩장 빌더

12가지 테마로 만드는 모바일 청첩장 웹앱. 정보 입력만으로 5분 안에 완성하고 링크 하나로 공유할 수 있습니다.

## 라이브 데모

빌드 후 GitHub Pages에 자동 배포됩니다. `https://<your-username>.github.io/wedding/`

## 주요 기능

- **12개 테마**: 오리지널 웜 / 클래식 엘레강트 / 모던 미니멀 / 로맨틱 플라워 / 내추럴 그린 / 럭셔리 골드 / 심플 클린 / 빈티지 필름 / 수채화 소프트 / 미드나잇 네이비 / 파스텔 드림 / 한국 전통
- **실시간 빌더**: 좌측 폼, 우측 미리보기. 입력 즉시 반영
- **이미지 업로드**: Imgur 익명 업로드 지원 (또는 외부 URL 직접 입력)
- **공유 링크**: 모든 데이터를 URL에 인코딩 → 서버 비용 0원, 영구 작동
- **카운트다운**: 결혼식까지 D-Day 실시간 표시
- **캘린더 추가**: 구글 캘린더 / Apple .ics 다운로드
- **지도 통합**: 카카오맵 / 네이버지도 / T맵 자동 링크
- **계좌번호 복사**: 신랑·신부측 각각 펼침 + 복사 버튼
- **방명록**: 비밀번호 보호, 본인 글 삭제 가능
- **RSVP 참석 응답**: 측 / 인원수 / 식사 / 연락처 / 메시지
- **BGM**: 외부 mp3 URL 입력해서 배경음악
- **커튼 인트로**: 초대장 열기 애니메이션 (선택적)
- **故 표시**: 작고하신 부모님 표시 옵션
- **Firebase 연동(선택)**: 방명록·RSVP를 모든 기기에서 공유

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

## Firebase 설정 (선택)

1. https://console.firebase.google.com/ 에서 프로젝트 생성
2. Firestore Database 생성 (테스트 모드)
3. 프로젝트 설정 → 일반 → 웹 앱 추가 → `apiKey`, `authDomain`, `projectId` 복사
4. 빌더 설정에 입력
5. Firestore 규칙: 개인 청첩장 용도라면 `allow read, write: if true;` 무방

## 데이터 구조

`src/types.ts` 참조. URL에 인코딩되는 데이터는 신랑·신부 정보, 일시, 장소, 인사말, 사진 URL, 계좌, 옵션입니다. 사진 자체는 외부 호스팅(Imgur 등)에 있으므로 URL만 인코딩됩니다.

## 디자인 크레딧

타이포그래피 스케일·top-biased 히어로·드롭 캡·off-white 톤 등 에디토리얼 원칙은
[nexu-io/open-design](https://github.com/nexu-io/open-design)의 `warm-editorial`
스타터 가이드(Apache-2.0)에서 가져왔습니다. 코드 구현은 모두 자체 작성입니다.
자세한 attribution은 [NOTICE](./NOTICE) 참조.

## 라이선스

MIT (소스 코드)


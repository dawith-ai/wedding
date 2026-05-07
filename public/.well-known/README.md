# `.well-known/assetlinks.json`

Android TWA(Trusted Web Activity)가 주소창 없이 풀스크린으로 동작하려면 이
파일에 앱 서명 인증서 SHA-256 지문을 등록해야 합니다.

## 필드 채우는 법

1. PWABuilder 또는 Bubblewrap으로 `.aab` 빌드 시 서명 키를 만들거나 기존 키를 사용합니다.
2. 서명 키의 SHA-256 지문을 추출:
   ```bash
   keytool -list -v -keystore your-key.keystore -alias your-alias
   ```
3. 출력의 `SHA256:` 행을 복사해 본 파일의 `sha256_cert_fingerprints`에 붙여넣습니다.
4. `package_name`을 실제 앱 패키지명으로 변경합니다 (예: `com.dawith.wedding`).

배포 시 GitHub Pages 등 정적 호스팅도 `.well-known/assetlinks.json` 경로를 그대로 서빙합니다.

자세한 사양: https://developers.google.com/digital-asset-links

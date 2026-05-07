import { useEffect, useState } from 'react';
import { showToast } from '../../lib/toast';
import { hasKakaoKey, shareToKakao } from '../../lib/kakao';

interface Props {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
}

export function ShareBar({ title, description, url, imageUrl = '' }: Props) {
  const [kakaoEnabled, setKakaoEnabled] = useState<boolean>(() => hasKakaoKey());

  useEffect(() => {
    function onStorage() {
      setKakaoEnabled(hasKakaoKey());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function copyLink() {
    navigator.clipboard?.writeText(url).then(
      () => showToast('링크가 복사되었습니다'),
      () => showToast('복사에 실패했어요')
    );
  }

  function nativeShare() {
    if (navigator.share) {
      navigator.share({ title, text: description, url }).catch(() => {});
    } else {
      copyLink();
    }
  }

  async function kakaoShare() {
    const ok = await shareToKakao({
      title,
      description,
      imageUrl,
      url,
      buttonTitle: '청첩장 보기',
    });
    if (!ok) {
      showToast('카카오톡 공유 실패 — 키와 도메인을 확인해주세요');
      copyLink();
    }
  }

  return (
    <div className={`share-bar share-bar--${kakaoEnabled ? 'kakao' : 'plain'}`}>
      {kakaoEnabled && (
        <button className="share-kakao" onClick={kakaoShare} type="button">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path
              d="M12 3.4c-5 0-9 3-9 6.6 0 2.3 1.6 4.4 4 5.6l-.7 2.7c-.1.3.2.5.4.4l3.2-2.1c.7.1 1.4.1 2.1.1 5 0 9-3 9-6.6S17 3.4 12 3.4z"
              fill="currentColor"
            />
          </svg>
          카카오톡 공유
        </button>
      )}
      <button onClick={nativeShare} type="button">청첩장 공유하기</button>
      <button onClick={copyLink} type="button">링크 복사</button>
    </div>
  );
}

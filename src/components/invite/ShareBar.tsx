import { showToast } from '../../lib/toast';

interface Props {
  title: string;
  description: string;
  url: string;
}

export function ShareBar({ title, description, url }: Props) {
  function copyLink() {
    navigator.clipboard?.writeText(url).then(
      () => showToast('링크가 복사되었습니다'),
      () => showToast('복사에 실패했어요')
    );
  }

  function share() {
    if (navigator.share) {
      navigator.share({ title, text: description, url }).catch(() => {});
    } else {
      copyLink();
    }
  }

  return (
    <div className="share-bar">
      <button onClick={share}>청첩장 공유하기</button>
      <button onClick={copyLink}>링크 복사</button>
    </div>
  );
}

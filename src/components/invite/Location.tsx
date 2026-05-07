import type { WeddingData } from '../../types';
import { showToast } from '../../lib/toast';

interface Props {
  data: WeddingData;
}

function copy(text: string, msg = '복사되었습니다') {
  navigator.clipboard?.writeText(text).then(
    () => showToast(msg),
    () => showToast('복사에 실패했어요')
  );
}

function defaultKakao(addr: string, venue: string) {
  return `https://map.kakao.com/?q=${encodeURIComponent(venue || addr)}`;
}
function defaultNaver(addr: string, venue: string) {
  return `https://map.naver.com/v5/search/${encodeURIComponent(venue || addr)}`;
}
function defaultTmap(addr: string, venue: string) {
  return `https://tmap.life/?q=${encodeURIComponent(venue || addr)}`;
}

export function Location({ data }: Props) {
  const w = data.wedding;
  return (
    <section className="invite-section">
      <p className="section-title">LOCATION</p>
      <h2 className="section-heading">오시는 길</h2>

      <div className="location-card">
        <p className="location-name">{w.venue}</p>
        {w.venueDetail && <p className="location-detail">{w.venueDetail}</p>}
        <p className="location-address">{w.address}</p>
        <div className="location-buttons">
          <button onClick={() => copy(w.address, '주소가 복사되었습니다')}>주소 복사</button>
          <a href={w.mapKakao || defaultKakao(w.address, w.venue)} target="_blank" rel="noopener">카카오맵</a>
          <a href={w.mapNaver || defaultNaver(w.address, w.venue)} target="_blank" rel="noopener">네이버지도</a>
        </div>
        {w.phone && (
          <p style={{ marginTop: 14, fontSize: 13, color: 'var(--text-muted)' }}>
            <a href={`tel:${w.phone.replace(/[^0-9]/g, '')}`}>📞 {w.phone}</a>
          </p>
        )}
      </div>

      {data.mapImage && <img className="location-map" src={data.mapImage} alt="약도" />}

      <div style={{ marginTop: 14 }}>
        <a
          href={w.mapTmap || defaultTmap(w.address, w.venue)}
          target="_blank"
          rel="noopener"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '10px',
            border: '1px solid var(--divider)',
            background: 'var(--bg-alt)',
            color: 'var(--text)',
            borderRadius: 999,
            fontSize: 13,
          }}
        >
          T맵으로 길찾기
        </a>
      </div>
    </section>
  );
}

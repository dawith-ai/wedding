import { useState } from 'react';
import { PhotoViewer } from './PhotoViewer';

interface Props {
  photos: string[];
}

export function Gallery({ photos }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  if (photos.length === 0) return null;

  return (
    <section className="invite-section">
      <p className="section-title">GALLERY</p>
      <h2 className="section-heading">갤러리</h2>
      <p className="gallery-subtitle">사진을 누르면 크게 볼 수 있어요</p>
      <div className="gallery-grid">
        {photos.map((src, i) => (
          <button key={i} onClick={() => setIndex(i)} aria-label={`사진 ${i + 1}`}>
            <img src={src} alt={`gallery-${i}`} loading="lazy" />
          </button>
        ))}
      </div>
      {index !== null && (
        <PhotoViewer
          photos={photos}
          index={index}
          onClose={() => setIndex(null)}
          onIndex={setIndex}
        />
      )}
    </section>
  );
}

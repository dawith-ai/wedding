interface Props {
  title: string;
  body: string;
  photos: string[];
}

export function Story({ title, body, photos }: Props) {
  const top = photos.slice(0, 2);
  const bottom = photos.slice(2, 4);
  return (
    <section className="invite-section">
      <p className="section-title">OUR STORY</p>
      <h2 className="section-heading">{title}</h2>
      {top.length > 0 && (
        <div className="story-photos">
          {top.map((src, i) => <img key={i} src={src} alt={`story-${i}`} />)}
        </div>
      )}
      <p className="story-text">{body}</p>
      {bottom.length > 0 && (
        <div className="story-photos" style={{ marginTop: 28, marginBottom: 0 }}>
          {bottom.map((src, i) => <img key={i} src={src} alt={`story-b-${i}`} />)}
        </div>
      )}
    </section>
  );
}

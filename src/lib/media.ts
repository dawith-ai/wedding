export function parseYouTubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([\w-]{11})/
  );
  return m ? m[1] : null;
}

export function youtubeEmbedSrc(id: string, opts: { mute?: boolean; loop?: boolean; controls?: boolean } = {}): string {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: opts.mute === false ? '0' : '1',
    loop: opts.loop === false ? '0' : '1',
    playlist: id,
    controls: opts.controls === false ? '0' : '0',
    modestbranding: '1',
    rel: '0',
    playsinline: '1',
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

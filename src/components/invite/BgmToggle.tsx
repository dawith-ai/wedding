import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
}

export function BgmToggle({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = new Audio(src);
    a.loop = true;
    a.volume = 0.45;
    audioRef.current = a;
    return () => {
      a.pause();
      audioRef.current = null;
    };
  }, [src]);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(
        () => setPlaying(true),
        () => setPlaying(false)
      );
    }
  }

  if (!src) return null;
  return (
    <button className="bgm-toggle" onClick={toggle} aria-label="배경음악 토글">
      {playing ? '♫' : '♪'}
    </button>
  );
}

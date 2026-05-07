import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
}

export function BgmToggle({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!src) return;
    const a = new Audio(src);
    a.loop = true;
    a.volume = 0.45;
    a.preload = 'none';
    audioRef.current = a;

    const onEnded = () => setPlaying(false);
    a.addEventListener('ended', onEnded);

    // Pause when the tab is hidden so we don't keep the audio thread hot.
    const onVis = () => {
      if (document.hidden && !a.paused) {
        a.pause();
        setPlaying(false);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      a.removeEventListener('ended', onEnded);
      document.removeEventListener('visibilitychange', onVis);
      a.pause();
      a.src = '';
      audioRef.current = null;
      setPlaying(false);
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
    <button
      className="bgm-toggle"
      onClick={toggle}
      aria-label={playing ? '배경음악 일시정지' : '배경음악 재생'}
      aria-pressed={playing}
    >
      {playing ? '♫' : '♪'}
    </button>
  );
}

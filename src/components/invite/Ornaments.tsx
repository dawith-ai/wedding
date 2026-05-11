import { useEffect, useRef } from 'react';
import type { OrnamentKind } from '../../data/themes';

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  alpha: number;
  hue?: number;
  phase?: number;
}

interface Spec {
  count: number;
  spawn: (w: number, h: number, fromTop: boolean) => Particle;
  draw: (ctx: CanvasRenderingContext2D, p: Particle) => void;
  update: (p: Particle, dt: number, w: number, h: number) => boolean;
}

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function petalSpec(color: [number, number, number]): Spec {
  return {
    count: 24,
    spawn: (w, h, fromTop) => ({
      x: rand(0, w),
      y: fromTop ? rand(-h, 0) : rand(-40, h),
      size: rand(8, 18),
      vx: rand(-12, 12),
      vy: rand(20, 50),
      rot: rand(0, Math.PI * 2),
      vrot: rand(-0.6, 0.6),
      alpha: rand(0.45, 0.85),
      phase: rand(0, Math.PI * 2),
    }),
    draw: (ctx, p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      const [r, g, b] = color;
      const grad = ctx.createLinearGradient(0, -p.size, 0, p.size);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.95)`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.45)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
    update: (p, dt, w, h) => {
      p.phase = (p.phase || 0) + dt * 1.6;
      p.x += p.vx * dt + Math.sin(p.phase) * 0.6;
      p.y += p.vy * dt;
      p.rot += p.vrot * dt;
      if (p.y > h + 30) {
        p.y = -30;
        p.x = rand(0, w);
      }
      return true;
    },
  };
}

function leafSpec(): Spec {
  return {
    count: 18,
    spawn: (w, h, fromTop) => ({
      x: rand(0, w),
      y: fromTop ? rand(-h, 0) : rand(-40, h),
      size: rand(10, 22),
      vx: rand(-8, 8),
      vy: rand(15, 38),
      rot: rand(0, Math.PI * 2),
      vrot: rand(-0.4, 0.4),
      alpha: rand(0.4, 0.75),
      phase: rand(0, Math.PI * 2),
    }),
    draw: (ctx, p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      const grad = ctx.createLinearGradient(-p.size, 0, p.size, 0);
      grad.addColorStop(0, 'rgba(126, 148, 114, 0.92)');
      grad.addColorStop(1, 'rgba(180, 200, 160, 0.55)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-p.size, 0);
      ctx.quadraticCurveTo(0, -p.size * 0.7, p.size, 0);
      ctx.quadraticCurveTo(0, p.size * 0.7, -p.size, 0);
      ctx.fill();
      ctx.strokeStyle = 'rgba(70, 90, 60, 0.5)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(-p.size, 0);
      ctx.lineTo(p.size, 0);
      ctx.stroke();
      ctx.restore();
    },
    update: (p, dt, w, h) => {
      p.phase = (p.phase || 0) + dt * 1.4;
      p.x += p.vx * dt + Math.sin(p.phase) * 0.8;
      p.y += p.vy * dt;
      p.rot += p.vrot * dt;
      if (p.y > h + 30) {
        p.y = -30;
        p.x = rand(0, w);
      }
      return true;
    },
  };
}

function starSpec(): Spec {
  return {
    count: 60,
    spawn: (w, h) => ({
      x: rand(0, w),
      y: rand(0, h),
      size: rand(0.6, 2.2),
      vx: 0,
      vy: 0,
      rot: 0,
      vrot: 0,
      alpha: rand(0.3, 1),
      phase: rand(0, Math.PI * 2),
    }),
    draw: (ctx, p) => {
      const a = (Math.sin((p.phase || 0)) * 0.4 + 0.6) * p.alpha;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = '#fff8d8';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      if (p.size > 1.4) {
        ctx.globalAlpha = a * 0.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 240, 180, 0.3)';
        ctx.fill();
      }
      ctx.restore();
    },
    update: (p, dt) => {
      p.phase = (p.phase || 0) + dt * 1.5;
      return true;
    },
  };
}

function heartSpec(): Spec {
  return {
    count: 18,
    spawn: (w, h, fromTop) => ({
      x: rand(0, w),
      y: fromTop ? rand(-40, h) : h + rand(0, 40),
      size: rand(7, 15),
      vx: rand(-5, 5),
      vy: rand(-24, -10),
      rot: rand(-0.15, 0.15),
      vrot: rand(-0.2, 0.2),
      alpha: rand(0.45, 0.92),
      phase: rand(0, Math.PI * 2),
    }),
    draw: (ctx, p) => {
      const pulse = 1 + Math.sin((p.phase || 0) * 1.2) * 0.06;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale((p.size / 16) * pulse, (p.size / 16) * pulse);
      ctx.globalAlpha = p.alpha;
      const grad = ctx.createRadialGradient(-3, -3, 1, 0, 0, 14);
      grad.addColorStop(0, 'rgba(255, 235, 240, 0.95)');
      grad.addColorStop(0.55, 'rgba(255, 145, 165, 0.92)');
      grad.addColorStop(1, 'rgba(224, 105, 130, 0.78)');
      ctx.fillStyle = grad;
      ctx.shadowColor = 'rgba(224, 105, 130, 0.45)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.bezierCurveTo(-9, -5, -9, -14, 0, -7);
      ctx.bezierCurveTo(9, -14, 9, -5, 0, 5);
      ctx.fill();
      ctx.restore();
    },
    update: (p, dt, w, h) => {
      p.phase = (p.phase || 0) + dt * 1.8;
      p.x += p.vx * dt + Math.sin(p.phase) * 0.55;
      p.y += p.vy * dt;
      p.rot += p.vrot * dt;
      if (p.y < -30) {
        p.y = h + 30;
        p.x = rand(0, w);
        p.alpha = rand(0.45, 0.92);
      }
      return true;
    },
  };
}

function sparkleSpec(): Spec {
  return {
    count: 40,
    spawn: (w, h) => ({
      x: rand(0, w),
      y: rand(0, h),
      size: rand(0.4, 1.6),
      vx: 0,
      vy: 0,
      rot: 0,
      vrot: 0,
      alpha: rand(0.2, 0.9),
      phase: rand(0, Math.PI * 2),
    }),
    draw: (ctx, p) => {
      const a = (Math.sin((p.phase || 0)) * 0.5 + 0.5) * p.alpha;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(p.x, p.y);
      ctx.fillStyle = 'rgba(245, 215, 150, 0.9)';
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -s * 4);
      ctx.lineTo(s, -s);
      ctx.lineTo(s * 4, 0);
      ctx.lineTo(s, s);
      ctx.lineTo(0, s * 4);
      ctx.lineTo(-s, s);
      ctx.lineTo(-s * 4, 0);
      ctx.lineTo(-s, -s);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
    update: (p, dt) => {
      p.phase = (p.phase || 0) + dt * 2.5;
      return true;
    },
  };
}

function pickSpec(kind: OrnamentKind): Spec | null {
  switch (kind) {
    case 'petals':
      return petalSpec([232, 184, 195]);
    case 'leaves':
      return leafSpec();
    case 'stars':
      return starSpec();
    case 'hearts':
      return heartSpec();
    case 'sparkles':
      return sparkleSpec();
    default:
      return null;
  }
}

interface OrnamentProps {
  kind: OrnamentKind;
  className?: string;
}

export function OrnamentCanvas({ kind, className }: OrnamentProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const spec = pickSpec(kind);
    if (!spec) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect reduced-motion preference: render a single static frame, no animation.
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let particles: Particle[] = [];
    let rafId = 0;
    let last = performance.now();
    let alive = true;
    let paused = false;

    function size() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      if (!canvas) return;
      size();
      const rect = canvas.getBoundingClientRect();
      particles = Array.from({ length: spec!.count }, () =>
        spec!.spawn(rect.width, rect.height, false)
      );
    }

    function drawOnce() {
      if (!canvas) return;
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) spec!.draw(ctx!, p);
    }

    function frame(now: number) {
      if (!alive || !canvas) return;
      if (paused) {
        last = now;
        rafId = requestAnimationFrame(frame);
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const rect = canvas.getBoundingClientRect();
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        spec!.update(p, dt, rect.width, rect.height);
        spec!.draw(ctx!, p);
      }
      rafId = requestAnimationFrame(frame);
    }

    init();
    if (reduced) {
      drawOnce();
    } else {
      rafId = requestAnimationFrame(frame);
    }

    const onResize = () => {
      init();
      if (reduced) drawOnce();
    };
    const onVis = () => {
      paused = document.hidden;
      last = performance.now();
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [kind]);

  if (kind === 'film-grain') {
    return <div className={`film-grain-overlay ${className || ''}`} aria-hidden />;
  }
  if (kind === 'watercolor-wash') {
    return (
      <svg
        className={`watercolor-overlay ${className || ''}`}
        aria-hidden
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="wcA" cx="20%" cy="15%" r="40%">
            <stop offset="0%" stopColor="rgba(232, 223, 240, 0.7)" />
            <stop offset="100%" stopColor="rgba(232, 223, 240, 0)" />
          </radialGradient>
          <radialGradient id="wcB" cx="85%" cy="35%" r="35%">
            <stop offset="0%" stopColor="rgba(245, 224, 224, 0.55)" />
            <stop offset="100%" stopColor="rgba(245, 224, 224, 0)" />
          </radialGradient>
          <radialGradient id="wcC" cx="50%" cy="80%" r="45%">
            <stop offset="0%" stopColor="rgba(220, 232, 240, 0.5)" />
            <stop offset="100%" stopColor="rgba(220, 232, 240, 0)" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#wcA)" />
        <rect width="100%" height="100%" fill="url(#wcB)" />
        <rect width="100%" height="100%" fill="url(#wcC)" />
      </svg>
    );
  }
  if (kind === 'dancheong') {
    return <DancheongCorners className={className} />;
  }
  if (kind === 'none') return null;

  return <canvas ref={ref} className={`ornament-canvas ${className || ''}`} aria-hidden />;
}

export function DancheongCorners({ className }: { className?: string }) {
  const corner = (
    <svg viewBox="0 0 60 60" width="72" height="72" aria-hidden>
      <defs>
        <linearGradient id="dc-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a83242" />
          <stop offset="100%" stopColor="#6f1d28" />
        </linearGradient>
        <linearGradient id="dc-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#264c79" />
          <stop offset="100%" stopColor="#0f2849" />
        </linearGradient>
        <linearGradient id="dc-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e5c47e" />
          <stop offset="100%" stopColor="#a07a3a" />
        </linearGradient>
      </defs>
      <g fill="none" strokeWidth="1.6" strokeLinecap="round">
        <path d="M2 22 Q2 2 22 2" stroke="url(#dc-red)" />
        <path d="M7 25 Q7 7 25 7" stroke="url(#dc-blue)" />
        <path d="M12 28 Q12 12 28 12" stroke="url(#dc-gold)" />
        <path d="M2 22 Q2 2 22 2" stroke="rgba(168, 50, 66, 0.25)" strokeWidth="3" />
      </g>
      <g stroke="none">
        <circle cx="15" cy="15" r="2.8" fill="url(#dc-red)" />
        <circle cx="23" cy="14" r="1.5" fill="url(#dc-blue)" />
        <circle cx="14" cy="23" r="1.5" fill="url(#dc-blue)" />
        <circle cx="20" cy="20" r="1" fill="#c9a96e" />
      </g>
    </svg>
  );
  return (
    <div className={`dancheong-corners ${className || ''}`} aria-hidden>
      <div className="dc tl">{corner}</div>
      <div className="dc tr">{corner}</div>
      <div className="dc bl">{corner}</div>
      <div className="dc br">{corner}</div>
    </div>
  );
}

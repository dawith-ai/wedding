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
    count: 16,
    spawn: (w, h, fromTop) => ({
      x: rand(0, w),
      y: fromTop ? rand(-40, h) : h + rand(0, 40),
      size: rand(8, 16),
      vx: rand(-6, 6),
      vy: rand(-30, -12),
      rot: 0,
      vrot: 0,
      alpha: rand(0.5, 0.9),
      phase: rand(0, Math.PI * 2),
    }),
    draw: (ctx, p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.scale(p.size / 16, p.size / 16);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = 'rgba(255, 159, 177, 0.85)';
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.bezierCurveTo(-9, -5, -9, -14, 0, -7);
      ctx.bezierCurveTo(9, -14, 9, -5, 0, 5);
      ctx.fill();
      ctx.restore();
    },
    update: (p, dt, w, h) => {
      p.phase = (p.phase || 0) + dt * 2;
      p.x += p.vx * dt + Math.sin(p.phase) * 0.6;
      p.y += p.vy * dt;
      if (p.y < -30) {
        p.y = h + 30;
        p.x = rand(0, w);
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

    let particles: Particle[] = [];
    let rafId = 0;
    let last = performance.now();
    let alive = true;

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

    function frame(now: number) {
      if (!alive || !canvas) return;
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
    rafId = requestAnimationFrame(frame);
    const onResize = () => init();
    window.addEventListener('resize', onResize);

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
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
    return null;
  }
  if (kind === 'none') return null;

  return <canvas ref={ref} className={`ornament-canvas ${className || ''}`} aria-hidden />;
}

export function DancheongCorners() {
  const corner = (
    <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden>
      <g fill="none" strokeWidth="1.4">
        <path d="M2 18 Q2 2 18 2" stroke="#8b2434" />
        <path d="M6 22 Q6 6 22 6" stroke="#1b3a5c" />
        <path d="M10 26 Q10 10 26 10" stroke="#c9a96e" />
        <circle cx="14" cy="14" r="2.5" fill="#8b2434" stroke="none" />
        <circle cx="22" cy="14" r="1.5" fill="#1b3a5c" stroke="none" />
        <circle cx="14" cy="22" r="1.5" fill="#1b3a5c" stroke="none" />
      </g>
    </svg>
  );
  return (
    <div className="dancheong-corners" aria-hidden>
      <div className="dc tl">{corner}</div>
      <div className="dc tr">{corner}</div>
      <div className="dc bl">{corner}</div>
      <div className="dc br">{corner}</div>
    </div>
  );
}

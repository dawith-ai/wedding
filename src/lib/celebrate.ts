import confetti from 'canvas-confetti';

let lastFire = 0;

function rateLimited(): boolean {
  const now = Date.now();
  if (now - lastFire < 250) return true;
  lastFire = now;
  return false;
}

const PARTY_COLORS = ['#ff85a1', '#ffb6c1', '#fff8dc', '#d4a86b', '#ffd700', '#ff6b9d'];

/** Heart-burst centered at the given DOM element (or screen center). */
export function celebrateHeart(target?: HTMLElement | null) {
  if (rateLimited()) return;
  const origin = elementOrigin(target);
  void confetti({
    particleCount: 24,
    angle: 90,
    spread: 60,
    startVelocity: 35,
    gravity: 0.7,
    ticks: 80,
    scalar: 1.1,
    shapes: ['circle'],
    colors: ['#ff4d6d', '#ff85a1', '#ffb6c1'],
    origin,
    disableForReducedMotion: true,
  });
}

/** Big celebration burst — RSVP confirmed, link copied. */
export function celebrateRsvp() {
  if (rateLimited()) return;
  const duration = 1800;
  const end = Date.now() + duration;
  (function frame() {
    void confetti({
      particleCount: 6,
      angle: 60,
      spread: 60,
      startVelocity: 55,
      origin: { x: 0, y: 0.95 },
      colors: PARTY_COLORS,
      disableForReducedMotion: true,
    });
    void confetti({
      particleCount: 6,
      angle: 120,
      spread: 60,
      startVelocity: 55,
      origin: { x: 1, y: 0.95 },
      colors: PARTY_COLORS,
      disableForReducedMotion: true,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

/** Top-down petal/sparkle drizzle — gallery photo open, share. */
export function celebrateSparkle() {
  if (rateLimited()) return;
  void confetti({
    particleCount: 30,
    spread: 100,
    startVelocity: 25,
    gravity: 0.6,
    ticks: 120,
    scalar: 0.9,
    origin: { x: 0.5, y: 0 },
    colors: ['#ffd700', '#fff8dc', '#fce7f3', '#a78bfa'],
    disableForReducedMotion: true,
  });
}

function elementOrigin(target?: HTMLElement | null): { x: number; y: number } {
  if (!target) return { x: 0.5, y: 0.5 };
  const rect = target.getBoundingClientRect();
  return {
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  };
}

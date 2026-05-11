/* Reference-counted body scroll lock with iOS Safari support.
 * iOS Safari ignores `overflow: hidden` on body for touch-based scroll,
 * so we additionally pin position:fixed and restore scroll position on
 * the final unlock. Multiple components can request a lock without
 * trampling each other. */

let lockCount = 0;
let savedOverflow: string | null = null;
let savedPosition: string | null = null;
let savedTop: string | null = null;
let savedWidth: string | null = null;
let savedScrollY = 0;

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function lockBodyScroll() {
  if (lockCount === 0) {
    const body = document.body;
    savedOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    if (isIOS()) {
      savedScrollY = window.scrollY || window.pageYOffset || 0;
      savedPosition = body.style.position;
      savedTop = body.style.top;
      savedWidth = body.style.width;
      body.style.position = 'fixed';
      body.style.top = `-${savedScrollY}px`;
      body.style.width = '100%';
    }
  }
  lockCount++;
}

export function unlockBodyScroll() {
  if (lockCount === 0) return;
  lockCount--;
  if (lockCount === 0) {
    const body = document.body;
    body.style.overflow = savedOverflow ?? '';
    savedOverflow = null;

    if (isIOS()) {
      body.style.position = savedPosition ?? '';
      body.style.top = savedTop ?? '';
      body.style.width = savedWidth ?? '';
      savedPosition = null;
      savedTop = null;
      savedWidth = null;
      window.scrollTo(0, savedScrollY);
      savedScrollY = 0;
    }
  }
}

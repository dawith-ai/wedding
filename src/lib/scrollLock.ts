/* Reference-counted body scroll lock — multiple components can request a
 * lock without trampling each other on cleanup. Restores the original
 * overflow value once the last lock is released. */

let lockCount = 0;
let savedOverflow: string | null = null;

export function lockBodyScroll() {
  if (lockCount === 0) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount++;
}

export function unlockBodyScroll() {
  if (lockCount === 0) return;
  lockCount--;
  if (lockCount === 0) {
    document.body.style.overflow = savedOverflow ?? '';
    savedOverflow = null;
  }
}

/* External-trigger entry point for the Toast component.
 *
 * Lives in lib/ rather than alongside the component so React Fast Refresh
 * can keep the component module pure (component-only exports). */

type Listener = (msg: string) => void;
const listeners = new Set<Listener>();

export function showToast(msg: string) {
  for (const fn of listeners) {
    try {
      fn(msg);
    } catch {
      /* noop */
    }
  }
}

export function _registerToast(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

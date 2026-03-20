import { useEffect } from 'react';

/** Call handler when Escape is pressed, only while active is true. */
export function useEscapeKey(handler: () => void, active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handler, active]);
}

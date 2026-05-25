import { useEffect, useState } from 'react';
import type { PostHogLazyProviderProps } from '@ui/components';
import { PostHogCaptureContext } from '@/context/PostHogContext';

type CaptureFunction = (event: string, properties?: Record<string, unknown>) => void;

let initialized = false;

export default function PostHogLazyProvider({ children }: PostHogLazyProviderProps) {
  const [capture, setCapture] = useState<CaptureFunction | null>(null);

  useEffect(() => {
    const loadPostHog = () => {
      if (initialized) return;
      initialized = true;
      import('posthog-js').then((ph) => {
        ph.default.init(import.meta.env.VITE_POSTHOG_KEY as string, {
          api_host: import.meta.env.VITE_POSTHOG_HOST as string,
        });
        const captureRef: CaptureFunction = (event, properties) =>
          ph.default.capture(event, properties);
        setCapture(() => captureRef);
      });
    };

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => loadPostHog(), { timeout: 2000 });
    } else {
      setTimeout(loadPostHog, 0);
    }
  }, []);

  return (
    <PostHogCaptureContext.Provider value={capture}>
      {children}
    </PostHogCaptureContext.Provider>
  );
}

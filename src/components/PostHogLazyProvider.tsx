import React, { useEffect, useState, type ReactNode } from 'react';

interface PostHogLazyProviderProps {
  children: ReactNode;
}

export default function PostHogLazyProvider({ children }: PostHogLazyProviderProps) {
  const [PostHogWrapper, setPostHogWrapper] = useState<
    ((props: { children: ReactNode }) => React.ReactElement) | null
  >(null);

  useEffect(() => {
    const loadPostHog = () => {
      Promise.all([import('posthog-js'), import('@posthog/react')]).then(([ph, phReact]) => {
        ph.default.init(import.meta.env.VITE_POSTHOG_KEY as string, {
          api_host: import.meta.env.VITE_POSTHOG_HOST as string,
        });
        const client = ph.default;
        setPostHogWrapper(() => (props: { children: ReactNode }) => (
          <phReact.PostHogProvider client={client}>{props.children}</phReact.PostHogProvider>
        ));
      });
    };

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => loadPostHog(), { timeout: 2000 });
    } else {
      setTimeout(loadPostHog, 0);
    }
  }, []);

  if (PostHogWrapper) {
    return <PostHogWrapper>{children}</PostHogWrapper>;
  }
  return <>{children}</>;
}

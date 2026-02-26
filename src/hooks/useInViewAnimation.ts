import { useRef, useEffect, useState } from 'react';

interface UseInViewAnimationOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export function useInViewAnimation(
  options: UseInViewAnimationOptions = {}
) {
  const { triggerOnce = true, ...observerOptions } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (triggerOnce) {
          observer.unobserve(entry.target);
        }
      } else if (!triggerOnce) {
        setIsInView(false);
      }
    }, { threshold: 0, rootMargin: '0px 0px -100px 0px', ...observerOptions });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [triggerOnce, observerOptions]);

  return { ref, isInView };
}

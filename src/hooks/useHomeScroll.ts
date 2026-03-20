import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { PAGE_TRANSITION_DURATION_MS } from '@config/motion';

export function useHomeScroll() {
  const location = useLocation();
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    const scrollToSection = (id: string) => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo;

    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      if (scrollTo) {
        const t = setTimeout(() => scrollToSection(scrollTo), PAGE_TRANSITION_DURATION_MS);
        return () => clearTimeout(t);
      }
      setTimeout(() => window.scrollTo(0, 0), 0);
      return;
    }

    if (scrollTo) {
      scrollToSection(scrollTo);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.state]);
}

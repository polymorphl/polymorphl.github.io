import { useState, useEffect, useRef } from 'react';
import type { Heading } from '@ui/components';

export function useTableOfContents(
  contentRef: React.RefObject<HTMLElement | null>,
  slug?: string,
  lang?: string
): { headings: Heading[]; activeId: string | null } {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const visibleRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const elements = container.querySelectorAll<HTMLHeadingElement>('h2[id], h3[id]');
    const list: Heading[] = [];
    elements.forEach((el) => {
      const id = el.getAttribute('id');
      if (id) {
        list.push({
          id,
          text: el.textContent?.trim() ?? '',
          level: el.tagName === 'H2' ? 2 : 3
        });
      }
    });
    setHeadings(list);

    if (list.length === 0) return;

    const THRESHOLD = 80; // aligned with rootMargin

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) {
            visibleRef.current.add(id);
          } else {
            visibleRef.current.delete(id);
          }
        });

        let active = list.find((h) => visibleRef.current.has(h.id))?.id ?? null;

        // Between two sections: the section above the viewport (closest one)
        // → scroll up: second-to-last section active; scroll down: section left
        if (active === null) {
          let bestId: string | null = null;
          let bestBottom = -Infinity;
          elements.forEach((el) => {
            const id = el.getAttribute('id');
            if (!id) return;
            const rect = el.getBoundingClientRect();
            if (rect.bottom < THRESHOLD && rect.bottom > bestBottom) {
              bestBottom = rect.bottom;
              bestId = id;
            }
          });
          active = bestId;
          // At top of page (above first section): activate first section
          if (active === null && list[0] && elements[0]) {
            const firstRect = (elements[0] as HTMLElement).getBoundingClientRect();
            if (firstRect.top > THRESHOLD) active = list[0].id;
          }
        }

        if (active !== null) setActiveId(active);
      },
      { rootMargin: `-${THRESHOLD}px 0px -66% 0px`, threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [contentRef, slug, lang]);

  return { headings, activeId };
}

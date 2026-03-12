import { useState, useEffect, useRef } from 'react';
import * as m from 'motion/react-m';
import { useMotionTransition } from '@hooks/useMotionTransition';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentRef: React.RefObject<HTMLElement | null>;
  /** Slug of the current article — used to re-run effect when navigating to a different post */
  slug?: string;
  /** Current language — used to re-run effect when switching language (content changes) */
  lang?: string;
}

export default function TableOfContents({ contentRef, slug, lang }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const visibleRef = useRef<Set<string>>(new Set());
  const transition = useMotionTransition(0.5);

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

  if (headings.length === 0) return null;

  return (
    <m.nav
      aria-label="Table of contents"
      className="hidden lg:block sticky top-28 self-start w-[200px] shrink-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      <ul className="space-y-2 text-sm">
        {headings.map(({ id, text, level }) => (
          <li
            key={id}
            className={level === 3 ? 'pl-3' : ''}
          >
            <a
              href={`#${id}`}
              className={`block py-0.5 transition-colors ${
                activeId === id
                  ? 'text-accent font-medium'
                  : 'text-text-secondary hover:text-accent'
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </m.nav>
  );
}

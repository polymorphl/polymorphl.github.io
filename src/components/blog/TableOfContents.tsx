import * as m from 'motion/react-m';
import { useMotionTransition } from '@hooks/useMotionTransition';
import { useTableOfContents } from '@hooks/useTableOfContents';
import type { TableOfContentsProps } from '@ui/components';

export default function TableOfContents({ contentRef, slug, lang }: TableOfContentsProps) {
  const { headings, activeId } = useTableOfContents(contentRef, slug, lang);
  const transition = useMotionTransition(0.5);

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

import type { MDXComponents } from 'mdx/types';
import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useBodyScrollLock } from '@hooks/useBodyScrollLock';
import { useEscapeKey } from '@hooks/useEscapeKey';
import type { ReactNode } from 'react';
import type { TimelineItem, ArticleImageProps, StepBlockProps } from '@ui/components';
import LinkPreview from './LinkPreview';
import MarkdownBlock from './MarkdownBlock';

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getHeadingText(children: ReactNode): string {
  if (!children) return '';
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(getHeadingText).join('');
  if (typeof children === 'object' && children !== null && 'props' in children) {
    return getHeadingText((children as { props: { children?: ReactNode } }).props.children);
  }
  return String(children);
}

const headingClasses: Record<string, string> = {
  h1: 'text-2xl md:text-3xl font-bold text-text-primary mt-8 mb-4',
  h2: 'text-xl md:text-2xl font-bold text-text-primary mt-10 mb-3',
  h3: 'text-lg font-semibold text-text-primary mt-6 mb-2'
};

const calloutConfigs = {
  info: { icon: 'ℹ️', wrapClass: 'border-accent/30 bg-accent/5', glow: '0 0 20px rgba(37,99,235,0.10)' },
  warning: { icon: '⚠️', wrapClass: 'border-amber-500/30 bg-amber-500/5', glow: '0 0 20px rgba(245,158,11,0.10)' },
  tip: { icon: '💡', wrapClass: 'border-emerald-500/30 bg-emerald-500/5', glow: '0 0 20px rgba(16,185,129,0.10)' },
  money: { icon: '💰', wrapClass: 'border-green-500/30 bg-green-500/5', glow: '0 0 20px rgba(23,230,105,0.10)' },
} as const;

function Callout({ type = 'info', children }: { type?: 'info' | 'warning' | 'tip'; children?: React.ReactNode }) {
  const c = calloutConfigs[type] ?? calloutConfigs.info;
  return (
    <div
      className={`rounded-xl border ${c.wrapClass} my-6 flex gap-3 p-4`}
      style={{ boxShadow: c.glow }}
    >
      <span className="text-base shrink-0 mt-0.5">{c.icon}</span>
      <div className="text-text-secondary flex-1 min-w-0 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{children}</div>
    </div>
  );
}

function PullQuote({ children }: { children?: React.ReactNode }) {
  return (
    <figure className="my-10 px-2">
      <blockquote className="relative border-l-4 border-accent pl-6 py-2">
        <p className="text-xl md:text-2xl font-semibold leading-snug text-text-primary italic before:content-['\201C'] after:content-['\201D']">
          {children}
        </p>
      </blockquote>
    </figure>
  );
}

function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative my-8 ml-2">
      {items.map((item, index) => (
        <div key={`${item.year}-${item.tool}`} className="flex gap-5 mb-0">
          {/* Left column: dot + line */}
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-accent ring-4 ring-accent/20 mt-1 shrink-0" />
            {index < items.length - 1 && (
              <div className="w-px flex-1 bg-border/60 my-2" style={{ minHeight: '2.5rem' }} />
            )}
          </div>
          {/* Right column: content */}
          <div className="pb-8">
            <span className="text-xs font-mono text-accent/80 tracking-widest uppercase">{item.year}</span>
            <h4 className="font-semibold text-text-primary mt-0.5">{item.tool}</h4>
            <p className="text-sm text-text-secondary mt-1">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StepBlock({ step, children }: StepBlockProps) {
  return (
    <div className="flex gap-4 md:gap-6 my-8 first:mt-6 last:mb-4">
      <div className="shrink-0">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold text-sm ring-2 ring-accent/30">
          {step}
        </span>
      </div>
      <div className="flex-1 min-w-0 pt-0.5 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{children}</div>
    </div>
  );
}

function ArticleImage({ src, alt, caption }: ArticleImageProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const closePreview = useCallback(() => setIsPreviewOpen(false), []);

  useEscapeKey(closePreview, isPreviewOpen);
  useBodyScrollLock(isPreviewOpen);

  return (
    <figure className="my-8">
      {src ? (
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="block w-full text-left rounded-xl overflow-hidden border border-border shadow-[var(--shadow-soft)] cursor-zoom-in hover:ring-2 hover:ring-accent/40 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={alt}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="w-full object-cover"
          />
        </button>
      ) : (
        <div
          className="rounded-xl w-full flex items-center justify-center border border-border bg-surface text-text-secondary text-sm font-mono"
          style={{ minHeight: '200px' }}
          aria-label={alt}
        >
          {alt}
        </div>
      )}
      {caption && (
        <figcaption className="text-center text-xs text-text-secondary italic mt-3">{caption}</figcaption>
      )}

      {isPreviewOpen &&
        src &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[1100] backdrop-blur-lg"
              onClick={closePreview}
              aria-hidden="true"
            />
            <div
              className="fixed inset-0 z-[1101] flex flex-col items-center justify-center p-4 cursor-zoom-out"
              role="dialog"
              aria-modal="true"
              aria-label={alt}
              onClick={closePreview}
            >
              <button
                type="button"
                onClick={closePreview}
                className="absolute top-4 right-4 p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-border/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Close preview"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
              <img
                src={src}
                alt={alt}
                className="max-w-[88vw] max-h-[82vh] object-contain shadow-[var(--shadow-floating)]"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </>,
          document.body
        )}
    </figure>
  );
}

const mdxComponents: MDXComponents = {
  h1: (props) => <h1 className={headingClasses.h1} {...props} />,
  h2: (props) => {
    const id = slugify(getHeadingText(props.children)) || undefined;
    return <h2 {...props} id={id} className={`${headingClasses.h2} scroll-mt-28`} />;
  },
  h3: (props) => {
    const id = slugify(getHeadingText(props.children)) || undefined;
    return <h3 {...props} id={id} className={`${headingClasses.h3} scroll-mt-28`} />;
  },
  p: (props) => <p className="text-text-secondary leading-relaxed mb-4" {...props} />,
  a: (props) => <a className="text-[var(--color-accent-on-surface)] hover:underline" {...props} />,
  ul: (props) => <ul className="list-disc list-inside text-text-secondary mb-4 space-y-1" {...props} />,
  ol: (props) => <ol className="list-decimal list-inside text-text-secondary mb-4 space-y-1" {...props} />,
  li: (props) => <li className="ml-2" {...props} />,
  code: (props) => (
    <code
      className="px-1.5 py-0.5 rounded bg-surface border border-border text-text-primary text-sm font-mono"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="p-4 rounded-lg bg-surface border border-border overflow-x-auto text-sm mb-4"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-accent pl-4 italic text-text-secondary my-4"
      {...props}
    />
  ),
  hr: () => <hr className="border-border my-10" />,
  Callout,
  PullQuote,
  Timeline,
  StepBlock,
  ArticleImage,
  LinkPreview,
  MarkdownBlock,
};

export default mdxComponents;

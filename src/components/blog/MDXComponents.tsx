import type { MDXComponents } from 'mdx/types';
import type { TimelineItem, ArticleImageProps } from '@ui/components';

const headingClasses: Record<string, string> = {
  h1: 'text-2xl md:text-3xl font-bold text-text-primary mt-8 mb-4',
  h2: 'text-xl md:text-2xl font-bold text-text-primary mt-10 mb-3',
  h3: 'text-lg font-semibold text-text-primary mt-6 mb-2'
};

const calloutConfigs = {
  info:    { icon: 'ℹ',  wrapClass: 'border-accent/30 bg-accent/5',         glow: '0 0 20px rgba(37,99,235,0.10)'   },
  warning: { icon: '⚠',  wrapClass: 'border-amber-500/30 bg-amber-500/5',   glow: '0 0 20px rgba(245,158,11,0.10)'  },
  tip:     { icon: '💡', wrapClass: 'border-emerald-500/30 bg-emerald-500/5',glow: '0 0 20px rgba(16,185,129,0.10)' },
} as const;

function Callout({ type = 'info', children }: { type?: 'info' | 'warning' | 'tip'; children?: React.ReactNode }) {
  const c = calloutConfigs[type] ?? calloutConfigs.info;
  return (
    <div
      className={`rounded-xl border ${c.wrapClass} my-6 flex gap-3 px-4 py-4`}
      style={{ boxShadow: c.glow }}
    >
      <span className="text-base shrink-0 mt-0.5">{c.icon}</span>
      <div className="text-text-secondary">{children}</div>
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

function ArticleImage({ src, alt, caption }: ArticleImageProps) {
  return (
    <figure className="my-8">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="rounded-xl w-full object-cover border border-border shadow-[var(--shadow-soft)]"
        />
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
    </figure>
  );
}

const mdxComponents: MDXComponents = {
  h1: (props) => <h1 className={headingClasses.h1} {...props} />,
  h2: (props) => <h2 className={headingClasses.h2} {...props} />,
  h3: (props) => <h3 className={headingClasses.h3} {...props} />,
  p: (props) => <p className="text-text-secondary leading-relaxed mb-4" {...props} />,
  a: (props) => <a className="text-accent hover:underline" {...props} />,
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
  ArticleImage
};

export default mdxComponents;

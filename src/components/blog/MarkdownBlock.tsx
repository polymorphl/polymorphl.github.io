import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';
import type { MarkdownBlockProps } from '@ui/components';

const headingClasses: Record<string, string> = {
  h1: 'text-xl md:text-2xl font-bold text-text-primary mt-6 mb-3',
  h2: 'text-lg md:text-xl font-bold text-text-primary mt-5 mb-2',
  h3: 'text-base font-semibold text-text-primary mt-4 mb-2'
};

const components: Components = {
  h1: (props) => <h1 className={headingClasses.h1} {...props} />,
  h2: (props) => <h2 className={headingClasses.h2} {...props} />,
  h3: (props) => <h3 className={headingClasses.h3} {...props} />,
  p: (props) => <p className="text-text-secondary leading-relaxed mb-3" {...props} />,
  a: (props) => <a className="text-accent hover:underline" {...props} />,
  ul: (props) => <ul className="list-disc list-inside text-text-secondary mb-3 space-y-1" {...props} />,
  ol: (props) => <ol className="list-decimal list-inside text-text-secondary mb-3 space-y-1" {...props} />,
  li: (props) => <li className="ml-2" {...props} />,
  code: (props) => (
    <code
      className="px-1.5 py-0.5 rounded bg-surface border border-border text-text-primary text-sm font-mono"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="p-3 rounded-lg bg-surface border border-border overflow-x-auto text-sm mb-3 hljs-code-block"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-accent pl-4 italic text-text-secondary my-3"
      {...props}
    />
  ),
  hr: () => <hr className="border-border my-4" />
};

function MarkdownBlock({
  content: contentProp,
  contentFile,
  language = 'text',
  title,
  variant = 'default',
  downloadUrl,
  downloadLabel = 'Télécharger',
  accordionLabel,
  children
}: MarkdownBlockProps) {
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [fetchedContent, setFetchedContent] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const isAccordion = variant === 'accordion';

  useEffect(() => {
    if (!contentFile) return;
    setFetchError(null);
    fetch(contentFile)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => setFetchedContent(text))
      .catch((err) => setFetchError(err instanceof Error ? err.message : 'Erreur de chargement'));
  }, [contentFile]);

  const content = contentFile
    ? fetchedContent !== null
      ? `\`\`\`${language}\n${fetchedContent}\n\`\`\``
      : contentProp ?? null
    : contentProp ?? null;

  const hasChildren = children !== undefined && children !== null && (Array.isArray(children) ? children.length > 0 : true);

  const baseWrapperClass = variant === 'card' || isAccordion
    ? 'rounded-xl border border-border bg-surface/50 p-4 my-6'
    : 'my-6';

  const contentBlock = (
    <div className="prose-inline [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      {fetchError && (
        <p className="text-red-500 text-sm mb-3">{fetchError}</p>
      )}
      {content === null && contentFile && !fetchError && (
        <p className="text-text-secondary text-sm animate-pulse">Chargement…</p>
      )}
      {hasChildren && children}
      {!hasChildren && content !== null && (
        <ReactMarkdown rehypePlugins={[rehypeHighlight]} components={components}>{content}</ReactMarkdown>
      )}
    </div>
  );

  const headerDownloadUrl = downloadUrl ?? contentFile ?? null;

  if (isAccordion) {
    return (
      <div className={baseWrapperClass}>
        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={() => setAccordionOpen((o) => !o)}
            className="flex-1 min-w-0 flex items-center justify-between gap-3 text-left text-text-primary font-medium hover:text-accent transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded"
            aria-expanded={accordionOpen}
          >
            <span>{accordionLabel ?? title ?? 'Voir plus'}</span>
            <span
              className={`shrink-0 transition-transform duration-200 ${accordionOpen ? 'rotate-180' : ''}`}
              aria-hidden
            >
              ▼
            </span>
          </button>
          {headerDownloadUrl && (
            <a
              href={headerDownloadUrl}
              download
              title={downloadLabel}
              className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              aria-label={downloadLabel}
            >
              ↓
            </a>
          )}
        </div>
        {accordionOpen && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {contentBlock}
            </div>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download
                className="inline-flex items-center justify-center mt-4 bg-accent text-white px-4 py-2 rounded-full font-medium text-sm no-underline shadow-[var(--shadow-button)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-floating)] hover:opacity-90 active:translate-y-0 shrink-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                {downloadLabel}
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={baseWrapperClass}>
      {title && (
        <p className="text-xs font-mono text-accent/80 tracking-widest uppercase mb-3">
          {title}
        </p>
      )}
      {contentBlock}
      {downloadUrl && (
        <a
          href={downloadUrl}
          download
          className="inline-flex items-center justify-center mt-4 bg-accent text-white px-4 py-2 rounded-full font-medium text-sm no-underline shadow-[var(--shadow-button)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-floating)] hover:opacity-90 active:translate-y-0 shrink-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          {downloadLabel}
        </a>
      )}
    </div>
  );
}

export default MarkdownBlock;

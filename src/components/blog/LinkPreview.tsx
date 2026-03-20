import { use, Suspense } from 'react';
import type { PreviewData, LinkPreviewProps } from '@ui/components';

// Module-level promise — shared across all LinkPreview instances on the page
let previewsPromise: Promise<Record<string, PreviewData>> | null = null;

function getPreviewsPromise(): Promise<Record<string, PreviewData>> {
  if (!previewsPromise) {
    previewsPromise = fetch('/link-previews.json')
      .then(r => r.json() as Promise<Record<string, PreviewData>>)
      .catch(() => ({} as Record<string, PreviewData>));
  }
  return previewsPromise;
}

function getFallback(url: string): PreviewData {
  try {
    const urlObj = new URL(url);
    return {
      url,
      title: urlObj.hostname || url,
      description: '',
      image: null,
      favicon: `https://www.google.com/s2/favicons?sz=32&domain=${urlObj.hostname}`,
      domain: urlObj.hostname || url,
    };
  } catch {
    return { url, title: url, description: '', image: null, favicon: null, domain: url };
  }
}

function LinkPreviewContent({ url }: LinkPreviewProps) {
  const previews = use(getPreviewsPromise());
  const preview = previews[url] ?? getFallback(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block my-4 overflow-hidden rounded-lg border border-border/40 bg-background/50 backdrop-blur-sm transition-all hover:border-accent/40 hover:bg-background/80"
    >
      <div className="flex gap-3 p-3">
        {/* Favicon */}
        <div className="flex-shrink-0">
          {preview.favicon && (
            <img
              src={preview.favicon}
              alt=""
              className="h-8 w-8 rounded"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-semibold text-text-primary text-sm group-hover:text-accent transition-colors">
            {preview.title}
          </h4>
          {preview.description && (
            <p className="line-clamp-2 text-xs text-text-secondary mt-0.5">
              {preview.description}
            </p>
          )}
          <p className="text-xs text-text-secondary/70 mt-1 truncate">
            {preview.domain}
          </p>
        </div>

        {/* Image (if available) */}
        {preview.image && (
          <div className="flex-shrink-0 hidden sm:block">
            <img
              src={preview.image}
              alt=""
              className="h-16 w-16 object-cover rounded"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </a>
  );
}

export default function LinkPreview({ url }: LinkPreviewProps) {
  return (
    <Suspense
      fallback={
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 underline text-sm"
        >
          🔗 {url}
        </a>
      }
    >
      <LinkPreviewContent url={url} />
    </Suspense>
  );
}

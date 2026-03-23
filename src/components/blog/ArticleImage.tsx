import { useState, useCallback } from 'react';
import type { ArticleImageProps } from '@ui/components';
import { useBodyScrollLock } from '@hooks/useBodyScrollLock';
import { useEscapeKey } from '@hooks/useEscapeKey';
import Lightbox from './Lightbox';

export default function ArticleImage({ src, alt, caption }: ArticleImageProps) {
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
          className="block w-full text-left rounded-xl border border-border shadow-[var(--shadow-soft)] cursor-zoom-in hover:ring-2 hover:ring-accent/40 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={alt}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="w-full object-cover rounded-xl"
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

      {isPreviewOpen && src && (
        <Lightbox src={src} alt={alt} onClose={closePreview} />
      )}
    </figure>
  );
}

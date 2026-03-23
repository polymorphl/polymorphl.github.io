import { useState, useCallback, useEffect } from 'react';
import type { ImageGridProps } from '@ui/components';
import { useBodyScrollLock } from '@hooks/useBodyScrollLock';
import { useEscapeKey } from '@hooks/useEscapeKey';
import Lightbox from './Lightbox';

export default function ImageGrid({ src1, alt1, src2, alt2, caption }: ImageGridProps) {
  const [previewOpen, setPreviewOpen] = useState<string | null>(null);

  const closePreview = useCallback(() => setPreviewOpen(null), []);

  const toggleImage = useCallback((direction: 'next' | 'prev') => {
    setPreviewOpen((current) => {
      if (direction === 'next') {
        return current === src1 ? src2 : src1;
      } else {
        return current === src2 ? src1 : src2;
      }
    });
  }, [src1, src2]);

  useEscapeKey(() => closePreview(), !!previewOpen);
  useBodyScrollLock(!!previewOpen);

  // Handle arrow keys for navigation
  useEffect(() => {
    if (!previewOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        toggleImage('next');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        toggleImage('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewOpen, toggleImage]);

  return (
    <figure className="my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setPreviewOpen(src1)}
          className="block text-left rounded-xl border border-border shadow-[var(--shadow-soft)] cursor-zoom-in hover:ring-2 hover:ring-accent/40 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={alt1}
        >
          <img src={src1} alt={alt1} loading="lazy" className="w-full object-cover rounded-xl" />
        </button>
        <button
          type="button"
          onClick={() => setPreviewOpen(src2)}
          className="block text-left rounded-xl border border-border shadow-[var(--shadow-soft)] cursor-zoom-in hover:ring-2 hover:ring-accent/40 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={alt2}
        >
          <img src={src2} alt={alt2} loading="lazy" className="w-full object-cover rounded-xl" />
        </button>
      </div>
      {caption && (
        <figcaption className="text-center text-xs text-text-secondary italic mt-3">{caption}</figcaption>
      )}

      {previewOpen && (
        <Lightbox
          src={previewOpen}
          alt={previewOpen === src1 ? alt1 : alt2}
          onClose={closePreview}
        />
      )}
    </figure>
  );
}

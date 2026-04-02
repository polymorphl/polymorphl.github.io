import { createPortal } from 'react-dom';
import type { LightboxProps } from '@ui/components';

export default function Lightbox({ src, alt, onClose }: LightboxProps) {
  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[1100] backdrop-blur-lg"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-[1101] flex flex-col items-center justify-center p-4 cursor-zoom-out"
        role="dialog"
        aria-modal="true"
        aria-label={alt}
        onClick={onClose}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-border/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Close preview"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <use href="/assets/ui/sprite.svg#close" />
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
  );
}

import type { TechDetailBottomSheetProps } from '@ui/components';

export function TechDetailBottomSheet({ name, ariaLabel, closeLabel, onClose, children }: TechDetailBottomSheetProps) {
  return (
    <>
      <div
        className="md:hidden fixed inset-0 z-[1000] bg-background/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className="animate-[bottom-sheet-open_0.3s_cubic-bezier(0.16,1,0.3,1)_both] md:hidden fixed left-0 right-0 bottom-0 z-[1001] max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-border bg-surface shadow-[var(--shadow-floating)] p-4 pb-[max(1.5rem,env(safe-area-inset-bottom,1rem))]"
        style={{ color: 'var(--color-text-primary)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            {name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-border/50 hover:bg-border text-text-secondary hover:text-text-primary transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            aria-label={closeLabel}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </>
  );
}

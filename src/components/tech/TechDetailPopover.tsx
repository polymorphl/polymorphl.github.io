import type { TechDetailPopoverProps } from '@ui/components';

export function TechDetailPopover({ placement, ariaLabel, children }: TechDetailPopoverProps) {
  return (
    <div
      role="dialog"
      aria-label={ariaLabel}
      className={`absolute left-1/2 -translate-x-1/2 z-[1001] min-w-[200px] max-w-[280px] max-h-[70vh] overflow-y-auto p-3 rounded-lg border shadow-[var(--shadow-floating)] ${
        placement === 'above'
          ? 'bottom-full mb-2 animate-[fade-in-up_0.2s_ease-out_both]'
          : 'top-full mt-2 animate-[fade-in-down_0.2s_ease-out_both]'
      }`}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text-primary)',
      }}
    >
      {children}
      <div
        className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${
          placement === 'above' ? '-bottom-1.5 border-r border-b' : '-top-1.5 border-l border-t'
        }`}
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
        aria-hidden
      />
    </div>
  );
}

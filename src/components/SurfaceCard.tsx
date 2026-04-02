import { forwardRef } from 'react';
import type { SurfaceCardProps } from '@ui/components';

const DARK_OPACITY_CLASS = {
  '40': 'dark:bg-surface/40',
  '70': 'dark:bg-surface/70',
} as const;

const SurfaceCard = forwardRef<HTMLDivElement, SurfaceCardProps>(
  ({ className, darkOpacity = '40', variant = 'default', ...props }, ref) => {
    // For bento, border-color is intentionally omitted from the base so each
    // caller can freely apply their own color class without Tailwind v4 cascade conflicts.
    const baseClass =
      variant === 'bento'
        ? 'rounded-xl border [background:var(--bento-card-gradient)]'
        : `rounded-xl border border-border bg-surface/60 ${DARK_OPACITY_CLASS[darkOpacity]}`;
    return (
      <div
        ref={ref}
        className={`${baseClass}${className ? ` ${className}` : ''}`}
        {...props}
      />
    );
  }
);

SurfaceCard.displayName = 'SurfaceCard';
export default SurfaceCard;

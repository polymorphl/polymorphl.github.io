import { forwardRef } from 'react';
import type { SurfaceCardProps } from '@ui/components';

const DARK_OPACITY_CLASS = {
  '40': 'dark:bg-surface/40',
  '70': 'dark:bg-surface/70',
} as const;

const SurfaceCard = forwardRef<HTMLDivElement, SurfaceCardProps>(
  ({ className, darkOpacity = '40', ...props }, ref) => {
    const darkClass = DARK_OPACITY_CLASS[darkOpacity];
    return (
      <div
        ref={ref}
        className={`rounded-xl border border-border bg-surface/60 ${darkClass}${className ? ` ${className}` : ''}`}
        {...props}
      />
    );
  }
);

SurfaceCard.displayName = 'SurfaceCard';
export default SurfaceCard;

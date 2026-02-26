import type { TechPillProps } from '@ui/components';

export default function TechPill({
  name,
  icon,
  viewBox = '0 0 128 128',
  invert,
  iconClass,
  mini,
}: TechPillProps) {
  if (mini) {
    return (
      <div
        className="tech-pill inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface border border-border"
        aria-label={name}
        title={name}
      >
        <svg
          className={`tech-icon w-4 h-4 shrink-0 [fill:currentColor]${invert ? ' invert-dark' : ''}${iconClass ? ` ${iconClass}` : ''}`}
          viewBox={viewBox}
        >
          <use href={`/assets/icons/sprite.svg#${icon}`} />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="tech-item tech-pill inline-flex items-center gap-2 md:gap-2.5 px-3 py-2 md:px-4 md:py-2.5 rounded-full bg-surface border border-border shadow-[var(--shadow-soft)] transition-all duration-200 hover:border-accent hover:shadow-[var(--shadow-floating)] hover:-translate-y-0.5 cursor-pointer text-text-primary"
      aria-label={name}
    >
      <svg
        className={`tech-icon w-4 h-4 md:w-5 md:h-5 shrink-0 [fill:currentColor]${invert ? ' invert-dark' : ''}${iconClass ? ` ${iconClass}` : ''}`}
        viewBox={viewBox}
      >
        <use href={`/assets/icons/sprite.svg#${icon}`} />
      </svg>
      <span className="tech-label text-xs md:text-sm font-medium text-text-primary">{name}</span>
    </div>
  );
}

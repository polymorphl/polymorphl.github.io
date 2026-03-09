import { getTechIconConfig } from '@config/techIcons';
import type { TechPillProps } from '@ui/components';

export default function TechPill({
  name,
  icon: iconProp,
  viewBox: viewBoxProp = '0 0 128 128',
  invert: invertProp,
  iconClass: iconClassProp,
  mini,
  compact,
  iconConfig: iconConfigProp,
}: TechPillProps) {
  const config =
    iconConfigProp !== undefined
      ? iconConfigProp
      : !iconProp && name
        ? getTechIconConfig(name)
        : undefined;
  const icon = iconProp ?? config?.icon;
  const viewBox = config?.viewBox ?? viewBoxProp;
  const invert = invertProp ?? config?.invert;
  const iconClass = iconClassProp ?? config?.iconClass;
  const hasIcon = Boolean(icon);

  if (mini) {
    return (
      <div
        className="tech-pill inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface border border-border"
        aria-label={name}
        title={name}
      >
        {hasIcon ? (
          <svg
            className={`tech-icon w-4 h-4 shrink-0 [fill:currentColor]${invert ? ' invert-dark' : ''}${iconClass ? ` ${iconClass}` : ''}`}
            viewBox={viewBox}
          >
            <use href={`/assets/icons/sprite.svg#${icon}`} />
          </svg>
        ) : (
          <span className="text-xs font-medium text-text-primary truncate max-w-full px-1">{name}</span>
        )}
      </div>
    );
  }

  const compactClasses =
    'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-accent-on-surface/10 text-accent-on-surface border border-accent-on-surface/20';
  const fullClasses =
    'tech-item tech-pill inline-flex items-center gap-2 md:gap-2.5 px-3 py-2 md:px-4 md:py-2.5 rounded-full bg-surface border border-border shadow-[var(--shadow-soft)] transition-all duration-200 hover:border-accent hover:shadow-[var(--shadow-floating)] hover:-translate-y-0.5 cursor-pointer text-text-primary';

  if (compact) {
    return (
      <span
        className={`tech-pill ${compactClasses}${hasIcon ? ' gap-1.5' : ''}`}
        aria-label={name}
      >
        {hasIcon && (
          <svg
            className={`tech-icon w-3.5 h-3.5 shrink-0 [fill:currentColor]${invert ? ' invert-dark' : ''}${iconClass ? ` ${iconClass}` : ''}`}
            viewBox={viewBox}
          >
            <use href={`/assets/icons/sprite.svg#${icon}`} />
          </svg>
        )}
        <span className="tech-label">{name}</span>
      </span>
    );
  }

  return (
    <div className={`${fullClasses}`} aria-label={name}>
      {hasIcon && (
        <svg
          className={`tech-icon w-4 h-4 md:w-5 md:h-5 shrink-0 [fill:currentColor]${invert ? ' invert-dark' : ''}${iconClass ? ` ${iconClass}` : ''}`}
          viewBox={viewBox}
        >
          <use href={`/assets/icons/sprite.svg#${icon}`} />
        </svg>
      )}
      <span className="tech-label text-xs md:text-sm font-medium text-text-primary">{name}</span>
    </div>
  );
}

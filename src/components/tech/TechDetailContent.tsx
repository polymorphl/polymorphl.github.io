import type { TechDetailContentProps } from '@ui/components';
import { formatExperienceDuration } from '@lib/formatPeriod';

const LINK_CLASS =
  'hover:underline focus:underline focus:outline-none rounded px-0.5 -mx-0.5 focus-visible:ring-2 focus-visible:ring-[var(--color-accent-on-surface)] focus-visible:ring-offset-1';
const LINK_STYLE = { color: 'var(--color-accent-on-surface)' as const };

export function TechDetailContent({ name, experience, projectEntries, t, onLinkClick }: TechDetailContentProps) {
  return (
    <>
      <div className="text-sm font-semibold text-[var(--color-text-primary)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        {name}
      </div>
      {experience.years > 0 && (
        <p className="text-xs text-[var(--color-text-secondary)] mb-2">
          {formatExperienceDuration(experience.years, t)}
        </p>
      )}
      {experience.companies.length > 0 && (
        <div className="mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] opacity-90">
            {t('tech.career')}
          </span>
          <p className="text-xs text-[var(--color-text-primary)] mt-0.5">
            {experience.companies.map((c, i) => (
              <span key={c.name}>
                {i > 0 && ', '}
                {c.website ? (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={LINK_CLASS}
                    style={LINK_STYLE}
                    onClick={onLinkClick}
                  >
                    {c.name}
                  </a>
                ) : (
                  <button
                    type="button"
                    className={`${LINK_CLASS} bg-transparent border-0 p-0 font-inherit cursor-pointer`}
                    style={LINK_STYLE}
                    onClick={(e) => {
                      onLinkClick?.(e);
                      document.getElementById('career')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {c.name}
                  </button>
                )}
              </span>
            ))}
          </p>
        </div>
      )}
      {projectEntries.length > 0 && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] opacity-90">
            {t('tech.projects')}
          </span>
          <p className="text-xs text-[var(--color-text-primary)] mt-0.5">
            {projectEntries.map((p, i) => (
              <span key={p.id}>
                {i > 0 && ', '}
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK_CLASS}
                  style={LINK_STYLE}
                  onClick={onLinkClick}
                >
                  {p.title}
                </a>
              </span>
            ))}
          </p>
        </div>
      )}
      {experience.years === 0 && experience.companies.length === 0 && projectEntries.length === 0 && (
        <p className="text-xs text-[var(--color-text-secondary)]">{t('tech.noDetails')}</p>
      )}
    </>
  );
}

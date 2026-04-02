import { formatExperienceDuration } from '@lib/formatPeriod';
import type { TechListRowProps } from '@ui/components';
import type { ProjectConfig } from '@domain/project';

const SENIOR_YEARS_THRESHOLD = 4;

export function TechListRow({ item, experience, projectsById, t }: TechListRowProps) {
  const years = experience?.years ?? 0;
  const yearsLabel = years ? formatExperienceDuration(years, t) : null;

  const companies = experience?.companies ?? [];
  const projects = (experience?.projectIds ?? [])
    .map((id) => projectsById.get(id))
    .filter((p): p is ProjectConfig => p != null);

  return (
    <div className="group flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-alt/50 transition-colors">
      {item.icon ? (
        <svg
          className={`w-5 h-5 mt-0.5 shrink-0 [fill:currentColor]${item.invert ? ' invert-dark' : ''}${item.iconClass ? ` ${item.iconClass}` : ''}`}
          viewBox={item.viewBox ?? '0 0 128 128'}
        >
          <use href={`/assets/icons/sprite.svg#${item.icon}`} />
        </svg>
      ) : (
        <span className="w-5 h-5 mt-0.5 shrink-0" />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-text-primary leading-tight">{item.name}</span>
          {yearsLabel && (
            <span
              className={`text-[11px] font-medium rounded-full px-2 py-0.5 leading-tight whitespace-nowrap border ${
                years >= SENIOR_YEARS_THRESHOLD
                  ? 'text-accent-on-surface bg-accent/10 border-accent/20'
                  : 'text-text-secondary bg-surface border-border'
              }`}
            >
              {yearsLabel}
            </span>
          )}
        </div>

        {(companies.length > 0 || projects.length > 0) && (
          <p className="text-xs text-text-secondary/60 mt-0.5 leading-snug flex flex-wrap gap-x-1">
            {companies.map((c, i) => (
              <span key={c.name} className="inline-flex items-center gap-x-1">
                {i > 0 && <span className="text-text-secondary/30">·</span>}
                {c.website ? (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-text-secondary transition-colors underline-offset-2 hover:underline"
                  >
                    {c.name}
                  </a>
                ) : (
                  <span>{c.name}</span>
                )}
              </span>
            ))}
            {projects.map((p, i) => (
              <span key={p.id} className="inline-flex items-center gap-x-1">
                {(companies.length > 0 || i > 0) && <span className="text-text-secondary/30">·</span>}
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors underline-offset-2 hover:underline"
                >
                  {p.title}
                </a>
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}

import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '@hooks/useLanguage';
import TechPill from '@components/TechPill';
import type { TechItem } from '@domain/tech';
import type { TechExperience } from '@lib/computeTechExperience';
import { formatExperienceDuration } from '@lib/formatPeriod';
import { PROJECTS } from '@config/projects';

interface TechStackPillProps extends TechItem {
  experience?: TechExperience | null;
}

const HOVER_DELAY_MS = 200;
const HOVER_LEAVE_DELAY_MS = 150;

export default function TechStackPill({
  name,
  icon,
  viewBox,
  invert,
  iconClass,
  experience,
}: TechStackPillProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasDetails = experience && (experience.years > 0 || experience.companies.length > 0 || experience.projectIds.length > 0);

  useEffect(() => {
    if (!hasDetails) return;
    if (isHovering) {
      hoverTimeoutRef.current = setTimeout(() => setOpen(true), HOVER_DELAY_MS);
    } else {
      leaveTimeoutRef.current = setTimeout(() => setOpen(false), HOVER_LEAVE_DELAY_MS);
    }
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, [hasDetails, isHovering]);

  useEffect(() => {
    if (!hasDetails || !open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hasDetails, open]);

  const handleMouseEnter = () => {
    if (hasDetails) setIsHovering(true);
  };
  const handleMouseLeave = () => {
    if (hasDetails) setIsHovering(false);
  };
  const handleClick = () => {
    if (hasDetails) setOpen((prev) => !prev);
  };

  const projectEntries = experience?.projectIds.map((id) => PROJECTS.find((pr) => pr.id === id)).filter(Boolean) ?? [];

  if (!hasDetails) {
    return (
      <TechPill
        name={name}
        icon={icon}
        viewBox={viewBox}
        invert={invert}
        iconClass={iconClass}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div role="button" tabIndex={0} onClick={handleClick} onKeyDown={(e) => e.key === 'Enter' && handleClick()} aria-expanded={open} aria-haspopup="dialog" aria-label={name}>
        <TechPill
          name={name}
          icon={icon}
          viewBox={viewBox}
          invert={invert}
          iconClass={iconClass}
        />
      </div>

      {open && (
        <div
          role="dialog"
          aria-label={t('tech.popoverLabel', { tech: name })}
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-[1001] min-w-[200px] max-w-[280px] p-3 rounded-lg border shadow-[var(--shadow-floating)] animate-[fade-in-up_0.2s_ease-out_both]"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        >
          <div className="text-sm font-semibold text-[var(--color-text-primary)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {name}
          </div>
          {experience!.years > 0 && (
            <p className="text-xs text-[var(--color-text-secondary)] mb-2">
              {formatExperienceDuration(experience!.years, t)}
            </p>
          )}
          {experience!.companies.length > 0 && (
            <div className="mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] opacity-90">
                {t('tech.career')}
              </span>
              <p className="text-xs text-[var(--color-text-primary)] mt-0.5">
                {experience!.companies.map((c, i) => (
                  <span key={c.name}>
                    {i > 0 && ', '}
                    {c.website ? (
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline focus:underline focus:outline-none rounded px-0.5 -mx-0.5 focus-visible:ring-2 focus-visible:ring-[var(--color-accent-on-surface)] focus-visible:ring-offset-1"
                        style={{ color: 'var(--color-accent-on-surface)' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {c.name}
                      </a>
                    ) : (
                      <a
                        href="#career"
                        className="hover:underline focus:underline focus:outline-none rounded px-0.5 -mx-0.5 focus-visible:ring-2 focus-visible:ring-[var(--color-accent-on-surface)] focus-visible:ring-offset-1"
                        style={{ color: 'var(--color-accent-on-surface)' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          document.getElementById('career')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        {c.name}
                      </a>
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
                {(projectEntries as NonNullable<typeof projectEntries[number]>[]).map((p, i) => (
                  <span key={p.id}>
                    {i > 0 && ', '}
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline focus:underline focus:outline-none rounded px-0.5 -mx-0.5 focus-visible:ring-2 focus-visible:ring-[var(--color-accent-on-surface)] focus-visible:ring-offset-1"
                      style={{ color: 'var(--color-accent-on-surface)' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {p.title}
                    </a>
                  </span>
                ))}
              </p>
            </div>
          )}
          {experience!.years === 0 && experience!.companies.length === 0 && projectEntries.length === 0 && (
            <p className="text-xs text-[var(--color-text-secondary)]">{t('tech.noDetails')}</p>
          )}
          {/* Arrow */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 rotate-45 border-r border-b"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
            aria-hidden
          />
        </div>
      )}
    </div>
  );
}

import * as m from 'motion/react-m';
import { logoIn } from '@config/motion';
import type { CareerLogoProps } from '@ui/components';
import { useTracking } from '@hooks/useTracking';

export default function CareerLogo({ entry, transition, visitWebsiteLabel }: CareerLogoProps) {
  const { trackCareerCompanyClicked } = useTracking();
  const logoClassName = `career-logo shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden p-1.5 flex items-center justify-center border border-border shadow-[var(--shadow-soft)] transition-all duration-300 hover:scale-105 hover:shadow-[var(--shadow-floating)] ${
    entry.logoLight ? 'bg-zinc-800 dark:bg-zinc-700' : 'bg-white dark:bg-zinc-200'
  }`;

  const logoContent = entry.logoId ? (
    <svg className="w-full h-full object-contain" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <use href={`/assets/companies/sprite.svg#${entry.logoId}`} />
    </svg>
  ) : (
    <span className="w-full h-full rounded bg-zinc-200 dark:bg-zinc-400" aria-hidden />
  );

  if (entry.website) {
    return (
      <m.a
        href={entry.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${entry.company} - ${visitWebsiteLabel}`}
        onClick={() => trackCareerCompanyClicked(entry.company, entry.website!, 'logo')}
        className={`${logoClassName} cursor-pointer block`}
        variants={logoIn}
        transition={transition}
      >
        {logoContent}
      </m.a>
    );
  }

  return (
    <m.div className={logoClassName} variants={logoIn} transition={transition}>
      {logoContent}
    </m.div>
  );
}

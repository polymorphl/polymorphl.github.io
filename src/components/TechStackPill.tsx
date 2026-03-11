import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@hooks/useLanguage';
import { useMobile } from '@hooks/useMobile';
import { useTechDetailState } from '@hooks/useTechDetailState';
import TechPill from '@components/TechPill';
import { TechDetailContent } from '@components/tech/TechDetailContent';
import { TechDetailPopover } from '@components/tech/TechDetailPopover';
import { TechDetailBottomSheet } from '@components/tech/TechDetailBottomSheet';
import type { TechItem } from '@domain/tech';
import type { TechExperience } from '@lib/computeTechExperience';
import { PROJECTS } from '@config/projects';

interface TechStackPillProps extends TechItem {
  experience?: TechExperience | null;
}

export default function TechStackPill({
  name,
  icon,
  viewBox,
  invert,
  iconClass,
  experience,
}: TechStackPillProps) {
  const { t } = useLanguage();
  const isMobile = useMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  const hasDetails =
    experience &&
    (experience.years > 0 || experience.companies.length > 0 || experience.projectIds.length > 0);

  const { open, placement, handleMouseEnter, handleMouseLeave, handleClick, close } = useTechDetailState(
    !!hasDetails,
    isMobile,
    containerRef
  );

  const projectEntries =
    experience?.projectIds
      .map((id) => PROJECTS.find((pr) => pr.id === id))
      .filter(Boolean) ?? [];

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    close();
  };

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

  const detailContent = (
    <TechDetailContent
      name={name}
      experience={experience!}
      projectEntries={projectEntries as import('@config/projects').ProjectConfig[]}
      t={t}
      onLinkClick={handleLinkClick}
    />
  );

  return (
    <>
      <div
        ref={containerRef}
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={name}
        >
          <TechPill
            name={name}
            icon={icon}
            viewBox={viewBox}
            invert={invert}
            iconClass={iconClass}
          />
        </div>

        {open && !isMobile && (
          <TechDetailPopover
            placement={placement}
            ariaLabel={t('tech.popoverLabel', { tech: name })}
          >
            {detailContent}
          </TechDetailPopover>
        )}
      </div>

      {open && isMobile &&
        createPortal(
          <TechDetailBottomSheet
            name={name}
            ariaLabel={t('tech.popoverLabel', { tech: name })}
            closeLabel={t('nav.close')}
            onClose={close}
          >
            {detailContent}
          </TechDetailBottomSheet>,
          document.body
        )}
    </>
  );
}

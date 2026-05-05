import { useState, useMemo, useRef, useEffect } from 'react';
import * as m from 'motion/react-m';
import { useTracking } from '@hooks/useTracking';
import { containerStagger08 } from '@config/motion';
import { PROJECTS } from '@config/projects';
import FeaturedCard from '@components/project/FeaturedCard';
import CompactCard from '@components/project/CompactCard';

const featuredProjects = PROJECTS.filter((p) => p.featured);
const compactProjects = PROJECTS.filter((p) => !p.featured);

export default function ProjectsGrid() {
  const { trackProjectClicked } = useTracking();
  const [hoveredCompactId, setHoveredCompactId] = useState<string | null>(null);
  const isCompactHovered = hoveredCompactId !== null;
  const bentoRef = useRef<HTMLDivElement>(null);
  const [lockedHeight, setLockedHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Delay until CSS layout (aspect-ratio, flex sizing) has fully settled
    const timer = setTimeout(() => {
      if (bentoRef.current) {
        setLockedHeight(bentoRef.current.offsetHeight);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const compactGridStyle = useMemo(() => {
    if (!hoveredCompactId) return {};
    const idx = compactProjects.findIndex((p) => p.id === hoveredCompactId);
    if (idx === -1) return {};
    const cols = compactProjects.map((_, i) => (i === idx ? '2.5fr' : '1fr'));
    return { gridTemplateColumns: cols.join(' ') };
  }, [hoveredCompactId]);

  return (
    <m.div
      ref={bentoRef}
      className="flex flex-col gap-4 md:gap-5 w-full max-w-4xl mx-auto overflow-hidden"
      style={{ height: lockedHeight }}
      variants={containerStagger08}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -50px 0px' }}
    >
      {featuredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {featuredProjects.map((p) => (
            <FeaturedCard
              key={p.id}
              p={p}
              isCompressed={isCompactHovered}
              onClick={() => trackProjectClicked(p.id, p.title, p.url)}
            />
          ))}
        </div>
      )}
      {compactProjects.length > 0 && (
        <div
          className="grid grid-cols-2 md:grid-cols-4 items-start gap-3 md:gap-4"
          style={{
            transition: 'grid-template-columns 0.35s ease',
            ...compactGridStyle,
          }}
          onPointerLeave={() => setHoveredCompactId(null)}
        >
          {compactProjects.map((p) => (
            <CompactCard
              key={p.id}
              p={p}
              isExpanded={hoveredCompactId === p.id}
              onPointerEnter={() => setHoveredCompactId(p.id)}
              onClick={() => trackProjectClicked(p.id, p.title, p.url)}
            />
          ))}
        </div>
      )}
    </m.div>
  );
}

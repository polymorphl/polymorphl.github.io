import { useRef, useState, useEffect } from 'react';

const HOVER_DELAY_MS = 200;
const HOVER_LEAVE_DELAY_MS = 150;
const MIN_SPACE_FOR_VERTICAL_PLACEMENT = 240;

type Placement = 'above' | 'below';

function chooseVerticalPlacement(spaceAbove: number, spaceBelow: number): Placement {
  const canPlaceAbove = spaceAbove >= MIN_SPACE_FOR_VERTICAL_PLACEMENT;
  const canPlaceBelow = spaceBelow >= MIN_SPACE_FOR_VERTICAL_PLACEMENT;
  if (canPlaceAbove && canPlaceBelow) return spaceAbove >= spaceBelow ? 'above' : 'below';
  if (canPlaceAbove) return 'above';
  if (canPlaceBelow) return 'below';
  return spaceAbove >= spaceBelow ? 'above' : 'below';
}

export function useTechDetailState(hasDetails: boolean, isMobile: boolean, containerRef: React.RefObject<HTMLDivElement | null>) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<Placement>('above');
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hasDetails || isMobile) return;
    if (isHovering) {
      hoverTimeoutRef.current = setTimeout(() => setOpen(true), HOVER_DELAY_MS);
    } else {
      leaveTimeoutRef.current = setTimeout(() => setOpen(false), HOVER_LEAVE_DELAY_MS);
    }
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, [hasDetails, isHovering, isMobile]);

  useEffect(() => {
    if (!hasDetails || !open || isMobile) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hasDetails, open, isMobile, containerRef]);

  useEffect(() => {
    if (!open || !containerRef.current || isMobile) return;
    const compute = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setPlacement(chooseVerticalPlacement(rect.top, window.innerHeight - rect.bottom));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [open, isMobile, containerRef]);

  const handleMouseEnter = () => hasDetails && !isMobile && setIsHovering(true);
  const handleMouseLeave = () => hasDetails && !isMobile && setIsHovering(false);
  const handleClick = () => hasDetails && setOpen((prev) => !prev);
  const close = () => setOpen(false);

  return { open, placement, handleMouseEnter, handleMouseLeave, handleClick, close };
}

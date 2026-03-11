import { useLocation } from 'react-router-dom';
import type { PageTransitionProps } from '@ui/components';

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}

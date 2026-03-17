import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useLocation, useRoutes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useMotionTransition } from '@hooks/useMotionTransition';
import { pageTransition, PAGE_TRANSITION_DURATION_MS } from '@config/motion';

const HomePage = lazy(() => import('@pages/HomePage'));
const BlogPage = lazy(() => import('@pages/BlogPage'));
const BlogPostPage = lazy(() => import('@pages/BlogPostPage'));
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));

const routes = [
  { index: true, element: <HomePage /> },
  { path: '/en', element: <HomePage /> },
  { path: '/fr', element: <HomePage /> },
  { path: '/blog', element: <BlogPage /> },
  { path: '/blog/:slug', element: <BlogPostPage /> },
  { path: '/:lang/blog', element: <BlogPage /> },
  { path: '/:lang/blog/:slug', element: <BlogPostPage /> },
  { path: '*', element: <NotFoundPage /> },
];

function PageTransitionFallback() {
  return (
    <div className="min-w-0 w-full min-h-[60vh] animate-pulse" aria-hidden>
      <div className="h-8 w-48 rounded bg-surface/60 mb-6" />
      <div className="h-4 w-full rounded bg-surface/40 mb-2" />
      <div className="h-4 w-[80%] rounded bg-surface/40" />
    </div>
  );
}

export default function PageTransition() {
  const location = useLocation();
  const element = useRoutes(routes);
  const transition = useMotionTransition(PAGE_TRANSITION_DURATION_MS / 1000);

  return (
    <Suspense fallback={<PageTransitionFallback />}>
      <AnimatePresence mode="wait">
        <m.div
          key={location.pathname}
          initial={pageTransition.initial}
          animate={pageTransition.animate}
          exit={pageTransition.exit}
          transition={transition}
          className="min-w-0 w-full"
        >
          {element}
        </m.div>
      </AnimatePresence>
    </Suspense>
  );
}

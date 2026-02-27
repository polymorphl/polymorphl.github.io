import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useLanguage } from '@hooks/useLanguage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FluidAurora from './components/FluidAurora';
import type { Lang } from '@domain/i18n';

const HomePage = lazy(() => import('./pages/HomePage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));

// Detect and sync language from URL path
function LanguageSyncProvider() {
  const location = useLocation();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // Extract language from URL path (e.g., /en/blog or /fr/blog)
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const potentialLang = pathSegments[0];

    if (potentialLang === 'en' || potentialLang === 'fr') {
      setLanguage(potentialLang as Lang);
    }
  }, [location.pathname, setLanguage]);

  return null;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <LanguageSyncProvider />
        <Navbar />
        <main className="max-w-[1000px] mx-auto flex-1 flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 min-h-full pt-24 md:pt-28 pb-12 px-4 md:px-6 lg:px-8 text-left w-full md:items-start">
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              {/* Language-prefixed routes */}
              <Route path="/:lang/blog" element={<BlogPage />} />
              <Route path="/:lang/blog/:slug" element={<BlogPostPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </BrowserRouter>
      <FluidAurora />
    </>
  );
}

export default App;

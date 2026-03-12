import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'motion/react';
import { useLanguage } from '@hooks/useLanguage';
import { ThemeProvider } from '@components/ThemeProvider';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FluidAurora from './components/FluidAurora';
import PageTransition from './components/PageTransition';
import type { Lang } from '@domain/i18n';

// Restore target path from session storage (set by generated OG pages)
function PathRestorer() {
  const navigate = useNavigate();

  useEffect(() => {
    const targetPath = sessionStorage.getItem('__targetPath');
    if (targetPath) {
      sessionStorage.removeItem('__targetPath');
      navigate(targetPath, { replace: true });
    }
  }, [navigate]);

  return null;
}

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
    <ThemeProvider>
      <LazyMotion features={domAnimation} strict>
        <BrowserRouter>
          <PathRestorer />
          <LanguageSyncProvider />
          <Navbar />
          <main className="max-w-[1000px] mx-auto flex-1 flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 min-h-full pt-24 md:pt-28 pb-12 px-4 md:px-6 lg:px-8 text-left w-full md:items-start">
            <div className="md:col-span-2 min-w-0 w-full">
              <Routes>
                <Route path="*" element={<PageTransition />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </BrowserRouter>
        <FluidAurora />
      </LazyMotion>
    </ThemeProvider>
  );
}

export default App;

import { useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { LazyMotion } from 'motion/react';
import { useLanguage } from '@hooks/useLanguage';
import { ThemeProvider } from '@components/ThemeProvider';
import { ThemedBackground } from '@components/ThemedBackground';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageTransition from './components/PageTransition';

const loadMotionFeatures = () => import('motion/react').then(m => m.domAnimation);

// Restore target path from session storage (set by generated OG pages)
function PathRestorer() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const targetPath = sessionStorage.getItem('__targetPath');
    if (targetPath) {
      sessionStorage.removeItem('__targetPath');
      navigate(targetPath, { replace: true });
    }
  }, [navigate]);

  return null;
}

// Sync language from URL path
function AppEffects() {
  const { pathname } = useLocation();
  useLanguage(pathname);
  return null;
}

function App() {
  return (
    <ThemeProvider>
      <LazyMotion features={loadMotionFeatures} strict>
        <BrowserRouter>
          <PathRestorer />
          <AppEffects />
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
        <ThemedBackground />
      </LazyMotion>
    </ThemeProvider>
  );
}

export default App;

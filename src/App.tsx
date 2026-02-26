import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import FluidAurora from './components/FluidAurora';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <main className="max-w-[1000px] mx-auto flex-1 flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 min-h-full pt-24 md:pt-28 pb-12 px-4 md:px-6 lg:px-8 text-left w-full md:items-start">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
      <FluidAurora />
    </>
  );
}

export default App;

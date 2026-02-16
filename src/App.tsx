import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';

const Home = lazy(() => import('@/pages/Home'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Albums = lazy(() => import('@/pages/Albums'));
const Submit = lazy(() => import('@/pages/Submit'));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="size-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/submit" element={<Submit />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
      <Toaster />
    </BrowserRouter>
  );
}

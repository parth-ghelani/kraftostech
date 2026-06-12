import React, { useState, useEffect, Suspense, lazy } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Loading from './components/Loading';
import Navigation from './components/common/Navigation';
import CustomCursor from './components/common/CustomCursor';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Services from './components/sections/Services';

const TechStack = lazy(() => import('./components/sections/TechStack'));
const Portfolio = lazy(() => import('./components/sections/Portfolio'));
const Testimonials = lazy(() => import('./components/sections/Testimonials'));
const Contact = lazy(() => import('./components/sections/Contact'));

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    // Configure Lenis with linear interpolation (lerp) for maximum responsiveness and buttery smoothness
    const lenis = new Lenis({
      lerp: 0.08,             // Decelerates fluidly and reacts instantly to input (no duration delay)
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,   // Controlled, elegant scrolling speed
      touchMultiplier: 1.5,
    });

    // Control scrolling based on loading state
    if (isLoading) {
      lenis.stop(); // Lock scroll events during loading phase
    } else {
      lenis.start(); // Unlock scroll once loaded
    }

    // Sync Lenis with GSAP's ticker — single rAF loop for both systems
    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0); // Prevent GSAP from skipping frames

    // Sync ScrollTrigger with Lenis scroll updates
    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-accent selection:text-black">
      {/* Premium custom reveal cursor with digital character particles trail */}
      <CustomCursor />

      {/* Loading Overlay (z-40) - fades out on complete, leaving the global logo (z-60) in place */}
      {isLoading && <Loading onComplete={() => setIsLoading(false)} />}

      {/* Navigation (contains the global flying logo at z-[60] on top of the loading overlay) */}
      <Navigation isLoading={isLoading} />

      {/* Main Content (z-10) */}
      <main className="overflow-x-hidden w-full relative">
        <Hero />
        <About />
        <Services />
        <Suspense fallback={null}>
          <TechStack />
          <Portfolio />
          <Testimonials />
          <Contact />
        </Suspense>
      </main>
    </div>
  );
}

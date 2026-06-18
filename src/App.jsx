import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Loading from './components/Loading';
import Navigation from './components/common/Navigation';
import CustomCursor from './components/common/CustomCursor';
import FloatingCareersButton from './components/common/FloatingCareersButton';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Services from './components/sections/Services';

const TechStack = lazy(() => import('./components/sections/TechStack'));
const Portfolio = lazy(() => import('./components/sections/Portfolio'));
const Testimonials = lazy(() => import('./components/sections/Testimonials'));
const Careers = lazy(() => import('./components/sections/Careers'));
const JobDescription = lazy(() => import('./components/sections/JobDescription'));
const Contact = lazy(() => import('./components/sections/Contact'));

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCareersPage, setIsCareersPage] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash.startsWith('#careers');
    }
    return false;
  });
  const [currentJobId, setCurrentJobId] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      return hash.startsWith('#careers/') ? hash.replace('#careers/', '') : null;
    }
    return null;
  });

  const isCareersPageRef = useRef(isCareersPage);

  useEffect(() => {
    isCareersPageRef.current = isCareersPage;
  }, [isCareersPage]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const wasCareers = isCareersPageRef.current;
      const nowCareers = hash.startsWith('#careers');
      
      setIsCareersPage(nowCareers);
      setCurrentJobId(hash.startsWith('#careers/') ? hash.replace('#careers/', '') : null);

      if (nowCareers) {
        window.scrollTo(0, 0);
      } else if (wasCareers && !nowCareers) {
        if (hash && hash !== '#') {
          const targetId = hash.substring(1);
          setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 200);
        } else {
          window.scrollTo(0, 0);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Scroll to section on initial load once loading animation finishes
  useEffect(() => {
    if (!isLoading) {
      const hash = window.location.hash;
      if (hash && !hash.startsWith('#careers')) {
        const targetId = hash.substring(1);
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 400);
      }
    }
  }, [isLoading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [isCareersPage]);

  // Prevent browser from restoring scroll position on reload
  useEffect(() => {
    if (window.history && window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

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

    window.lenis = lenis; // Expose globally to prevent competing smooth scroll loops in subcomponents

    // Control scrolling based on loading state
    if (isLoading) {
      lenis.stop(); // Lock scroll events during loading phase
    } else {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
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
      window.lenis = null;
    };
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-accent selection:text-black">
      {/* Premium custom reveal cursor with digital character particles trail */}
      <CustomCursor />

      {/* Loading Overlay (z-40) - fades out on complete, leaving the global logo (z-60) in place */}
      {isLoading && <Loading onComplete={() => setIsLoading(false)} />}

      {/* Floating Work With Us Button */}
      {!isLoading && (
        <FloatingCareersButton
          isCareers={isCareersPage}
          onClick={() => {
            if (isCareersPage) {
              window.location.hash = '';
            } else {
              window.location.hash = 'careers';
            }
          }}
        />
      )}

      {isCareersPage ? (
        <Suspense fallback={<Loading />}>
          <main className="overflow-x-hidden w-full relative pt-24 min-h-screen flex flex-col justify-between">
            {/* Minimal top-left logo link for the Careers Page */}
            <div className="fixed top-[26px] left-8 md:left-12 z-50">
              <a href="#" className="cursor-pointer">
                <span className="text-xl md:text-2xl font-sans font-black tracking-[-0.04em] text-[#F2ECE6]">
                  <span className="font-['Outfit'] font-[900]">Kraftos</span>
                  <span className="font-serif italic font-[700]">tech.</span>
                </span>
              </a>
            </div>
            
            {currentJobId ? (
              <JobDescription jobId={currentJobId} onBack={() => { window.location.hash = 'careers'; }} />
            ) : (
              <Careers />
            )}
          </main>
        </Suspense>
      ) : (
        <>
          {/* Navigation (contains the global flying logo at z-[60] on top of the loading overlay) */}
          <Navigation isLoading={isLoading} />

          {/* Main Content (z-10) */}
          <main className="overflow-x-hidden w-full relative">
            <Hero isLoading={isLoading} />
            <About />
            <Services />
            <Suspense fallback={null}>
              <TechStack />
              <Portfolio />
              <Testimonials />
              <Contact />
            </Suspense>
          </main>
        </>
      )}
    </div>
  );
}

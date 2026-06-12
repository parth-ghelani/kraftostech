import React, { useRef, useEffect } from 'react';
import { KraftosEffect } from '../ui/google-gemini-effect';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Manifesto() {
  const sectionRef = useRef(null);
  const svgWrapRef = useRef(null);

  useEffect(() => {
    if (!svgWrapRef.current) return;

    // SVG container fade-in on scroll
    const svgTl = gsap.timeline({
      scrollTrigger: {
        trigger: svgWrapRef.current,
        start: "top 90%",
        end: "top 40%",
        scrub: 1,
      }
    });

    svgTl.fromTo(svgWrapRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });

    return () => {
      svgTl.kill();
    };
  }, []);

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative w-full z-10 overflow-hidden"
    >
      {/* Atmospheric gradient overlay — continues Hero red, fades to black */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black" />
      </div>

      {/* ── SVG Path Drawing ── */}
      <div 
        ref={svgWrapRef}
        className="relative z-10 w-full pt-[20vh] md:pt-[25vh]"
        style={{ opacity: 0 }}
      >
        <div className="relative w-full h-[50vh] md:h-[70vh]">
          <KraftosEffect 
            scrollTriggerRef={sectionRef} 
            className="absolute inset-0 !relative !top-0 w-full h-full"
          />
        </div>
      </div>

      {/* Bottom breathing space */}
      <div className="h-[10vh] md:h-[15vh]" />
    </section>
  );
}

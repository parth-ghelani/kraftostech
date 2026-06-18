import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Disable custom cursor on mobile/touch devices for clean UX
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    if (!containerRef.current) return;
    
    // Clear any previous items
    containerRef.current.innerHTML = '';

    // Create central dot element
    const dot = document.createElement('div');
    dot.className = "fixed top-0 left-0 w-2 h-2 bg-[#ff7a1a] rounded-full pointer-events-none z-[10001] -translate-x-1/2 -translate-y-1/2 mix-blend-difference";
    containerRef.current.appendChild(dot);

    // Create outer ring element
    const ring = document.createElement('div');
    ring.className = "fixed top-0 left-0 w-8 h-8 border border-[#ff7a1a]/60 rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 mix-blend-difference";
    containerRef.current.appendChild(ring);

    // Instantly bind coordinates to GSAP quickTo for zero-lag smooth tracking (120Hz compatible)
    const dotXTo = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const dotYTo = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });
    const ringXTo = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const ringYTo = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    const handleMouseMove = (e) => {
      dotXTo(e.clientX);
      dotYTo(e.clientY);
      ringXTo(e.clientX);
      ringYTo(e.clientY);
    };

     // Magnify cursor over buttons, anchors, and clickable elements
    const handleMouseOver = (e) => {
      const target = e.target;
      const projectCard = target.closest('.project-card');
      const isClickable = target.closest('a') || 
                          target.closest('button') || 
                          target.closest('input') || 
                          target.closest('textarea') || 
                          target.closest('.cursor-pointer') ||
                          window.getComputedStyle(target).cursor === 'pointer';

      if (projectCard) {
        gsap.to(ring, { scale: 2.2, borderColor: "#ff7a1a", backgroundColor: "rgba(255, 122, 26, 0.12)", duration: 0.3, ease: "power2.out" });
        gsap.to(dot, { scale: 0.4, backgroundColor: "#ffffff", duration: 0.3, ease: "power2.out" });
      } else if (isClickable) {
        gsap.to(ring, { scale: 1.6, borderColor: "#ff7a1a", backgroundColor: "transparent", duration: 0.2, ease: "power2.out" });
        gsap.to(dot, { scale: 0.5, backgroundColor: "#ffffff", duration: 0.2, ease: "power2.out" });
      } else {
        gsap.to(ring, { scale: 1.0, borderColor: "rgba(255, 122, 26, 0.6)", backgroundColor: "transparent", duration: 0.2, ease: "power2.out" });
        gsap.to(dot, { scale: 1.0, backgroundColor: "#ff7a1a", duration: 0.2, ease: "power2.out" });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    // Inject global stylesheet to override system cursor
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      body, a, button, select, input, textarea, [role="button"], .cursor-pointer {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      if (document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="pointer-events-none fixed inset-0 z-[10000] overflow-hidden" 
    />
  );
}

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * A custom hook to reveal elements with a subtle fade-in and slide-up on scroll.
 * @param {React.RefObject} element - The React ref of the element to animate.
 * @param {object} options - Custom animation options.
 */
export function useScrollReveal(element, options = {}) {
  useEffect(() => {
    if (!element?.current) return;

    const el = element.current;
    
    // Set initial state
    gsap.set(el, {
      opacity: 0,
      y: options.y !== undefined ? options.y : 30,
    });

    const anim = gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: options.start || 'top 85%',
        once: true,
      },
      duration: options.duration || 1.0,
      opacity: 1,
      y: 0,
      delay: options.delay || 0,
      ease: options.ease || 'power2.out',
    });

    // Cleanup animation and scroll trigger
    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    };
  }, [element, options.y, options.start, options.duration, options.delay, options.ease]);
}

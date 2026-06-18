import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExpandableTabs } from '@/components/ui/expandable-tabs';
import { Home, Sparkles, Briefcase, FileText, User, Mail, Terminal, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

// --- MagneticText Component ---
function MagneticText({ className }) {
  const containerRef = useRef(null);
  const circleRef = useRef(null);
  const innerTextRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef();

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    const timer = setTimeout(updateSize, 100);
    window.addEventListener("resize", updateSize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  useEffect(() => {
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.15);
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.15);

      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px) translate(-50%, -50%)`;
      }

      if (innerTextRef.current) {
        innerTextRef.current.style.transform = `translate(${-currentPos.current.x}px, ${-currentPos.current.y}px)`;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseEnter = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePos.current = { x, y };
    currentPos.current = { x, y };
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const scrollToTop = () => {
    const element = document.getElementById('home');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={scrollToTop}
      className={cn("relative inline-flex items-center justify-center cursor-pointer select-none", className)}
    >
      {/* Base text layer - original text */}
      <h2 className="text-xl md:text-2xl select-none leading-none tracking-[-0.04em] text-[#F2ECE6] whitespace-nowrap">
        <span className="font-['Outfit'] font-[900]">
          {"Kraftos".split("").map((char, index) => (
            <span 
              key={`k-${index}`}
              className="inline-block transition-all duration-300 hover:scale-120 hover:-translate-y-1 hover:text-[#ff7a1a] cursor-pointer"
            >
              {char}
            </span>
          ))}
        </span>
        <span className="font-serif italic font-[700]">
          {"tech.".split("").map((char, index) => (
            <span 
              key={`t-${index}`}
              className="inline-block transition-all duration-300 hover:scale-120 hover:-translate-y-1 hover:text-[#ff7a1a] cursor-pointer"
            >
              {char}
            </span>
          ))}
        </span>
      </h2>

      <div
        ref={circleRef}
        className="absolute top-0 left-0 pointer-events-none rounded-full bg-[#ff7a1a] overflow-hidden"
        style={{
          width: isHovered ? 80 : 0,
          height: isHovered ? 80 : 0,
          transition: "width 0.5s cubic-bezier(0.33, 1, 0.68, 1), height 0.5s cubic-bezier(0.33, 1, 0.68, 1)",
          willChange: "transform, width, height",
        }}
      >
        <div
          ref={innerTextRef}
          className="absolute flex items-center justify-center"
          style={{
            width: containerSize.width,
            height: containerSize.height,
            top: "50%",
            left: "50%",
            willChange: "transform",
          }}
        >
          <h2 className="text-xl md:text-2xl select-none leading-none tracking-[-0.04em] text-[#070707] whitespace-nowrap">
            <span className="font-['Outfit'] font-[900]">
              {"Kraftos".split("").map((char, index) => (
                <span 
                  key={`ki-${index}`}
                  className="inline-block transition-all duration-300 hover:scale-120 hover:-translate-y-1 hover:text-[#ff7a1a] cursor-pointer"
                >
                  {char}
                </span>
              ))}
            </span>
            <span className="font-serif italic font-[700]">
              {"tech.".split("").map((char, index) => (
                <span 
                  key={`ti-${index}`}
                  className="inline-block transition-all duration-300 hover:scale-120 hover:-translate-y-1 hover:text-[#ff7a1a] cursor-pointer"
                >
                  {char}
                </span>
              ))}
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
}

export default function Navigation({ isLoading }) {
  const [activeSection, setActiveSection] = useState('home');
  const navWrapperRef = useRef(null);
  const navInnerRef = useRef(null);
  const globalLogoRef = useRef(null);
  const globalLogoImgRef = useRef(null);
  const cardGlowRef = useRef(null);
  const placeholderRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const brandLogoRef = useRef(null);
  const isScrollingRef = useRef(false);

  const tabs = [
    { title: "Home", icon: Home, id: "home" },
    { title: "About", icon: User, id: "about" },
    { title: "Services", icon: Briefcase, id: "services" },
    { type: "placeholder" }, // Center logo placeholder
    { title: "Tech", icon: Terminal, id: "tech" },
    { title: "Work", icon: FileText, id: "portfolio" },
    { title: "Contact", icon: Mail, id: "contact" },
  ];

  // Track active section using IntersectionObserver (no scroll listener — purely async)
  useEffect(() => {
    if (isLoading) return;

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0
    };

    const handleIntersection = (entries) => {
      if (isScrollingRef.current) return;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'contact-banner') {
            setActiveSection('contact');
          } else {
            setActiveSection(entry.target.id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    tabs.forEach(tab => {
      if (tab.id) {
        const el = document.getElementById(tab.id);
        if (el) observer.observe(el);
      }
    });

    const bannerEl = document.getElementById('contact-banner');
    if (bannerEl) observer.observe(bannerEl);

    return () => observer.disconnect();
  }, [isLoading]);

  // Use GSAP ScrollTrigger for nav visibility — zero React re-renders during scroll
  useEffect(() => {
    if (!navWrapperRef.current || !navInnerRef.current) return;

    // Start hidden
    gsap.set(navWrapperRef.current, { pointerEvents: 'none' });
    gsap.set(navInnerRef.current, { opacity: 0, scale: 1.0 });

    const mm = gsap.matchMedia();

    // Desktop: Fade in after scrolling past 60px, scale down slightly to 0.92
    mm.add("(min-width: 768px)", () => {
      ScrollTrigger.create({
        start: 60,
        end: 300,
        onUpdate: (self) => {
          const progress = self.progress;
          // Opacity: 0 -> 1 in first 40% of range
          const opacity = Math.min(1, progress / 0.4);
          // Scale: 1.0 -> 0.92
          const scale = 1.0 - (progress * 0.08);
          
          navInnerRef.current.style.opacity = opacity;
          navInnerRef.current.style.transform = `scale(${scale})`;
        },
        onEnter: () => {
          navWrapperRef.current.style.pointerEvents = 'auto';
        },
        onLeaveBack: () => {
          navWrapperRef.current.style.pointerEvents = 'none';
          navInnerRef.current.style.opacity = 0;
        },
      });
    });

    // Mobile: Simple toggle past 60px scroll (no continuous style computations on scroll)
    mm.add("(max-width: 767px)", () => {
      gsap.to(navInnerRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        scrollTrigger: {
          start: 60,
          toggleActions: "play none none reverse",
          onEnter: () => {
            navWrapperRef.current.style.pointerEvents = 'auto';
          },
          onLeaveBack: () => {
            navWrapperRef.current.style.pointerEvents = 'none';
            navInnerRef.current.style.opacity = 0;
          }
        }
      });
    });

    return () => mm.revert();
  }, []);

  // GSAP ScrollTrigger timeline for flying logo and glow opacity
  useEffect(() => {
    if (isLoading || !globalLogoRef.current || !cardGlowRef.current) return;

    // Helper to calculate translation offset relative to placeholder center
    const getLogoTargetTranslation = () => {
      if (!globalLogoRef.current || !placeholderRef.current) {
        return { x: 0, y: 48 };
      }
      
      const placeholderRect = placeholderRef.current.getBoundingClientRect();
      const originX = window.innerWidth / 2;
      
      const targetX = placeholderRect.left + placeholderRect.width / 2;
      const targetY = placeholderRect.top + placeholderRect.height / 2;
      
      return {
        x: targetX - originX,
        y: targetY
      };
    };

    // Initialize GSAP percentage coordinates and base states with screen center dynamic Y anchor
    gsap.set(globalLogoRef.current, { 
      xPercent: -50, 
      yPercent: -50, 
      y: () => window.innerHeight / 2 + 60, 
      scale: 1 
    });

    if (globalLogoImgRef.current) {
      gsap.set(globalLogoImgRef.current, { rotation: 0 });
    }

    // 1. Fade in the orange glow smoothly on Hero page entry
    gsap.fromTo(cardGlowRef.current, 
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.8,
        ease: "power2.out",
        delay: 0.4
      }
    );

    const mm = gsap.matchMedia();

    // Desktop: flying logo and glow opacity + scroll-scrubbed rotation
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "300px top",
          scrub: 0.5,
        }
      });

      tl.to(globalLogoRef.current, {
        x: () => getLogoTargetTranslation().x,
        y: () => getLogoTargetTranslation().y,
        scale: 0.14,
        ease: "power2.inOut"
      }, 0);

      tl.fromTo(cardGlowRef.current, 
        { opacity: 1 },
        { opacity: 0, ease: "power2.inOut" },
        0
      );

      // Scroll-scrubbed rotation for the global logo image across the entire page (Desktop only)
      if (globalLogoImgRef.current) {
        const rotationTl = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
          }
        });
        rotationTl.to(globalLogoImgRef.current, {
          rotation: 360 * 6,
          ease: "none"
        });
      }
    });

    // Mobile: flying logo and glow opacity (no whole-page scroll-scrubbed rotation)
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "300px top",
          scrub: 0.5,
        }
      });

      tl.to(globalLogoRef.current, {
        x: () => getLogoTargetTranslation().x,
        y: () => getLogoTargetTranslation().y,
        scale: 0.18,
        ease: "power2.inOut"
      }, 0);

      tl.fromTo(cardGlowRef.current, 
        { opacity: 1 },
        { opacity: 0, ease: "power2.inOut" },
        0
      );
    });

    return () => mm.revert();
  }, [isLoading]);

  // ScrollTrigger to fade in/out top-left logo when scrolling away from Hero
  useEffect(() => {
    if (isLoading || !brandLogoRef.current) return;

    // Start hidden
    gsap.set(brandLogoRef.current, { opacity: 0, pointerEvents: 'none' });

    const mm = gsap.matchMedia();

    // Desktop: Scroll-scrubbed brand logo fade
    mm.add("(min-width: 768px)", () => {
      ScrollTrigger.create({
        trigger: "#about",
        start: "top 90%",
        end: "top 50%",
        onUpdate: (self) => {
          const opacity = self.progress;
          if (brandLogoRef.current) {
            brandLogoRef.current.style.opacity = opacity;
            brandLogoRef.current.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
          }
        },
        onLeaveBack: () => {
          if (brandLogoRef.current) {
            brandLogoRef.current.style.opacity = 0;
            brandLogoRef.current.style.pointerEvents = 'none';
          }
        }
      });
    });

    // Mobile: Simple toggle fade-in/out on entering #about (no scroll scrubbing)
    mm.add("(max-width: 767px)", () => {
      gsap.to(brandLogoRef.current, {
        opacity: 1,
        duration: 0.3,
        scrollTrigger: {
          trigger: "#about",
          start: "top 90%",
          toggleActions: "play none none reverse",
          onEnter: () => {
            if (brandLogoRef.current) brandLogoRef.current.style.pointerEvents = 'auto';
          },
          onLeaveBack: () => {
            if (brandLogoRef.current) {
              brandLogoRef.current.style.opacity = 0;
              brandLogoRef.current.style.pointerEvents = 'none';
            }
          }
        }
      });
    });

    return () => mm.revert();
  }, [isLoading]);

  const handleTabChange = (index) => {
    if (index === null) return;
    const tab = tabs[index];
    if (tab.type === 'placeholder') return;

    const sectionId = tab.id;
    setActiveSection(sectionId);

    isScrollingRef.current = true;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  const activeTab = tabs.findIndex(tab => tab.id === activeSection);

  return (
    <>
      {/* Brand logo in the left top of the website - fades in when scrolling away from Hero */}
      <div 
        ref={brandLogoRef}
        className="fixed top-[26px] left-8 md:left-12 z-50 pointer-events-none hidden md:block"
        style={{ opacity: 0 }}
      >
        <MagneticText />
      </div>
      {/* Global Flying Glass Logo - Locked horizontally to center: left-50% */}
      <div 
        ref={globalLogoRef}
        className="fixed top-0 left-1/2 z-[60] pointer-events-none"
        style={{ 
          transformOrigin: "center center",
          transform: "translate(-50%, -50%) translate3d(0, 50svh, 0) translate3d(0, 60px, 0) scale(1)"
        }}
      >
        <div className="relative w-44 h-44 md:w-56 md:h-56 flex items-center justify-center">
          
          {/* Ambient Orange Glow - high-performance radial gradient to prevent bounding box blur clipping */}
          <div 
            ref={cardGlowRef}
            className="absolute -inset-24 bg-[radial-gradient(circle_at_center,rgba(255,122,26,0.18)_0%,transparent_70%)] rounded-full pointer-events-none z-0 opacity-0" 
            style={{ 
              opacity: 0,
              display: isLoading ? 'none' : 'block'
            }}
          />
          
          {/* Logo Image - clean & borderless */}
          <img
            ref={globalLogoImgRef}
            src="/images/glass_logo.png"
            className="w-full h-full object-contain relative z-10 select-none pointer-events-none"
            alt="Kraftostech Glass Logo"
          />
        </div>
      </div>

      {/* Navigation Bar Container */}
      <div 
        ref={navWrapperRef}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <nav
          ref={navInnerRef}
          className="pointer-events-auto w-full max-w-[560px] flex justify-center"
          style={{ opacity: 0, willChange: 'opacity, transform' }}
        >
          <ExpandableTabs
            tabs={tabs}
            activeTab={activeTab !== -1 ? activeTab : 0}
            onChange={handleTabChange}
            placeholderRef={placeholderRef}
            activeColor="text-[#070707] bg-white/92 font-semibold"
            className="bg-black/75 backdrop-blur-md border border-white/[0.08] rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.5)] p-1.5 w-full max-w-[560px]"
          />
        </nav>
      </div>
    </>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FloatingCareersButton({ isCareers, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isCareers) {
      // Always visible on the Careers page
      gsap.set(buttonRef.current, { opacity: 1, pointerEvents: 'auto' });
      return;
    }

    // Hide initially on the homepage
    gsap.set(buttonRef.current, { opacity: 0, pointerEvents: 'none' });

    const mm = gsap.matchMedia();

    // Desktop: Scroll-scrubbed fade-in
    mm.add("(min-width: 768px)", () => {
      ScrollTrigger.create({
        start: 60,
        end: 300,
        onUpdate: (self) => {
          const progress = self.progress;
          const opacity = Math.min(1, progress / 0.4); // Matches navbar fade-in speed!
          if (buttonRef.current) {
            buttonRef.current.style.opacity = opacity;
            buttonRef.current.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
          }
        },
        onLeaveBack: () => {
          if (buttonRef.current) {
            buttonRef.current.style.opacity = 0;
            buttonRef.current.style.pointerEvents = 'none';
          }
        }
      });
    });

    // Mobile: Simple toggle past 60px scroll (no continuous style calculations on scroll)
    mm.add("(max-width: 767px)", () => {
      gsap.to(buttonRef.current, {
        opacity: 1,
        duration: 0.3,
        scrollTrigger: {
          start: 60,
          toggleActions: "play none none reverse",
          onEnter: () => {
            if (buttonRef.current) buttonRef.current.style.pointerEvents = 'auto';
          },
          onLeaveBack: () => {
            if (buttonRef.current) {
              buttonRef.current.style.opacity = 0;
              buttonRef.current.style.pointerEvents = 'none';
            }
          }
        }
      });
    });

    return () => {
      mm.revert();
    };
  }, [isCareers]);

  return (
    <motion.a
      ref={buttonRef}
      href={isCareers ? "#" : "#careers"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={cn(
        "fixed top-[84px] md:top-[22px] right-4 sm:right-6 md:right-12 z-[100] flex items-center bg-white/92 border border-white/10 rounded-full cursor-pointer h-[46px] overflow-hidden select-none floating-careers-btn text-[#070707] no-underline",
        !isCareers && "opacity-0 pointer-events-none"
      )}
      style={isCareers ? { opacity: 1, pointerEvents: 'auto' } : {}}
      animate={{
        width: isHovered ? (isCareers ? 165 : 155) : 46,
        backgroundColor: isHovered ? 'rgba(255, 255, 255, 1.0)' : 'rgba(255, 255, 255, 0.92)',
        borderColor: isHovered ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
      }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
    >
      {/* Icon Container */}
      <div className="w-[44px] h-[44px] flex items-center justify-center text-[#070707] flex-shrink-0">
        {isCareers ? (
          <X size={18} color="#070707" className="text-[#070707]" />
        ) : (
          <Briefcase size={18} color="#070707" className="text-[#070707]" />
        )}
      </div>
      
      {/* Text */}
      <span
        className={cn(
          "text-[#070707] text-[11px] font-sans font-semibold uppercase tracking-wider pr-5 whitespace-nowrap overflow-hidden transition-all duration-300",
          isHovered ? "opacity-100 max-w-[120px]" : "opacity-0 max-w-0"
        )}
      >
        {isCareers ? "Back to Home" : "Work With Us"}
      </span>
    </motion.a>
  );
}

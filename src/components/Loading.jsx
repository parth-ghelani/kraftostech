import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

export default function Loading({ onComplete }) {
  const [stage, setStage] = useState('loading'); // 'loading' | 'exit-black'
  const [progress, setProgress] = useState(0);
  
  const textRef = useRef(null);

  useEffect(() => {
    // Stage 1: Transition to exit-black at 3.3s (after progress finishes at 3.0s)
    const exitBlackTimer = setTimeout(() => {
      setStage('exit-black');
    }, 3300);

    // Stage 2: Trigger completion callback at 3.9s
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3900);

    return () => {
      clearTimeout(exitBlackTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Smoothly increment progress state from 0 to 100 over 3.0s
  useEffect(() => {
    const duration = 3000; // 3.0 seconds duration
    const intervalTime = 30; // ~33fps update rate
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(progressInterval);
  }, []);

  // Synchronized GSAP loading animations
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 });

    // Reveal the text from left to right
    tl.fromTo(textRef.current,
      { 
        clipPath: "inset(0% 100% 0% 0%)",
        opacity: 1,
        scale: 0.98 
      },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        duration: 2.4,
        ease: "power2.inOut"
      },
      0
    );
  }, []);

  return (
    <motion.div
      key="loader-container"
      className="fixed inset-0 z-40 overflow-hidden flex items-center justify-center"
      initial={{ backgroundColor: "rgba(7, 7, 7, 1)" }}
      animate={{
        backgroundColor: stage === 'exit-black' ? "rgba(7, 7, 7, 0)" : "rgba(7, 7, 7, 1)",
      }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
          {/* Centered Preloader Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            
            {/* 1. Brand Text - Renders in crisp white for high contrast on solid black preloader, and crossfades to Hero glass text on exit-black */}
            <motion.div 
              ref={textRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[188px] md:mt-[220px] select-none text-center"
              style={{ opacity: 0, clipPath: "inset(0% 100% 0% 0%)" }}
              animate={{
                opacity: stage === 'exit-black' ? 0 : 1
              }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <h1 className="select-none leading-[0.9] tracking-[-0.04em] text-[clamp(42px,11vw,55px)] md:text-[clamp(65px,8vw,130px)] text-center whitespace-nowrap">
                <span className="font-['Outfit'] font-[900] text-[#F2ECE6]">
                  {"Kraftos".split("").map((char, index) => (
                    <span 
                      key={`k-${index}`}
                      className="inline-block transition-all duration-300 hover:scale-120 hover:-translate-y-3 hover:text-[#ff7a1a] cursor-pointer"
                    >
                      {char}
                    </span>
                  ))}
                </span><span className="font-serif italic font-[700] text-[#F2ECE6]/90">
                  {"tech.".split("").map((char, index) => (
                    <span 
                      key={`t-${index}`}
                      className="inline-block transition-all duration-300 hover:scale-120 hover:-translate-y-3 hover:text-[#ff7a1a] cursor-pointer"
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </h1>
            </motion.div>


            {/* Monospace Progress counter percentage - Fades out during exit-black */}
            <motion.div 
              className="absolute bottom-12 md:bottom-16 text-center"
              animate={{
                opacity: stage === 'exit-black' ? 0 : 0.35
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <span className="font-['JetBrains_Mono','IBM_Plex_Mono',monospace] font-light text-[14px] tracking-[0.2em] text-white">
                {Math.round(progress)}
              </span>
            </motion.div>
          </div>
    </motion.div>
  );
}

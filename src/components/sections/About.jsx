import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const labelRef = useRef(null);
  const headlineRef = useRef(null);
  const bodyColsRef = useRef(null);
  const imageRef = useRef(null);
  const statsRef = useRef(null);
  const logoRef = useRef(null);
  const videoRef = useRef(null);
  const isSpinning = useRef(false);

  const handlePhoneMouseEnter = () => {
    if (!logoRef.current || isSpinning.current) return;
    isSpinning.current = true;
    
    // 4 full spins = 1440 degrees, completed in a fast 1.2s with deceleration
    gsap.to(logoRef.current, {
      rotation: "+=1440",
      duration: 1.2,
      ease: "power4.out",
      onComplete: () => {
        isSpinning.current = false;
      }
    });
  };

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const mm = gsap.matchMedia();
    let statsTrigger;

    // Desktop: Scroll-scrubbed progressive reveal
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 85%", // starts when top of content grid enters screen
          end: "top 35%",   // ends when top of content grid reaches upper-middle viewport
          scrub: 1.2,       // smooth delay
          onToggle: (self) => {
            const state = self.isActive ? "transform, opacity" : "auto";
            if (labelRef.current) labelRef.current.style.willChange = state;
            if (headlineRef.current) headlineRef.current.style.willChange = state;
            if (bodyColsRef.current) bodyColsRef.current.style.willChange = state;
            if (imageRef.current) imageRef.current.style.willChange = state;
            if (statsRef.current) statsRef.current.style.willChange = state;
          }
        }
      });

      tl.fromTo(labelRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(headlineRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
        .fromTo(bodyColsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .fromTo(imageRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
        .fromTo(statsRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.6");
    });

    // Mobile: Staggered entry animation once (no scroll scrubbing)
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 90%",
          once: true
        }
      });

      tl.fromTo([labelRef.current, headlineRef.current, bodyColsRef.current, imageRef.current, statsRef.current],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" }
      );
    });

    // 4. Stats Count-Up Animation (Single parent trigger)
    if (statsRef.current) {
      const statElements = statsRef.current.querySelectorAll('.stat-number-value');
      statsTrigger = ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 90%",
        onEnter: () => {
          statElements.forEach((el) => {
            const targetVal = parseInt(el.getAttribute('data-target') || '0', 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const countObj = { val: 0 };

            gsap.to(countObj, {
              val: targetVal,
              duration: 2.2,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = Math.floor(countObj.val) + suffix;
              }
            });
          });
        },
        once: true
      });
    }

    // IntersectionObserver to pause the phone video when it scrolls out of viewport
    const video = videoRef.current;
    let videoObserver;
    if (video) {
      videoObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }, { threshold: 0.1 });
      videoObserver.observe(video);
    }

    return () => {
      mm.revert();
      if (statsTrigger) statsTrigger.kill();
      if (videoObserver && video) videoObserver.disconnect();
    };
  }, []);

  const stats = [
    { target: 50, suffix: '+', text: 'Projects Delivered' },
    { target: 150, suffix: '+', text: 'Years Combined Experience' },
    { target: 12, suffix: '', text: 'Team Members' },
    { target: 3, suffix: '', text: 'Continents' },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full pt-[10vh] pb-16 md:pb-24 z-10"
      style={{
        background: 'linear-gradient(to bottom, rgba(7, 7, 7, 0) 0%, rgba(7, 7, 7, 0.45) 150px, rgba(7, 7, 7, 0.45) 100%)'
      }}
    >
      {/* Inject custom breathing animation stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.12);
          }
          50% {
            transform: scale(1.03);
            box-shadow: 0 8px 32px rgba(255, 122, 26, 0.18), inset 0 1px 1.5px rgba(255, 255, 255, 0.25);
            border-color: rgba(255, 255, 255, 0.25);
          }
        }
        .badge-breathe {
          animation: breathe 6s ease-in-out infinite;
        }
      `}} />

      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12">
        <div ref={contentRef} className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Editorial Text & Stats */}
          <div className="lg:col-span-6 flex flex-col justify-start text-left">
            {/* Small Label */}
            <span 
              ref={labelRef} 
              className="font-sans text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-3"
            >
              Who We Are
            </span>

            {/* Section Headline in Orange Container */}
            <div 
              ref={headlineRef}
              className="bg-[#ff7a1a] px-8 py-6 rounded-3xl mb-12 shadow-[0_12px_40px_rgba(255,122,26,0.22)] border border-white/5 overflow-hidden w-full"
            >
              <h2 className="font-display font-bold text-[32px] md:text-[42px] leading-[1.2] text-[#070707] tracking-[-0.02em]">
                Craft. Turning Ambitious Ideas Into Exceptional Digital Experiences.
              </h2>
            </div>

            {/* Two Columns Text */}
            <div 
              ref={bodyColsRef} 
              className="grid md:grid-cols-2 gap-8 md:gap-12 items-start mb-16"
            >
              {/* Column 1 */}
              <div className="border-l border-[#ff7a1a]/40 pl-6 md:pl-8">
                <p className="font-sans text-[18px] leading-[1.7] text-zinc-300 max-w-[45ch]">
                  Kraftostech isn't a typical development shop. We're a small, obsessive team in Surat who believes that every pixel matters. Every interaction should feel inevitable. Every design should whisper, not shout.
                </p>
              </div>

              {/* Column 2 */}
              <div className="border-l border-[#ff7a1a]/20 pl-6 md:pl-8">
                <p className="font-sans text-[18px] leading-[1.7] text-zinc-400 max-w-[45ch]">
                  Since 2021, we've worked with ambitious founders, bold brands, and visionary teams. We've shipped Flutter apps that delight users. Built React platforms that scale. Designed interfaces that feel like second nature.
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div 
              ref={statsRef} 
              className="grid sm:grid-cols-2 lg:grid-cols-1 gap-8 border-t border-border pt-12"
            >
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-baseline md:gap-4">
                  <span 
                    className="stat-number-value font-display font-semibold text-[48px] leading-none text-white"
                    data-target={stat.target}
                    data-suffix={stat.suffix}
                  >
                    0{stat.suffix}
                  </span>
                  <span className="font-sans text-[14px] font-semibold text-zinc-400 uppercase tracking-wider mt-1 md:mt-0">
                    {stat.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Phone Mockup Frame with Video */}
          <div 
            ref={imageRef} 
            className="lg:col-span-6 w-full flex justify-center items-center will-change-transform"
            onMouseEnter={handlePhoneMouseEnter}
          >
            <div className="relative border-[6px] border-[#22211f] bg-[#0c0a09] rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] h-[560px] w-[270px] md:h-[620px] md:w-[300px] ring-12 ring-white/[0.03] p-[6px] flex flex-col justify-stretch items-stretch">
              
              {/* Speaker / Notch / Dynamic Island */}
              <div className="absolute top-3 inset-x-0 flex justify-center items-center z-20 pointer-events-none">
                {/* Dynamic Island */}
                <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-white/[0.03]">
                  <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-indigo-950/60 border border-indigo-900/40 rounded-full" />
                </div>
              </div>
              
              {/* Screen Content - Plays upscaled-video.mp4 */}
              <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-black flex-1">
                <video
                  ref={videoRef}
                  src="/upscaled-video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />

                {/* Smooth dark glass gradient overlay along the bottom 14% of the screen */}
                <div className="absolute inset-x-0 bottom-0 h-[14%] bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none z-10" />

                {/* Subtle glass glare overlay across the screen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none z-10" />
              </div>

              {/* Premium black rotating dial masking the watermark */}
              {/* Positioned relative to the outer container so it partially overlaps the bezel & screen edge */}
              <div className="absolute bottom-[20px] right-[6px] md:bottom-[26px] md:right-[8px] z-30 w-[56px] h-[56px] md:w-[66px] md:h-[66px] flex items-center justify-center bg-black rounded-full border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.1)] badge-breathe overflow-hidden cursor-pointer select-none">
                {/* Slow rotating outer dash ring representing dial ticks */}
                <div className="absolute inset-1 rounded-full border border-dashed border-white/20 animate-[spin_30s_linear_infinite]" />
                
                {/* Inner dial core */}
                <div className="absolute inset-2 bg-gradient-to-br from-zinc-900 to-black rounded-full flex items-center justify-center shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.15)] overflow-hidden">
                  <img
                    ref={logoRef}
                    src="/images/glass_logo.png"
                    className="w-[75%] h-[75%] object-contain select-none will-change-transform"
                    alt="Kraftostech Glass Logo"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


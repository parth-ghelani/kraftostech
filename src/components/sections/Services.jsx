import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const labelRef = useRef(null);
  const headlineRef = useRef(null);
  const gridRef = useRef(null);
  const logosRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !lineRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
        onToggle: (self) => {
          const state = self.isActive ? "transform, opacity" : "auto";
          if (lineRef.current) lineRef.current.style.willChange = state;
          if (labelRef.current) labelRef.current.style.willChange = state;
          if (headlineRef.current) headlineRef.current.style.willChange = state;
          if (gridRef.current) gridRef.current.style.willChange = state;
          if (logosRef.current) logosRef.current.style.willChange = state;
        }
      }
    });

    tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power2.inOut" })
      .fromTo(labelRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.4")
      .fromTo(headlineRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
      .fromTo(gridRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
      .fromTo(logosRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.5");

    return () => {
      tl.kill();
    };
  }, []);

  const practices = [
    {
      title: 'App Development',
      desc: 'We craft iOS and Android apps with Flutter, native Swift, and Kotlin. Fluid interactions. Thoughtful design. Code that performs.',
      tags: ['Flutter', 'Swift', 'Kotlin', 'Firebase'],
    },
    {
      title: 'Web Development',
      desc: 'React platforms. Next.js for scale. Laravel backends that sing. We build for speed, accessibility, and joy.',
      tags: ['React', 'Next.js', 'Laravel', 'Node.js'],
    },
    {
      title: 'Design Systems',
      desc: 'Beautiful interfaces start with invisible systems. We design the atoms, molecules, and organisms that make interfaces feel coherent.',
      tags: ['Figma', 'Design Systems', 'UI/UX', 'Animation'],
    },
  ];

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full bg-black pt-[10vh] pb-16 md:pb-24 z-10"
    >
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 flex flex-col">
        {/* Signature Horizontal Line (Completes 0 -> 100%) */}
        <div 
          ref={lineRef} 
          className="w-full h-[1px] bg-white/15 origin-center scale-x-0 mb-16 will-change-transform" 
        />

        {/* Section Header */}
        <div ref={headlineRef} className="text-left mb-20 max-w-2xl will-change-transform">
          <span ref={labelRef} className="font-sans text-xs font-semibold text-gray-light uppercase tracking-wider block mb-3 will-change-transform">
            What We Do
          </span>
          <h2 className="font-display font-semibold text-[40px] md:text-[64px] leading-tight text-white mb-4 tracking-[-0.02em]">
            <span className="text-[#ff7a1a] inline-block scale-125 origin-left">K</span>rafted Expertise
          </h2>
          <p className="font-sans text-[18px] md:text-[20px] text-gray-medium leading-relaxed">
            Three core practices. One obsession: quality.
          </p>
        </div>

        {/* Practice Grid */}
        <div
          ref={gridRef}
          className="grid lg:grid-cols-3 gap-0 border-y border-border will-change-transform"
        >
          {practices.map((practice, index) => (
            <div
              key={index}
              className={`py-12 md:py-16 px-6 md:px-12 flex flex-col justify-between min-h-[300px] ${
                index > 0 ? 'border-t lg:border-t-0 lg:border-l border-border' : ''
              }`}
            >
              <div>
                <h3 className="font-display font-semibold text-[32px] md:text-[40px] leading-tight text-white mb-6 tracking-tight">
                  {practice.title}
                </h3>
                <p className="font-sans text-[16px] md:text-[18px] leading-[1.7] text-gray-dark mb-10 max-w-[45ch]">
                  {practice.desc}
                </p>
              </div>

              {/* Tags */}
              <div className="font-sans text-[13px] md:text-[14px] text-gray-light tracking-wide font-normal">
                {practice.tags.join('  •  ')}
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack CTA Section */}
        <div
          ref={logosRef}
          className="mt-28 pt-10 border-t border-border flex flex-col gap-8 text-left will-change-transform"
        >
          <span className="font-sans text-[12px] font-semibold text-gray-light uppercase tracking-[0.08em]">
            tech we use
          </span>
          
          <div className="relative w-full p-8 md:p-12 border border-border rounded-3xl bg-[#120d09]/30 backdrop-blur-md overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 group">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,122,26,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,122,26,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-[#ff7a1a]/5 blur-3xl group-hover:bg-[#ff7a1a]/8 transition-colors duration-500 pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl">
              <h3 className="font-display font-semibold text-2xl md:text-3xl text-white mb-3 tracking-tight">
                Our Production-Grade Stack
              </h3>
              <p className="font-sans text-sm md:text-base text-zinc-400 leading-relaxed max-w-[50ch]">
                From fluid cross-platform mobile apps using Flutter to enterprise web systems backed by React and Laravel, we select our tools for ultimate performance and scale.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap gap-4 items-center shrink-0 self-start md:self-auto">
              <button
                onClick={() => {
                  const techSec = document.getElementById('tech');
                  if (techSec) {
                    techSec.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-4 bg-[#ff7a1a] text-[#070707] font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer shadow-[0_10px_25px_rgba(255,122,26,0.15)] text-sm"
              >
                Explore Full Tech Stack
              </button>
              
              <button
                onClick={() => {
                  const contactSec = document.getElementById('contact');
                  if (contactSec) {
                    contactSec.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-4 bg-[#ff7a1a]/15 text-[#ffa260] border border-[#ff7a1a]/30 font-bold rounded-full hover:bg-[#ff7a1a] hover:text-[#070707] hover:border-transparent transition-all duration-300 cursor-pointer text-sm"
              >
                Start a Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

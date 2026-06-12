import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const containerRef = useRef(null);
  const panel2Ref = useRef(null);
  const redArrowRef = useRef(null);
  const scrollOutlineTextRef = useRef(null);
  const brandLogoWordmarkRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const panel2 = panel2Ref.current;

    if (!container || !panel2 || isMobile) return;

    const ctx = gsap.context(() => {
      // Circular reveal animation on scroll as section enters screen (Desktop Only)
      gsap.fromTo(panel2,
        { 
          clipPath: 'circle(0% at 50% 100%)',
          webkitClipPath: 'circle(0% at 50% 100%)'
        },
        {
          clipPath: 'circle(150% at 50% 100%)',
          webkitClipPath: 'circle(150% at 50% 100%)',
          ease: 'power1.out',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 1,
            onToggle: (self) => {
              panel2.style.willChange = self.isActive ? "clip-path, -webkit-clip-path" : "auto";
            },
            onLeave: () => {
              gsap.set(panel2, { clipPath: 'none', webkitClipPath: 'none' });
            },
            onEnterBack: () => {
              gsap.set(panel2, { 
                clipPath: 'circle(150% at 50% 100%)',
                webkitClipPath: 'circle(150% at 50% 100%)'
              });
            }
          }
        }
      );

      // Brand wordmark scale and fade in on scroll (Desktop Only)
      if (brandLogoWordmarkRef.current) {
        const wordmark = brandLogoWordmarkRef.current;
        gsap.fromTo(wordmark,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 40%',
              end: 'bottom bottom',
              scrub: 1.2,
              onToggle: (self) => {
                wordmark.style.willChange = self.isActive ? "transform, opacity" : "auto";
              }
            }
          }
        );
      }

    });

    return () => ctx.revert();
  }, [isMobile]);

  // Separate animation for mobile so the wordmark still animates in on scroll
  useEffect(() => {
    if (!isMobile || !brandLogoWordmarkRef.current) return;

    const wordmark = brandLogoWordmarkRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(wordmark,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: wordmark,
            start: 'top 90%',
            end: 'top 70%',
            scrub: true,
          }
        }
      );
    });

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative w-full z-10 overflow-hidden -mt-16 md:-mt-24 bg-black h-auto"
    >
      {/* Light Revealed Contact Panel */}
      <div
        ref={panel2Ref}
        className="relative w-full bg-[#f3f3f3] text-black flex flex-col justify-between p-6 md:p-16 z-20 overflow-visible pointer-events-auto"
        style={isMobile ? {} : { 
          clipPath: 'circle(0% at 50% 100%)',
          webkitClipPath: 'circle(0% at 50% 100%)'
        }}
      >
        {/* Main Grid Content */}
        <div className="grid grid-cols-2 md:grid-cols-12 w-full gap-8 md:gap-6 mt-6 md:mt-12 items-start flex-1">
          {/* Column 1: Brand & Contact Info */}
          <div className="col-span-2 md:col-span-4 flex flex-col gap-6 text-left">
            <div>
              <h3 className="text-2xl font-bold tracking-tighter text-black select-none whitespace-nowrap">
                <span className="font-['Outfit'] font-[900]">
                  {"Kraftos".split("").map((char, index) => (
                    <span 
                      key={`ks-${index}`}
                      className="inline-block transition-all duration-300 hover:scale-120 hover:-translate-y-1 hover:text-[#ff7a1a] cursor-pointer"
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="font-serif italic font-[700]">
                  {"tech.".split("").map((char, index) => (
                    <span 
                      key={`ts-${index}`}
                      className="inline-block transition-all duration-300 hover:scale-120 hover:-translate-y-1 hover:text-[#ff7a1a] cursor-pointer"
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </h3>
              <p className="font-sans text-[13px] md:text-[14px] text-zinc-500 leading-relaxed mt-2 max-w-[320px]">
                A trusted technology partner, offering innovative and scalable IT services, specializing in software development, web & mobile solutions, and UX design.
              </p>
            </div>
            
            <div className="flex flex-col gap-1 font-sans text-[13px] md:text-[14px] text-zinc-700">
              <span className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase block mb-1">ADDRESS</span>
              <p>25, 2nd Floor, Nandanvan Society,</p>
              <p>Nr. Singanpor Vegetable Market, Singanpor Road,</p>
              <p>Surat, Gujarat, India 395004</p>
            </div>

            <div className="flex flex-col gap-1 font-sans text-[13px] md:text-[14px] text-zinc-700">
              <span className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase block mb-1">CONTACT</span>
              <a href="tel:+919033164025" className="hover:text-[#ff3300] transition-colors">T: +91 90331 64025</a>
              <a href="mailto:contact@kraftostech.com" className="hover:text-[#ff3300] transition-colors">E: contact@kraftostech.com</a>
            </div>
          </div>

          {/* Column 2: Quick Links & Services */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-6 text-left">
            <div>
              <span className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase block mb-3">SERVICES</span>
              <ul className="flex flex-col gap-2 font-sans text-[13px] md:text-[14px] text-zinc-700">
                <li>Web Development</li>
                <li>Mobile Apps</li>
                <li>UI/UX Design</li>
                <li>IT Consulting</li>
              </ul>
            </div>

            <div>
              <span className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase block mb-3">NAVIGATION</span>
              <ul className="flex flex-col gap-2 font-sans text-[13px] md:text-[14px] text-zinc-700">
                <li><a href="#home" className="hover:text-[#ff3300] transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-[#ff3300] transition-colors">About Us</a></li>
                <li><a href="#portfolio" className="hover:text-[#ff3300] transition-colors">Portfolio</a></li>
                <li><a href="/careers-section" className="hover:text-[#ff3300] transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>

          {/* Column 3: Technologies & Socials */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-3 text-left">
            <span className="hidden md:block font-mono text-[10px] text-zinc-400 tracking-widest uppercase mb-1">TECHNOLOGY STACK</span>
            <div className="hidden md:flex flex-wrap gap-1.5 max-w-[280px]">
              {['iOS', 'Android', 'Flutter', 'Swift', 'SwiftUI', 'Kotlin', 'Laravel', 'Vue Js', 'Firebase', 'Figma', 'PHP', 'Dart'].map((tech) => (
                <span 
                  key={tech} 
                  className="font-sans text-[11px] px-2.5 py-1 bg-black/5 hover:bg-black/10 text-zinc-800 rounded-full border border-black/5 transition-colors cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="mt-0 md:mt-6">
              <span className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase block mb-3">SOCIALS</span>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 font-sans text-[13px] md:text-[14px]">
                <a href="https://www.instagram.com/kraftostech/" target="_blank" rel="noreferrer" className="text-zinc-700 hover:text-[#ff3300] transition-colors font-medium">Instagram</a>
                <a href="https://www.linkedin.com/company/kraftostech/" target="_blank" rel="noreferrer" className="text-zinc-700 hover:text-[#ff3300] transition-colors font-medium">LinkedIn</a>
                <a href="https://www.facebook.com/kraftostech/" target="_blank" rel="noreferrer" className="text-zinc-700 hover:text-[#ff3300] transition-colors font-medium">Facebook</a>
              </div>
            </div>
          </div>
        </div>

        {/* Massive Brand Typography Wordmark */}
        <div className="w-full flex justify-center items-center mt-8 md:mt-16 mb-4 select-none overflow-visible">
          <h1 
            ref={brandLogoWordmarkRef}
            className="leading-none tracking-[-0.04em] text-[clamp(20px,7.5vw,110px)] select-none text-center will-change-[transform,opacity] text-black whitespace-nowrap"
          >
            <span className="font-['Outfit'] font-[900]">
              {"Kraftos".split("").map((char, index) => (
                <span 
                  key={`k-${index}`}
                  className="inline-block transition-all duration-300 hover:scale-120 hover:-translate-y-3 hover:text-[#ff7a1a] cursor-pointer"
                >
                  {char}
                </span>
              ))}
            </span>
            <span className="font-serif italic font-[700]">
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
        </div>

        {/* Bottom Row: Copyright / Info */}
        <div className="w-full border-t border-black/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-zinc-400 font-mono mt-8">
          <div>
            © {new Date().getFullYear()} KRAFTOSTECH. ALL RIGHTS RESERVED.
          </div>
          <div className="tracking-wider">
            EST. 2021 • SURAT, INDIA
          </div>
        </div>
      </div>
    </section>
  );
}

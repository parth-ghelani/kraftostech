import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    initials: 'AB',
    name: 'Aden Besser',
    location: 'Client',
    copy: '“I have worked with Kraftostech for several months. They consistently delivered high quality work. They also work very fast and are responsive. I really enjoyed our collaboration. Top tier team! We will continue to collaborate for future work.”',
    gradient: 'from-[#ff7a1a] to-[#e65c00]',
  },
  {
    initials: 'OL',
    name: 'Olivia',
    location: 'Client',
    copy: '“We highly recommend Kraftostech for any iOS development project. Their technical expertise, creativity, and commitment to quality make them a reliable and trustworthy partner.”',
    gradient: 'from-[#ff9233] to-[#ff5100]',
  },
  {
    initials: 'SM',
    name: 'Sebastien M',
    location: 'Client',
    copy: '“The Kraftostech is far more than just an IT Company. Their team consistently delivers high-quality services, from routine maintenance to complex IT solutions tailored to our needs. Whenever we have an issue, their support team quickly addresses it, ensuring minimal disruption to our operations. Their expertise is evident, and they have repeatedly demonstrated their deep knowledge in various IT domains. Their professionalism is top-notch. The team members we interact with are always courteous, patient, and thorough in their explanations.”',
    gradient: 'from-[#ff6a00] to-[#b33c00]',
  },
  {
    initials: 'GJ',
    name: 'George Jeffin',
    location: 'Client',
    copy: '“We recently collaborated with Kraftostech on a Flutter-based project, and we are thoroughly impressed with their expertise and professionalism. Their technical proficiency, attention to detail, and customer-focused approach make them a reliable and valuable partner.”',
    gradient: 'from-[#ffa259] to-[#d95c00]',
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const contactSlideRef = useRef(null);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const contactSlide = contactSlideRef.current;
    if (!contactSlide) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(contactSlide,
        { x: "0vw" },
        {
          x: "35vw",
          ease: "none",
          scrollTrigger: {
            trigger: contactSlide,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const activeItem = testimonials[activeIndex];

  return (
    <section 
      id="testimonials" 
      className="relative w-full pt-20 pb-8 md:pt-28 bg-black z-10 overflow-hidden border-t border-white/5"
    >
      {/* Background Decorative Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#ff7a1a]/2 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-orange-600/1 blur-[90px] pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 text-center mb-12 relative z-10">
        <span className="font-mono text-[10px] text-zinc-400 tracking-[0.25em] uppercase block mb-3">
          Loved Worldwide
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white mb-4">
          CHECK OUR <span className="font-serif italic font-normal text-[#ff7a1a] tracking-normal">TESTIMONIALS</span>
        </h2>
      </div>

      <div className="w-full relative z-10 flex flex-col items-center gap-8 overflow-hidden py-4">
        <style dangerouslySetInnerHTML={{__html: `
          .testimonial-slider-track {
            display: flex;
            align-items: stretch;
            transition: transform 600ms cubic-bezier(0.25, 1, 0.5, 1);
            width: 100%;
            --card-width: 85%;
          }
          .testimonial-card-item {
            width: var(--card-width);
            flex-shrink: 0;
            padding: 0 10px;
            display: flex;
            flex-direction: column;
            transition: all 600ms cubic-bezier(0.25, 1, 0.5, 1);
          }
          @media (min-width: 640px) {
            .testimonial-slider-track {
              --card-width: 75%;
            }
            .testimonial-card-item {
              padding: 0 12px;
            }
          }
          @media (min-width: 768px) {
            .testimonial-slider-track {
              --card-width: 65%;
            }
            .testimonial-card-item {
              padding: 0 16px;
            }
          }
          @media (min-width: 1024px) {
            .testimonial-slider-track {
              --card-width: 55%;
            }
            .testimonial-card-item {
              padding: 0 20px;
            }
          }
        `}} />

        {/* Testimonial Sliding Track */}
        <div 
          className="testimonial-slider-track"
          style={{
            transform: `translateX(calc(50% - (var(--card-width) * ${activeIndex}) - (var(--card-width) / 2)))`
          }}
        >
          {testimonials.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div 
                key={index}
                className="testimonial-card-item"
                onClick={() => {
                  if (!isActive) setActiveIndex(index);
                }}
              >
                <div 
                  className={`w-full bg-gradient-to-br ${item.gradient} text-black rounded-3xl p-6 md:p-10 flex flex-col md:flex-row justify-between gap-6 md:gap-8 items-start md:items-center shadow-2xl relative overflow-hidden group select-none transition-all duration-500 h-full ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-35 scale-90 md:scale-95 cursor-pointer hover:opacity-50'
                  }`}
                >
                  {/* Subtle overlay lines pattern inside card */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                  <span className="absolute right-6 top-1 text-7xl md:text-8xl font-serif text-black/5 select-none pointer-events-none">“</span>

                  {/* Left / Top Side: Review Stars & Text */}
                  <div className="flex-1 text-left relative z-10 pr-0 md:pr-6 flex flex-col justify-center w-full">
                    <div className="text-white font-sans tracking-wide text-xs mb-2 md:mb-4 shrink-0">★★★★★</div>
                    <p className="text-[14px] md:text-[17px] text-zinc-950 font-sans font-medium leading-relaxed tracking-wide">
                      {item.copy}
                    </p>
                  </div>

                  {/* Right / Bottom Side: Author Details Divider & Details */}
                  <div className="flex items-center gap-4 shrink-0 border-t border-black/10 pt-4 md:pt-0 md:border-t-0 md:border-l md:border-black/10 md:pl-6 w-full md:w-auto relative z-10">
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center font-display font-bold text-white bg-black shrink-0 shadow-xl text-sm md:text-base">
                      {item.initials}
                    </div>
                    <div className="flex flex-col text-left">
                      <strong className="text-black font-display text-[14px] md:text-[15px] font-bold tracking-tight">
                        {item.name}
                      </strong>
                      <span className="text-black/60 font-sans text-[11px] md:text-[12px] font-medium tracking-wide mt-0.5">
                        {item.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-6 mt-4 relative z-20">
          {/* Prev Arrow */}
          <button 
            onClick={handlePrev}
            className="w-11 h-11 rounded-full border border-white/10 bg-white/5 hover:bg-white hover:text-black hover:border-white text-white flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 shadow-md"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2.5">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === activeIndex ? 'w-6 bg-[#ff7a1a]' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Arrow */}
          <button 
            onClick={handleNext}
            className="w-11 h-11 rounded-full border border-white/10 bg-white/5 hover:bg-white hover:text-black hover:border-white text-white flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 shadow-md"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Sliding Contact Banner (Arrow) - Positioned at the bottom of Testimonials, just above footer */}
      <div className="w-full overflow-hidden py-16 md:py-24 mt-16 md:mt-24 border-t border-white/5">
        <div 
          ref={contactSlideRef}
          className="flex justify-start items-center w-max pl-6 md:pl-12"
        >
          <a 
            href="mailto:hello@kraftostech.com"
            className="flex items-center gap-6 md:gap-12 group cursor-pointer"
          >
            <span className="font-sans text-[20px] md:text-[36px] font-bold text-gray-medium uppercase tracking-[0.2em] whitespace-nowrap transition-colors group-hover:text-white">
              CONTACT US ✦
            </span>
            <div className="block transition-transform duration-500 ease-out">
              <svg 
                viewBox="0 0 140 32" 
                className="w-32 md:w-56 h-auto fill-none stroke-[#ff3300]" 
                strokeWidth="3"
                strokeLinecap="square"
                strokeLinejoin="miter"
              >
                {/* Tail line */}
                <line 
                  x1="0" 
                  y1="16" 
                  x2="110" 
                  y2="16" 
                  className="transition-transform duration-500 ease-out origin-left group-hover:scale-x-[1.15]"
                />
                {/* Arrowhead */}
                <path 
                  d="M98 6 L120 16 L98 26" 
                  className="transition-transform duration-500 ease-out group-hover:translate-x-[15px]"
                />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

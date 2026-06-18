import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Users, 
  TrendingUp, 
  Trophy, 
  Activity, 
  Heart, 
  Zap, 
  MapPin, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    icon: Cpu,
    title: "Innovative Projects",
    desc: "Work on cutting-edge technologies and exciting projects that solve real-world problems for clients across diverse industries — from startups to global enterprises."
  },
  {
    icon: Users,
    title: "Collaborative Culture",
    desc: "We believe great ideas come from everywhere. Our team thrives on open communication, mutual respect, and a strong sense of community."
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    desc: "Your growth is our priority. We offer continuous learning opportunities, mentorship programs, certifications, and clear paths for advancement."
  },
  {
    icon: Trophy,
    title: "Recognition & Rewards",
    desc: "Hard work never goes unnoticed. We regularly acknowledge outstanding performance and reward contributions that drive success."
  },
  {
    icon: Activity,
    title: "Work-Life Balance",
    desc: "Flexible schedules, wellness initiatives, and generous leave policies — because we know happy employees do their best work."
  },
  {
    icon: Heart,
    title: "Inclusive Environment",
    desc: "We embrace diversity and inclusivity, creating a workplace where everyone feels welcome, valued, and empowered to succeed."
  },
  {
    icon: Zap,
    title: "Tech-Driven & Future-Focused",
    desc: "Be part of a company that stays ahead of the curve — exploring AI, cloud, blockchain, and other emerging technologies to drive innovation."
  }
];

const jobs = [
  {
    id: "flutter",
    title: "Flutter Developer",
    location: "Surat / On-Site",
    type: "Full-time",
    desc: "We're looking for an experienced Flutter developer to join our mobile team and help build cross-platform applications."
  },
  {
    id: "ios",
    title: "iOS Developer",
    location: "Surat / On-Site",
    type: "Full-time",
    desc: "Looking for an experienced iOS developer proficient in Swift and SwiftUI to build high-quality apps."
  },
  {
    id: "android",
    title: "Android Developer",
    location: "Surat / On-Site",
    type: "Full-time",
    desc: "Seeking an experienced Android developer skilled in Kotlin and Jetpack Compose to develop robust mobile applications."
  },
  {
    id: "laravel",
    title: "Laravel Developer",
    location: "Surat / On-Site",
    type: "Full-time",
    desc: "Looking for a skilled Laravel developer with experience in building scalable web applications and RESTful APIs."
  },
  {
    id: "ui-ux",
    title: "UI/UX Designer",
    location: "Surat / On-Site",
    type: "Full-time",
    desc: "Join our design team to create beautiful, intuitive interfaces for web and mobile applications."
  },
  {
    id: "tester",
    title: "QA Tester",
    location: "Surat / On-Site",
    type: "Full-time",
    desc: "Join our QA team to test web and mobile applications, report defects, and ensure smooth, bug-free user experiences."
  }
];

export default function Careers() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const headlineRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const mm = gsap.matchMedia();

    // Desktop: Scroll-scrubbed entrance animations
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        }
      });

      tl.fromTo(labelRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(headlineRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");

      const colsTl = gsap.timeline({
        scrollTrigger: {
          trigger: leftColRef.current,
          start: "top 85%",
          end: "top 40%",
          scrub: 1,
        }
      });

      colsTl.fromTo(leftColRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 })
            .fromTo(rightColRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5");
    });

    // Mobile: Staggered entry animation once (no scroll scrubbing)
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 95%",
          once: true,
        }
      });

      tl.fromTo([labelRef.current, headlineRef.current, leftColRef.current, rightColRef.current],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }
      );
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      id="careers"
      ref={sectionRef}
      className="relative w-full pt-20 pb-20 md:pt-28 md:pb-28 bg-black z-10 overflow-hidden border-t border-white/5"
    >
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-[#ff7a1a]/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-orange-600/2 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 mb-12 md:mb-20 text-left">
        <span ref={labelRef} className="font-mono text-[10px] text-zinc-400 tracking-[0.25em] uppercase block mb-3 will-change-transform">
          Join Kraftostech
        </span>
        <h2 ref={headlineRef} className="text-[40px] md:text-[64px] font-display font-semibold tracking-tight text-white mb-4 leading-tight will-change-transform">
          Our <span className="font-serif italic font-normal text-[#ff7a1a]">Careers</span>
        </h2>
        <p className="font-sans text-[18px] md:text-[20px] text-gray-medium leading-relaxed max-w-2xl mt-4">
          Join our team of creators and builders. We are looking for talented, passionate individuals to help us build the next generation of mobile and web applications.
        </p>
      </div>

      {/* Grid Content */}
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative z-20">
        
        {/* Left Column: Why Work With Us & Benefits */}
        <div ref={leftColRef} className="lg:col-span-5 flex flex-col gap-8 text-left">
          <h3 className="font-display font-semibold text-2xl md:text-3xl text-white tracking-tight">
            Why Work With Us?
          </h3>
          <p className="font-sans text-sm md:text-base text-zinc-400 leading-relaxed">
            At Kraftostech, we believe our people are our greatest asset. We're always looking for talented individuals who are passionate about technology, design, and innovation. We offer a space where you can create impact and build a long-term career.
          </p>

          <div className="flex flex-col gap-6 mt-4">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex gap-4 items-start p-4 rounded-2xl border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/[0.08] transition-all duration-300 group"
                >
                  <div className="p-3 rounded-xl bg-[#ff7a1a]/10 text-[#ff7a1a] border border-[#ff7a1a]/15 group-hover:bg-[#ff7a1a] group-hover:text-black group-hover:border-transparent transition-all duration-300">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-sm sm:text-base text-white mb-1.5 transition-colors group-hover:text-[#ff7a1a]">
                      {benefit.title}
                    </h4>
                    <p className="font-sans text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Open Positions */}
        <div ref={rightColRef} className="lg:col-span-7 flex flex-col gap-8 text-left">
          <h3 className="font-display font-semibold text-2xl md:text-3xl text-white tracking-tight">
            Current Open Positions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
                className="flex flex-col justify-between p-6 rounded-[24px] border border-white/10 bg-[#09090b]/40 backdrop-blur-xl transition-all duration-300 group hover:border-[#ff7a1a]/30 hover:shadow-[0_0_30px_rgba(255,122,26,0.15)] h-full"
              >
                <div>
                  <h4 className="font-display font-semibold text-lg text-white mb-3 group-hover:text-[#ff7a1a] transition-colors leading-tight">
                    {job.title}
                  </h4>
                  
                  {/* Meta Tags */}
                  <div className="flex flex-wrap gap-3 font-mono text-[10px] text-zinc-400 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-[#ff7a1a]" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-[#ff7a1a]" />
                      {job.type}
                    </span>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                    {job.desc}
                  </p>
                </div>

                <a
                  href={`#careers/${job.id}`}
                  className="inline-flex items-center justify-center gap-1.5 w-full py-3 bg-[#ff7a1a]/15 text-[#ffa260] border border-[#ff7a1a]/30 font-semibold rounded-xl hover:bg-[#ff7a1a] hover:text-[#070707] hover:border-transparent transition-all duration-300 cursor-pointer text-xs uppercase tracking-wider group/btn"
                >
                  Apply Now
                  <ArrowUpRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Careers Page Footer */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-zinc-500 font-mono mt-16 md:mt-24 relative z-20">
        <div>
          © {new Date().getFullYear()} KRAFTOSTECH. ALL RIGHTS RESERVED.
        </div>
        <div className="tracking-wider">
          EST. 2021 • SURAT, INDIA
        </div>
      </div>
    </section>
  );
}

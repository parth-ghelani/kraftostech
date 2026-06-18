import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowLeft, ArrowUpRight, CheckCircle2, Star, Briefcase, HelpCircle } from 'lucide-react';
import { jobsData } from '../../utils/jobsData';

export default function JobDescription({ jobId, onBack }) {
  const job = jobsData[jobId];

  // Scroll to top when loading a new job description
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [jobId]);

  if (!job) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl font-display font-semibold text-white mb-4">Position not found</h2>
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7a1a]/15 text-[#ffa260] border border-[#ff7a1a]/30 rounded-xl hover:bg-[#ff7a1a] hover:text-[#070707] transition-all duration-300 font-semibold cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Careers
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-8 pb-24 text-left"
    >
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-[#ff7a1a]/4 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-orange-600/3 blur-[100px] pointer-events-none" />

      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-[#ff7a1a] transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
        Back to Careers
      </button>

      {/* Header Info */}
      <div className="mb-12 md:mb-16">
        <span className="font-mono text-[10px] text-zinc-500 tracking-[0.25em] uppercase block mb-3">
          Open Position
        </span>
        <h1 className="text-[36px] md:text-[56px] font-display font-semibold tracking-tight text-white leading-tight mb-6">
          {job.title}
        </h1>
        
        {/* Meta Tags */}
        <div className="flex flex-wrap gap-4 font-mono text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <MapPin size={14} className="text-[#ff7a1a]" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <Clock size={14} className="text-[#ff7a1a]" />
            {job.type}
          </span>
        </div>
      </div>

      {/* Split Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative z-10">
        
        {/* Left Side: Summary & Action Card */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="p-8 rounded-[32px] border border-white/10 bg-[#09090b]/40 backdrop-blur-xl hover:border-[#ff7a1a]/25 transition-all duration-300 shadow-xl">
            <h3 className="font-display font-semibold text-xl text-white mb-4">
              Apply for this position
            </h3>
            <p className="font-sans text-sm text-zinc-400 leading-relaxed mb-8">
              Send us your CV and portfolio. We'll review your application and get back to you within 3-5 business days if your profile fits the requirement.
            </p>

            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-4 bg-[#ff7a1a] text-black font-semibold rounded-2xl hover:bg-[#ffa260] hover:shadow-[0_0_30px_rgba(255,122,26,0.25)] transition-all duration-300 cursor-pointer text-sm uppercase tracking-wider group"
            >
              Submit Application
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div className="p-8 rounded-[32px] border border-white/[0.03] bg-white/[0.01]">
            <h4 className="font-display font-semibold text-md text-white mb-3">
              Kraftostech Workspace
            </h4>
            <p className="font-sans text-xs sm:text-sm text-zinc-400 leading-relaxed">
              We provide state-of-the-art workstations, a collaborative atmosphere, flexible hours, and active mentorship to support your career growth. Our development hub is centered around Surat, India.
            </p>
          </div>
        </div>

        {/* Right Side: Detailed Sections */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          
          {/* Job Summary */}
          {job.sections["Job Summary"] && (
            <div className="flex gap-5 items-start">
              <div className="p-3 rounded-xl bg-[#ff7a1a]/10 text-[#ff7a1a] border border-[#ff7a1a]/15 shrink-0 mt-0.5">
                <Briefcase size={18} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-white mb-3">
                  Job Summary
                </h3>
                <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed">
                  {job.sections["Job Summary"]}
                </p>
              </div>
            </div>
          )}

          {/* Key Responsibilities */}
          {job.sections["Responsibilities"] && (
            <div className="flex gap-5 items-start">
              <div className="p-3 rounded-xl bg-[#ff7a1a]/10 text-[#ff7a1a] border border-[#ff7a1a]/15 shrink-0 mt-0.5">
                <Star size={18} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-white mb-3">
                  Key Responsibilities
                </h3>
                <ul className="flex flex-col gap-3 font-sans text-sm sm:text-base text-zinc-300">
                  {job.sections["Responsibilities"].map((resp, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start leading-relaxed">
                      <span className="text-[#ff7a1a] font-bold mt-0.5">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Requirements */}
          {job.sections["Requirements"] && (
            <div className="flex gap-5 items-start">
              <div className="p-3 rounded-xl bg-[#ff7a1a]/10 text-[#ff7a1a] border border-[#ff7a1a]/15 shrink-0 mt-0.5">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-white mb-3">
                  Requirements & Qualifications
                </h3>
                <ul className="flex flex-col gap-3 font-sans text-sm sm:text-base text-zinc-300">
                  {job.sections["Requirements"].map((req, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start leading-relaxed">
                      <span className="text-[#ff7a1a] font-bold mt-0.5">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Nice to Have */}
          {job.sections["Nice to Have"] && (
            <div className="flex gap-5 items-start">
              <div className="p-3 rounded-xl bg-[#ff7a1a]/10 text-[#ff7a1a] border border-[#ff7a1a]/15 shrink-0 mt-0.5">
                <HelpCircle size={18} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-white mb-3">
                  Nice to Have
                </h3>
                <ul className="flex flex-col gap-3 font-sans text-sm sm:text-base text-zinc-300">
                  {job.sections["Nice to Have"].map((nice, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start leading-relaxed">
                      <span className="text-[#ff7a1a] font-bold mt-0.5">•</span>
                      <span>{nice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>

      </div>
    </motion.div>
  );
}

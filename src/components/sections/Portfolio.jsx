import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

// Helper to extract the primary URL from project links
const getPrimaryLink = (project) => {
  if (!project.links || project.links.length === 0) return '#';
  const webLink = project.links.find(l => l.type === 'web');
  if (webLink) return webLink.url;
  const iosLink = project.links.find(l => l.type === 'ios');
  if (iosLink) return iosLink.url;
  const androidLink = project.links.find(l => l.type === 'android');
  if (androidLink) return androidLink.url;
  return project.links[0].url;
};

// ProjectCard component
const ProjectCard = React.memo(({ project, isMarquee = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const primaryUrl = getPrimaryLink(project);

  const handleCardClick = (e) => {
    window.open(primaryUrl, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.open(primaryUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleMouseEnter = () => {
    if (window.isMouseActive === false) return;
    setIsHovered(true);
  };

  const handleMouseMove = () => {
    if (window.isMouseActive === false) return;
    if (!isHovered) {
      setIsHovered(true);
    }
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View project ${project.title}`}
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className={`project-card relative flex-shrink-0 h-[320px] sm:h-[400px] rounded-[24px] border border-white/10 bg-[#09090b]/40 backdrop-blur-xl overflow-hidden cursor-pointer group select-none transition-all duration-300 ${
        isMarquee ? 'w-[260px] sm:w-[350px]' : 'w-full'
      }`}
      style={{
        boxShadow: isHovered ? "0 0 30px rgba(255, 122, 26, 0.2)" : "0 4px 30px rgba(0, 0, 0, 0.4)",
        borderColor: isHovered ? "rgba(255, 122, 26, 0.35)" : "rgba(255, 255, 255, 0.1)"
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <motion.img
          src={`/images/portfolio/${project.img}`}
          alt={project.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = project.fallbackImg;
          }}
          animate={{ scale: isHovered ? 1.06 : 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="w-full h-full object-cover"
        />
        {/* Dark vignette to ensure readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-10" />
      </div>

      {/* Floating Content Glass Box */}
      <div 
        className="absolute bottom-4 left-4 right-4 z-20 bg-[#09090b]/80 backdrop-blur-xl border border-white/10 rounded-[20px] p-5 md:p-6 transition-all duration-300 ease-out"
        style={{
          borderColor: isHovered ? "rgba(255, 122, 26, 0.25)" : "rgba(255, 255, 255, 0.1)"
        }}
      >
        <span className="font-sans text-[10px] sm:text-[11px] text-[#ff7a1a] uppercase tracking-widest mb-1.5 block font-semibold">
          {project.category}
        </span>
        <h3 className="font-display font-semibold text-base sm:text-lg text-white leading-tight">
          {project.title}
        </h3>

        {/* Animated Slide-up Height Container */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isHovered ? "auto" : 0, 
            opacity: isHovered ? 1 : 0 
          }}
          transition={{ type: "spring", stiffness: 160, damping: 22 }}
          className="overflow-hidden"
        >
          <p className="font-sans text-xs sm:text-[13px] text-gray-medium leading-relaxed mt-2.5 line-clamp-3">
            {project.desc}
          </p>
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#ff7a1a] font-semibold tracking-wider uppercase">
              View Project <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});
ProjectCard.displayName = 'ProjectCard';

// Skeleton Loader for Card transitions
const ProjectCardSkeleton = ({ isMarquee = false }) => {
  return (
    <div className={`project-card relative flex-shrink-0 h-[320px] sm:h-[400px] rounded-[24px] border border-white/10 bg-[#09090b]/40 backdrop-blur-xl overflow-hidden animate-pulse p-4 flex flex-col justify-end ${
      isMarquee ? 'w-[260px] sm:w-[350px]' : 'w-full'
    }`}>
      <div className="bg-white/5 border border-white/5 rounded-[20px] p-5 w-full">
        <div className="h-3.5 bg-white/10 rounded w-1/4 mb-2.5"></div>
        <div className="h-6 bg-white/20 rounded w-3/5"></div>
      </div>
    </div>
  );
};

export default function Portfolio() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const headlineRef = useRef(null);
  const viewMoreBtnRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const projects = [
    {
      id: 1,
      title: "Thematic",
      category: "App Development • iOS",
      img: "app-1.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      desc: "Top color widgets custom theme manager.",
      links: [
        { type: "ios", url: "https://apps.apple.com/us/app/thematic-top-color-widgets/id6443969105" }
      ]
    },
    {
      id: 2,
      title: "Stock Alerts BG",
      category: "App Development • iOS / Android",
      img: "product-1.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      desc: "Real-time stock price alerts, alarm, and portfolio tracker.",
      links: [
        { type: "android", url: "https://play.google.com/store/apps/details?id=com.paytar2800.stockapp" },
        { type: "ios", url: "https://apps.apple.com/us/app/stock-alerts-bg-alarm-tracker/id1516076712" }
      ]
    },
    {
      id: 3,
      title: "FoodyBazar",
      category: "Flutter • iOS / Android / Web",
      img: "foody_bazar.jpeg",
      fallbackImg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      desc: "On-demand food delivery logistics and local restaurant finder.",
      links: [
        { type: "ios", url: "https://apps.apple.com/in/app/foodybazar-food-delivery/id6738118918?platform=iphone" },
        { type: "android", url: "https://play.google.com/store/apps/details?id=com.foodyBazar.pugau_user" },
        { type: "web", url: "https://foodybazar.com/location" }
      ]
    },
    {
      id: 4,
      title: "Lightkit",
      category: "App Development • iOS",
      img: "lightkit.jpeg",
      fallbackImg: "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?auto=format&fit=crop&w=800&q=80",
      desc: "Lightroom preset filters and premium photography effects editor.",
      links: [
        { type: "ios", url: "https://apps.apple.com/us/app/lightkit-themes-for-lightroom/id6444389566" }
      ]
    },
    {
      id: 22,
      title: "Valentine Multiplex",
      category: "App Development • Android",
      img: "product-9.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
      desc: "Multiplex cinema ticket booking and showtimes explorer.",
      links: [
        { type: "android", url: "https://play.google.com/store/apps/details?id=com.accreteit.valentinemultiplex" }
      ]
    },
    {
      id: 5,
      title: "WTW",
      category: "App Development • iOS / Android",
      img: "product-2.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
      desc: "What to Where social discovery and local clothing guide app.",
      links: [
        { type: "android", url: "https://play.google.com/store/apps/details?id=co.wtw&hl=en-IN" },
        { type: "ios", url: "https://apps.apple.com/us/app/wtw-what-to-where/id1659178179" }
      ]
    },
    {
      id: 6,
      title: "Bookchoice",
      category: "Flutter • iOS / Android",
      img: "branding-2.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      desc: "Monthly selection of books and audiobooks with offline reader support.",
      links: [
        { type: "ios", url: "https://apps.apple.com/nl/app/bookchoice/id1178630984" },
        { type: "android", url: "https://play.google.com/store/apps/details?id=com.tnex.bookchoice" }
      ]
    },
    {
      id: 7,
      title: "Car Washer App",
      category: "App Development • Android",
      img: "product-3.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      desc: "On-demand mobile car wash booking and scheduling platform.",
      links: [
        { type: "android", url: "https://play.google.com/store/apps/details?id=com.app.carwasher.client" }
      ]
    },
    {
      id: 8,
      title: "StayFit",
      category: "App Development • iOS",
      img: "app-4.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
      desc: "Stay Active daily workout log, step tracker, and diet journal.",
      links: [
        { type: "ios", url: "https://appadvice.com/app/stayfit-stay-active/1375788769" }
      ]
    },
    {
      id: 9,
      title: "TechMae",
      category: "App Development • iOS / Android",
      img: "product-4.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80",
      desc: "Private social network for women with real-time audio rooms and groups.",
      links: [
        { type: "android", url: "https://play.google.com/store/apps/details?id=com.webinovationhub.techmae" },
        { type: "ios", url: "https://apps.apple.com/us/app/techmae/id1458730170" }
      ]
    },
    {
      id: 10,
      title: "Well That's Me",
      category: "Flutter • iOS",
      img: "branding-4.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&w=800&q=80",
      desc: "A general social platform for sharing hobbies, interests, and community engagement.",
      links: [
        { type: "ios", url: "https://appadvice.com/app/well-thats-me/1565855015" }
      ]
    },
    {
      id: 11,
      title: "SparkDx",
      category: "App Development • Android",
      img: "product-5.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=800&q=80",
      desc: "Rapid diagnostic test reader interface for medical personnel.",
      links: [
        { type: "android", url: "https://play.google.com/store/apps/details?id=com.spark.reader" }
      ]
    },
    {
      id: 12,
      title: "FlexGiving",
      category: "Flutter • Android / Web",
      img: "branding-5.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
      desc: "Staffing and deployment platform for flexible workers in education, helping school boards manage availability and substitute replacements.",
      links: [
        { type: "android", url: "https://play.google.com/store/apps/details?id=com.flexgiving.app" },
        { type: "web", url: "https://flexgivingdev.web.app" }
      ]
    },
    {
      id: 13,
      title: "Spark DietTracker",
      category: "App Development • Android",
      img: "product-6.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      desc: "Personalized calorie intake tracker and weight planning logs.",
      links: [
        { type: "android", url: "https://play.google.com/store/apps/details?id=com.diettracker.developerAndroid" }
      ]
    },
    {
      id: 14,
      title: "SalesTrendz",
      category: "App Development • iOS",
      img: "app-7.jpeg",
      fallbackImg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      desc: "Field sales force automation and order booking software.",
      links: [
        { type: "ios", url: "https://apps.apple.com/in/app/salestrendz/id1438968604?platform=iphone" }
      ]
    },
    {
      id: 15,
      title: "QTX",
      category: "App Development • Android",
      img: "product-7.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
      desc: "Performance coaching analytics and client logging tools.",
      links: [
        { type: "android", url: "https://play.google.com/store/apps/details?id=qtx.xinperformance.android" }
      ]
    },
    {
      id: 16,
      title: "Eatearnity",
      category: "Flutter • iOS",
      img: "branding-7.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80",
      desc: "Restaurant review and localized discount mapping platform.",
      links: [
        { type: "ios", url: "https://appadvice.com/app/eatearnity/1577856054" }
      ]
    },
    {
      id: 17,
      title: "Audtra",
      category: "App Development • iOS",
      img: "app-8.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&w=800&q=80",
      desc: "Audio social networking platform for voice messages and updates.",
      links: [
        { type: "ios", url: "https://apps.apple.com/us/app/audtra-audio-social-network/id1120179825" }
      ]
    },
    {
      id: 18,
      title: "BreonLWS",
      category: "App Development • Android",
      img: "product-8.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=800&q=80",
      desc: "Lone worker safety tracking with offline sync and maps.",
      links: [
        { type: "android", url: "https://play.google.com/store/apps/details?id=breon.telematics.loneworkersafetyapp.android" }
      ]
    },
    {
      id: 19,
      title: "Moneylife",
      category: "App Development • Android",
      img: "product-10.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
      desc: "News, views, and financial market research alerts.",
      links: [
        { type: "android", url: "https://play.google.com/store/apps/details?id=in.moneylife.newsandviews" }
      ]
    },
    {
      id: 20,
      title: "EpicLife App",
      category: "App Development • iOS / Android",
      img: "product-11.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      desc: "Lifestyle journaling and wellness habits tracking dashboard.",
      links: [
        { type: "android", url: "https://play.google.com/store/apps/details?id=tv.creativelab.epiclife.app" },
        { type: "ios", url: "https://apps.apple.com/pl/app/epiclife-app/id1437749770?platform=iphone" }
      ]
    },
    {
      id: 21,
      title: "Divine Dive",
      category: "App Development • iOS",
      img: "app-9.jpeg",
      fallbackImg: "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?auto=format&fit=crop&w=800&q=80",
      desc: "Holy Bible Daily study companion and devotion tracking.",
      links: [
        { type: "ios", url: "https://apps.apple.com/in/app/divine-dive-holy-bible-daily/id6475622721?platform=iphone" }
      ]
    },
    {
      id: 23,
      title: "MyTrailPals",
      category: "Web Development • React / Node.js",
      img: "mytrailpals.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      desc: "Community-driven marketplace and platform connecting outdoor enthusiasts for hiking, trail running, and wellness adventures.",
      links: [
        { type: "web", url: "https://www.mytrailpals.com/" }
      ]
    },
    {
      id: 24,
      title: "Invited",
      category: "React Native • AI Event Reminders",
      img: "invited.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      desc: "AI-powered invitation reminder app. Scans and uploads invitation cards to automatically extract event details and set smart reminders.",
      links: [
        { type: "web", url: "https://invited.kraftostech.com", label: "Link" }
      ]
    },
    {
      id: 25,
      title: "Ez-Retail",
      category: "App Development • Android",
      img: "ezretail.png",
      fallbackImg: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
      desc: "B2B price-coding & POS connectivity app. Simplifies inventory management and barcode scanning for retail store networks.",
      links: [
        { type: "android", url: "https://play.google.com/store/apps/details?id=com.ezretail.excelreader" }
      ]
    },
    {
      id: 26,
      title: "Blostem",
      category: "App Development • iOS / Android",
      img: "blostem.png",
      fallbackImg: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=800&q=80",
      desc: "Fintech banking infrastructure SDK. Provides a unified API and embeddable white-label SDK for Super Apps to offer FDs, RDs, and UPI credit lines.",
      links: [
        { type: "web", url: "https://www.blostem.com/", label: "Link" }
      ]
    },
    {
      id: 27,
      title: "Tiffinwala",
      category: "Flutter • iOS / Android / Web",
      img: "tiffinwala.jpg",
      fallbackImg: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      desc: "Connects users with local home chefs providing home-cooked tiffin services, dry snacks, and fresh homemade meals.",
      links: [
        { type: "web", url: "https://tiffinwala.co/" }
      ]
    }
  ];

  const filters = useMemo(() => [
    { id: 'all', label: 'All' },
    { id: 'ios', label: 'iOS' },
    { id: 'android', label: 'Android' },
    { id: 'flutter', label: 'Flutter' },
    { id: 'web', label: 'Web' },
    { id: 'react-native', label: 'React Native' }
  ], []);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      if (activeFilter === 'all') return true;
      const cat = project.category.toLowerCase();
      if (activeFilter === 'flutter') {
        return cat.includes('flutter');
      }
      if (activeFilter === 'react-native') {
        return cat.includes('react-native') || cat.includes('react native');
      }
      if (activeFilter === 'web') {
        return cat.includes('web development');
      }
      if (activeFilter === 'ios') {
        return cat.includes('ios') && !cat.includes('flutter') && !cat.includes('react-native') && !cat.includes('react native') && !cat.includes('web development');
      }
      if (activeFilter === 'android') {
        return cat.includes('android') && !cat.includes('flutter') && !cat.includes('react-native') && !cat.includes('react native') && !cat.includes('web development');
      }
      return false;
    });
  }, [activeFilter]);

  const displayedProjects = useMemo(() => {
    return showAll ? filteredProjects : filteredProjects.slice(0, 6);
  }, [filteredProjects, showAll]);

  const handleFilterChange = (filterId) => {
    if (filterId === activeFilter) return;
    setIsTransitioning(true);
    setActiveFilter(filterId);
    setShowAll(false);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const handleViewMoreClick = () => {
    if (showAll) {
      if (sectionRef.current && viewMoreBtnRef.current) {
        // 1. Lock the current expanded height to prevent the browser from snapping/jumping
        const currentHeight = sectionRef.current.offsetHeight;
        sectionRef.current.style.minHeight = `${currentHeight}px`;

        // 2. Collapse the projects list
        setShowAll(false);

        // 3. Scroll smoothly to the View More button using Lenis
        setTimeout(() => {
          if (window.lenis && viewMoreBtnRef.current) {
            window.lenis.scrollTo(viewMoreBtnRef.current, {
              offset: -window.innerHeight / 2 + 30, // Centers the button perfectly in viewport
              duration: 1.0,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo out curve for ultra-premium feel
              onComplete: () => {
                // 4. Reset the minHeight and refresh ScrollTrigger once smooth scroll finishes
                if (sectionRef.current) {
                  sectionRef.current.style.minHeight = '';
                  ScrollTrigger.refresh();
                }
              }
            });
          } else if (viewMoreBtnRef.current) {
            // Native fallback if Lenis is not available
            viewMoreBtnRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              if (sectionRef.current) {
                sectionRef.current.style.minHeight = '';
                ScrollTrigger.refresh();
              }
            }, 850);
          }
        }, 50);
      } else {
        setShowAll(false);
      }
    } else {
      setShowAll(true);
    }
  };

  // Track whether the mouse has actually moved (preventing scroll-induced hovers)
  useEffect(() => {
    const handleGlobalMouseMove = () => {
      window.isMouseActive = true;
    };
    const handleGlobalScroll = () => {
      window.isMouseActive = false;
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('scroll', handleGlobalScroll, { passive: true });
    window.isMouseActive = false;

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('scroll', handleGlobalScroll);
    };
  }, []);

  // Refresh ScrollTrigger when grid layout changes (activeFilter or showAll changes) to prevent height offset issues in lower sections (like Testimonials and Contact/Footer)
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);
    return () => clearTimeout(timer);
  }, [showAll, activeFilter]);

  // GSAP animation for header elements
  useEffect(() => {
    if (!sectionRef.current) return;

    const mm = gsap.matchMedia();

    // Desktop: Scroll-scrubbed reveal
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        }
      });

      tl.fromTo(labelRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(headlineRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");
    });

    // Mobile: Fast single entry fade-in once
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          once: true,
        }
      });

      tl.fromTo([labelRef.current, headlineRef.current],
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
      id="portfolio"
      ref={sectionRef}
      className="relative w-full bg-transparent pt-20 pb-20 md:pt-28 md:pb-28 z-20 overflow-x-hidden"
    >
      {/* Title Header */}
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 mb-12 md:mb-16">
        <div ref={headlineRef} className="will-change-transform text-left">
          <span ref={labelRef} className="font-sans text-xs font-semibold text-gray-light uppercase tracking-wider block mb-3 will-change-transform">
            Our Work
          </span>
          <h2 className="font-display font-semibold text-[40px] md:text-[64px] leading-tight text-white mb-4 tracking-[-0.02em]">
            Selected Works
          </h2>
          <p className="font-sans text-[18px] md:text-[20px] text-gray-medium leading-relaxed max-w-2xl">
            Three years of creative excellence. Each project a collaboration. Each result, a masterpiece.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 mb-12 md:mb-16">
        <div className="overflow-x-auto no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
          <div className="flex gap-2 p-1.5 bg-charcoal/80 backdrop-blur-md border border-border/60 rounded-full min-w-max w-max">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => handleFilterChange(filter.id)}
                  className={`px-5 py-2 text-[11px] font-sans font-semibold uppercase tracking-wider rounded-full border transition-all duration-300 cursor-pointer outline-none active:scale-[0.96] ${
                    isActive
                      ? 'bg-[#ff7a1a]/15 border-[#ff7a1a]/30 text-[#ff7a1a] orange-glow-text'
                      : 'bg-transparent border-transparent text-gray-medium hover:text-white hover:bg-white/5'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Showcase Area */}
      <div className="w-full relative z-20">
        {isTransitioning ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto px-6 md:px-12">
            {[...Array(6)].map((_, i) => (
              <ProjectCardSkeleton key={i} isMarquee={false} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto px-6 md:px-12 animate-project-fade-in">
            {displayedProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                isMarquee={false}
              />
            ))}
          </div>
        )}

        {/* View More / View Less Button */}
        {filteredProjects.length > 6 && !isTransitioning && (
          <div ref={viewMoreBtnRef} className="flex justify-center mt-12 md:mt-16">
            <button
              onClick={handleViewMoreClick}
              className="px-8 py-4 bg-[#ff7a1a]/15 text-[#ffa260] border border-[#ff7a1a]/30 font-bold rounded-full hover:bg-[#ff7a1a] hover:text-[#070707] hover:border-transparent transition-all duration-300 cursor-pointer text-sm tracking-wide uppercase flex items-center gap-2 group active:scale-[0.97]"
            >
              {showAll ? (
                <>
                  View Less
                  <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1">↑</span>
                </>
              ) : (
                <>
                  View More ({filteredProjects.length - 6} more)
                  <span className="inline-block transition-transform duration-300 group-hover:translate-y-1">↓</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

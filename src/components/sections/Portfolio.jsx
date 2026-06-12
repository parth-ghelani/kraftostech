import React, { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Stylized Skeleton Loader for smooth portfolio card transitions
const ProjectCardSkeleton = () => {
  return (
    <div className="w-full flex flex-col bg-charcoal border border-border overflow-hidden animate-pulse">
      {/* Image Frame Skeleton */}
      <div className="w-full aspect-[16/10] bg-subtle-bg relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border border-border/40 bg-charcoal/50 flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-light/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      
      {/* Text Area Skeleton */}
      <div className="p-6 md:p-8 flex flex-col justify-start text-left bg-charcoal gap-3">
        <div className="h-3.5 bg-border/40 rounded w-1/4"></div>
        <div className="h-6 bg-border/60 rounded w-3/5 my-1"></div>
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="h-3 bg-border/30 rounded w-full"></div>
          <div className="h-3 bg-border/30 rounded w-4/5"></div>
        </div>
        <div className="flex gap-2 mt-4 pt-4 border-t border-border/30">
          <div className="h-7 bg-border/40 rounded w-20"></div>
          <div className="h-7 bg-border/40 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};


// Memoized ProjectCard component outside the parent function to prevent reconstruction on every render
const ProjectCard = React.memo(({ project, style }) => {
  return (
    <div
      style={style}
      className="w-full flex flex-col bg-charcoal border border-border group overflow-hidden animate-project-fade-in"
    >
      {/* Image Frame */}
      <div className="w-full overflow-hidden aspect-[16/10] bg-subtle-bg relative">
        <img
          src={`/images/portfolio/${project.img}`}
          alt={project.title}
          onError={(e) => {
            e.target.src = project.fallbackImg;
          }}
          className="w-full h-full object-cover transition-transform duration-[600ms] ease-out scale-100 group-hover:scale-102"
        />
      </div>

      {/* Text Area */}
      <div className="p-6 md:p-8 flex flex-col justify-start text-left bg-charcoal">
        <span className="font-sans text-[13px] text-gray-light uppercase tracking-wider mb-2 block">
          {project.category}
        </span>
        <h3 className="font-display font-semibold text-[22px] md:text-[24px] leading-tight text-white mb-3">
          {project.title}
        </h3>
        <p className="font-sans text-[15px] md:text-[16px] leading-[1.6] text-gray-medium line-clamp-2">
          {project.desc}
        </p>

        {project.links && project.links.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-border/30">
            {project.links.map((link, idx) => {
              if (link.type === 'ios') {
                return (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-[#ff7a1a]/15 border border-white/10 hover:border-[#ff7a1a]/40 text-white hover:text-[#ff7a1a] text-[10px] font-sans font-medium uppercase tracking-wider transition-colors duration-200"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C3.79 16.3 3.03 9.4 6.74 8.72c1.45-.26 2.5.39 3.33.39.83 0 2.26-.74 4-.54 1.77.2 3.12.98 3.84 2.24-3.52 2.1-2.95 6.84.44 8.21-.69 1.7-1.45 3.32-2.3 4.26zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.21 2.5-2.11 4.42-3.74 4.25z"/>
                    </svg>
                    App Store
                  </a>
                );
              }
              if (link.type === 'android') {
                return (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-[#ff7a1a]/15 border border-white/10 hover:border-[#ff7a1a]/40 text-white hover:text-[#ff7a1a] text-[10px] font-sans font-medium uppercase tracking-wider transition-colors duration-200"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M3 5.277c0-1.611 1.738-2.628 3.144-1.84l12.83 7.19c1.436.804 1.436 2.876 0 3.68l-12.83 7.19c-1.406.788-3.144-.229-3.144-1.84V5.277z"/>
                    </svg>
                    Play Store
                  </a>
                );
              }
              if (link.type === 'web') {
                return (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-[#ff7a1a]/15 border border-white/10 hover:border-[#ff7a1a]/40 text-white hover:text-[#ff7a1a] text-[10px] font-sans font-medium uppercase tracking-wider transition-colors duration-200"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-3.5 h-3.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
                    </svg>
                    {link.label || "Web"}
                  </a>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
});
ProjectCard.displayName = 'ProjectCard';

export default function Portfolio() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const headlineRef = useRef(null);
  const gridRef = useRef(null);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);

  const [activeFilter, setActiveFilter] = useState('all');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleFilterChange = (filterId) => {
    if (filterId === activeFilter) return;
    setIsTransitioning(true);
    setActiveFilter(filterId);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 350);
  };

  const filters = useMemo(() => [
    { id: 'all', label: 'All' },
    { id: 'ios', label: 'iOS' },
    { id: 'android', label: 'Android' },
    { id: 'flutter', label: 'Flutter' },
    { id: 'web', label: 'Web' },
    { id: 'react-native', label: 'React Native' }
  ], []);

  useEffect(() => {
    // Wait for DOM to adjust and update ScrollTrigger positions
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [activeFilter]);



  useEffect(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
        onToggle: (self) => {
          const state = self.isActive ? "transform, opacity" : "auto";
          if (labelRef.current) labelRef.current.style.willChange = state;
          if (headlineRef.current) headlineRef.current.style.willChange = state;
          if (gridRef.current) gridRef.current.style.willChange = state;
        }
      }
    });

    tl.fromTo(labelRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 })
      .fromTo(headlineRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
      .fromTo(gridRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.0 }, "-=0.4");

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const col1 = col1Ref.current;
    const col2 = col2Ref.current;
    const col3 = col3Ref.current;
    const container = gridRef.current;

    if (!col1 || !col2 || !col3 || !container) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Group the 3 columns into a single ScrollTrigger timeline on the container grid to minimize triggers
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            onToggle: (self) => {
              const state = self.isActive ? "transform" : "auto";
              col1.style.willChange = state;
              col2.style.willChange = state;
              col3.style.willChange = state;
            }
          }
        });

        // Left column (col1) moves up on scroll
        tl.fromTo(col1, { y: 0 }, { y: -80, ease: "none" }, 0);
        
        // Right column (col3) moves up on scroll
        tl.fromTo(col3, { y: 0 }, { y: -80, ease: "none" }, 0);

        // Middle column (col2) moves down on scroll (starts shifted up, slides down to normal)
        tl.fromTo(col2, { y: -80 }, { y: 0, ease: "none" }, 0);
      });
    });

    return () => ctx.revert();
  }, []);

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
      desc: "Daily video self-reflection diary and emotional intelligence journal.",
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
      desc: "Unified non-profit charity donations tracking and portal.",
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
    }
  ];

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

  const col1Projects = [];
  const col2Projects = [];
  const col3Projects = [];

  filteredProjects.forEach((project, idx) => {
    const projectWithIndex = { ...project, indexInList: idx };
    if (activeFilter === 'all' && idx === filteredProjects.length - 1) {
      col2Projects.push(projectWithIndex);
    } else {
      const rem = idx % 3;
      if (rem === 0) col1Projects.push(projectWithIndex);
      else if (rem === 1) col2Projects.push(projectWithIndex);
      else col3Projects.push(projectWithIndex);
    }
  });


  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative w-full bg-transparent pt-20 pb-20 md:pt-28 md:pb-28 z-20 overflow-x-hidden"
    >
      <div ref={headlineRef} className="max-w-[1400px] w-full mx-auto px-6 md:px-12 text-left mb-16 md:mb-24 will-change-transform">
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

      {/* Filter Tabs */}
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 mb-12 block md:flex md:justify-start">
        <div className="w-auto md:w-auto overflow-x-auto no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
          <div className="flex md:inline-flex gap-2 p-1.5 bg-charcoal/80 backdrop-blur-md border border-border/60 rounded-full min-w-max">
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

      <div className="w-full flex flex-col gap-6 md:hidden px-6">
        {isTransitioning ? (
          <>
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </>
        ) : (
          filteredProjects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} style={{ animationDelay: `${idx * 50}ms` }} />
          ))
        )}
      </div>

      <div 
        ref={gridRef} 
        className="max-w-[1400px] w-full mx-auto px-6 md:px-12 hidden md:grid md:grid-cols-3 gap-6 md:gap-8 relative"
      >
        <div 
          ref={col1Ref} 
          className="flex flex-col gap-6 md:gap-8 will-change-transform"
        >
          {isTransitioning ? (
            <>
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </>
          ) : (
            col1Projects.map((project) => (
              <ProjectCard key={project.id} project={project} style={{ animationDelay: `${project.indexInList * 50}ms` }} />
            ))
          )}
        </div>

        <div 
          ref={col2Ref} 
          className="flex flex-col gap-6 md:gap-8 will-change-transform"
        >
          {isTransitioning ? (
            <>
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </>
          ) : (
            col2Projects.map((project) => (
              <ProjectCard key={project.id} project={project} style={{ animationDelay: `${project.indexInList * 50}ms` }} />
            ))
          )}
        </div>

        <div 
          ref={col3Ref} 
          className="flex flex-col gap-6 md:gap-8 will-change-transform"
        >
          {isTransitioning ? (
            <>
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </>
          ) : (
            col3Projects.map((project) => (
              <ProjectCard key={project.id} project={project} style={{ animationDelay: `${project.indexInList * 50}ms` }} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

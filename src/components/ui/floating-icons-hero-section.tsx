import * as React from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

// Interface for the props of each individual icon.
interface IconProps {
  id: number;
  name?: string; // Optional short name of the tech
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  className: string; // Used for custom positioning of the icon.
  hideOnMobile?: boolean; // Optional flag to filter out on narrow screens
}

// Interface for the main hero component's props.
export interface FloatingIconsHeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  icons: IconProps[];
}

// A single icon component with its own motion logic
const Icon = ({
  mouseX,
  mouseY,
  iconData,
  index,
  isInView,
  iconsPhysics,
  registerIcon,
  updateIconDisplacement,
}: {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
  iconData: IconProps;
  index: number;
  isInView: boolean;
  iconsPhysics: React.MutableRefObject<Array<{ id: number; anchorX: number; anchorY: number; x: number; y: number }>>;
  registerIcon: (id: number, anchorX: number, anchorY: number) => void;
  updateIconDisplacement: (id: number, x: number, y: number) => void;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Keep the name tooltip visible for 2.5 seconds after leaving
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 2500);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Motion values for the icon's position, with spring physics for smooth movement
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const centerRef = React.useRef({ x: 0, y: 0 });
  const sectionInfoRef = React.useRef({ pageTop: 0, height: 0 });
  const contentSizeRef = React.useRef({ width: 560, height: 450 });

  // Cache coordinates relative to the document so they don't shift with scrolling
  const updatePosition = React.useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const sectionEl = ref.current.closest('section');
      let sectionPageTop = 0;
      let sectionHeight = window.innerHeight;
      let contentWidth = window.innerWidth < 768 ? window.innerWidth * 0.45 : 560;
      let contentHeight = window.innerWidth < 768 ? window.innerHeight * 0.7 : 450;

      if (sectionEl) {
        const sectionRect = sectionEl.getBoundingClientRect();
        sectionPageTop = sectionRect.top + window.scrollY;
        sectionHeight = sectionRect.height;

        const contentEl = sectionEl.querySelector('.tech-stack-content');
        if (contentEl) {
          const contentRect = contentEl.getBoundingClientRect();
          contentWidth = contentRect.width;
          contentHeight = contentRect.height;
        }
      }

      const curX = x.get();
      const curY = y.get();

      centerRef.current = {
        x: rect.left + rect.width / 2 + window.scrollX - curX,
        y: rect.top + rect.height / 2 + window.scrollY - curY,
      };
      sectionInfoRef.current = {
        pageTop: sectionPageTop,
        height: sectionHeight,
      };
      contentSizeRef.current = {
        width: contentWidth,
        height: contentHeight,
      };
    }
  }, [x, y]);

  React.useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    const timer = setTimeout(updatePosition, 300); // Allow layout settlement
    return () => {
      window.removeEventListener('resize', updatePosition);
      clearTimeout(timer);
    };
  }, [updatePosition]);

  React.useEffect(() => {
    if (!isInView) {
      x.set(0);
      y.set(0);
      updateIconDisplacement(iconData.id, 0, 0);
      return;
    }

    let animationFrameId: number;

    const tick = () => {
      const curAnchorX = centerRef.current.x;
      const curAnchorY = centerRef.current.y;
      
      registerIcon(iconData.id, curAnchorX, curAnchorY);

      const mousePageX = mouseX.current + window.scrollX;
      const mousePageY = mouseY.current + window.scrollY;

      const curX = x.get();
      const curY = y.get();
      let posX = curAnchorX + curX;
      let posY = curAnchorY + curY;

      let forceX = 0;
      let forceY = 0;

      const isMobile = window.innerWidth < 768;
      const iconHalfSize = isMobile ? 20 : 40;

      // A. Mouse Repulsion Force
      const mouseDist = Math.sqrt(
        Math.pow(mousePageX - posX, 2) + Math.pow(mousePageY - posY, 2)
      );

      if (mouseDist < 160) {
        const angle = Math.atan2(posY - mousePageY, posX - mousePageX);
        const strength = (1 - mouseDist / 160) * 70; // 70px push from mouse
        forceX += Math.cos(angle) * strength;
        forceY += Math.sin(angle) * strength;
      }

      // B. Mutual Repulsion Force (North-North Magnet Repel between logos to prevent overlap)
      const threshold = 140; // Repel if centers are within 140px of each other
      const minDist = 100; // Target minimum distance between icon centers to prevent touching
      const baseRepelStrength = 45; // Strength of mutual repulsion

      iconsPhysics.current.forEach(other => {
        if (other.id === iconData.id) return;

        const otherPosX = other.anchorX + other.x;
        const otherPosY = other.anchorY + other.y;

        const dist = Math.sqrt(
          Math.pow(posX - otherPosX, 2) + Math.pow(posY - otherPosY, 2)
        );

        if (dist < threshold && dist > 1) {
          const angle = Math.atan2(posY - otherPosY, posX - otherPosX);
          
          // Base magnetic repulsion
          let strength = (1 - dist / threshold) * baseRepelStrength;
          
          // Next-level repulsion if they get closer than minDist to prevent overlap/touching
          if (dist < minDist) {
            const overlapRatio = (minDist - dist) / minDist; // 0 to 1
            strength += Math.pow(overlapRatio, 2) * 150; // Extra heavy push to ensure they never touch
          }

          forceX += Math.cos(angle) * strength;
          forceY += Math.sin(angle) * strength;
        }
      });

      // C. Center Text Box Repulsion (No-fly zone for icons under the text)
      const deadZoneWidth = contentSizeRef.current.width + (isMobile ? 24 : 40);
      const deadZoneHeight = contentSizeRef.current.height + (isMobile ? 24 : 40);
      
      const sectionPageTop = sectionInfoRef.current.pageTop;
      const sectionHeight = sectionInfoRef.current.height;
      const sectionPageCenterY = sectionHeight > 0 ? (sectionPageTop + sectionHeight / 2) : (window.scrollY + window.innerHeight / 2);

      const dxAnchor = curAnchorX - (window.scrollX + window.innerWidth / 2);
      const dyAnchor = curAnchorY - sectionPageCenterY;
      const dxCurrent = posX - (window.scrollX + window.innerWidth / 2);
      const dyCurrent = posY - sectionPageCenterY;
      
      const inDeadZoneX = Math.abs(dxAnchor) < (deadZoneWidth / 2 + iconHalfSize) || Math.abs(dxCurrent) < (deadZoneWidth / 2 + iconHalfSize);
      const inDeadZoneY = Math.abs(dyAnchor) < (deadZoneHeight / 2 + iconHalfSize) || Math.abs(dyCurrent) < (deadZoneHeight / 2 + iconHalfSize);

      if (inDeadZoneX && inDeadZoneY) {
        // Push horizontally to the nearest side (left or right)
        const dx = Math.abs(dxAnchor) < Math.abs(dxCurrent) ? dxAnchor : dxCurrent;
        const pushDirectionX = dx >= 0 ? 1 : -1;
        const targetPosX = (window.scrollX + window.innerWidth / 2) + pushDirectionX * (deadZoneWidth / 2 + iconHalfSize + 15);
        const forceToPush = (targetPosX - posX) * 0.35; // strong correction force
        forceX += forceToPush;
      }

      // E. Navbar / Flying Logo Dead-Zone (Top Center of Viewport)
      const navDeadZoneWidth = isMobile ? window.innerWidth * 0.75 : 560;
      const navDeadZoneHeight = isMobile ? 120 : 155;

      const dnxAnchor = curAnchorX - (window.scrollX + window.innerWidth / 2);
      const dnyAnchor = curAnchorY - window.scrollY;
      const dnxCurrent = posX - (window.scrollX + window.innerWidth / 2);
      const dnyCurrent = posY - window.scrollY;

      const inNavDeadZoneX = Math.abs(dnxAnchor) < (navDeadZoneWidth / 2 + iconHalfSize) || Math.abs(dnxCurrent) < (navDeadZoneWidth / 2 + iconHalfSize);
      const inNavDeadZoneY = dnyAnchor < (navDeadZoneHeight + iconHalfSize) || dnyCurrent < (navDeadZoneHeight + iconHalfSize);



      if (inNavDeadZoneX && inNavDeadZoneY) {
        // Push horizontally to the sides
        const dnx = Math.abs(dnxAnchor) < Math.abs(dnxCurrent) ? dnxAnchor : dnxCurrent;
        const pushDirectionX = dnx >= 0 ? 1 : -1;
        const targetPosX = (window.scrollX + window.innerWidth / 2) + pushDirectionX * (navDeadZoneWidth / 2 + iconHalfSize + 15);
        const forceToPushX = (targetPosX - posX) * 0.35;
        forceX += forceToPushX;
        
        // Also add a soft downward force to push it below the navbar
        const targetPosY = window.scrollY + navDeadZoneHeight + iconHalfSize + 15;
        const forceToPushY = (targetPosY - posY) * 0.35;
        forceY += forceToPushY;
      }

      // Damp/lerp the force changes to prevent numerical oscillation (shaking/vibration)
      const lerpFactor = 0.08;
      let nextX = curX + (forceX - curX) * lerpFactor;
      let nextY = curY + (forceY - curY) * lerpFactor;

      // D. Section/Viewport Clamping (Gather at the bottom viewport edge when entering, scroll off-screen naturally at the top)
      const horizontalMargin = iconHalfSize + (isMobile ? 12 : 24);
      const verticalMargin = iconHalfSize + (isMobile ? 12 : 24);

      const computedPosX = curAnchorX + nextX;
      const computedPosY = curAnchorY + nextY;

      const clampedPosX = Math.max(window.scrollX + horizontalMargin, Math.min(window.scrollX + window.innerWidth - horizontalMargin, computedPosX));

      // Always allow icons to scroll off-screen naturally at the top (never clump at the top viewport edge)
      const clampMinY = (sectionPageTop > 0 && sectionHeight > 0)
        ? (sectionPageTop + verticalMargin)
        : (window.scrollY + verticalMargin);

      // Clamp to bottom viewport edge when entering, but scroll off-screen at the bottom section edge
      const clampMaxY = (sectionPageTop > 0 && sectionHeight > 0)
        ? (Math.min(sectionPageTop + sectionHeight, window.scrollY + window.innerHeight) - verticalMargin)
        : (window.scrollY + window.innerHeight - verticalMargin);

      const clampedPosY = Math.max(clampMinY, Math.min(clampMaxY, computedPosY));

      nextX = clampedPosX - curAnchorX;
      nextY = clampedPosY - curAnchorY;

      x.set(nextX);
      y.set(nextY);
      updateIconDisplacement(iconData.id, nextX, nextY);

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, x, y, mouseX, mouseY, iconData.id, registerIcon, updateIconDisplacement, iconsPhysics]);

  return (
    <motion.div
      ref={ref}
      key={iconData.id}
      style={{
        x: springX,
        y: springY,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.04, // Reduced delay for faster initial visual loading
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn('absolute z-10 flex flex-col items-center', iconData.className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Inner wrapper for the floating animation — pauses when off-screen */}
      <motion.div
        className="flex items-center justify-center w-10 h-10 p-2 md:w-20 md:h-20 md:p-3 rounded-xl md:rounded-3xl shadow-lg md:shadow-xl bg-[#121212] border border-white/10"
        animate={isInView ? {
          y: [0, -8, 0, 8, 0],
          x: [0, 6, 0, -6, 0],
          rotate: [0, 5, 0, -5, 0],
        } : {
          y: 0,
          x: 0,
          rotate: 0
        }}
        transition={{
          duration: 5 + Math.random() * 5,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      >
        <iconData.icon className="w-5 h-5 md:w-10 md:h-10 text-foreground" />
      </motion.div>

      {/* Revealed Name Tooltip */}
      <AnimatePresence>
        {showTooltip && iconData.name && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#ff7a1a] bg-[#120d09]/95 border border-white/10 rounded-lg shadow-xl whitespace-nowrap z-30 pointer-events-none"
          >
            {iconData.name}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FloatingIconsHero = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FloatingIconsHeroProps
>(({ className, title, subtitle, ctaText, ctaHref, icons, ...props }, ref) => {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = React.useState(true);

  React.useImperativeHandle(ref, () => sectionRef.current!);

  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    
    // De-activate mouse tracking and continuous floating loops when section is fully out of viewport
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.05 });
    
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Refs to track the raw mouse position
  const mouseX = React.useRef(0);
  const mouseY = React.useRef(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    mouseX.current = event.clientX;
    mouseY.current = event.clientY;
  };

  // Shared ref holding the physics state of all icons:
  const iconsPhysics = React.useRef<Array<{
    id: number;
    anchorX: number;
    anchorY: number;
    x: number;
    y: number;
  }>>([]);

  const registerIcon = React.useCallback((id: number, anchorX: number, anchorY: number) => {
    const arr = iconsPhysics.current;
    const index = arr.findIndex(p => p.id === id);
    if (index !== -1) {
      arr[index].anchorX = anchorX;
      arr[index].anchorY = anchorY;
    } else {
      arr.push({ id, anchorX, anchorY, x: 0, y: 0 });
    }
  }, []);

  const updateIconDisplacement = React.useCallback((id: number, x: number, y: number) => {
    const arr = iconsPhysics.current;
    const index = arr.findIndex(p => p.id === id);
    if (index !== -1) {
      arr[index].x = x;
      arr[index].y = y;
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className={cn(
        'relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-background',
        className
      )}
      {...props}
    >
      {/* Container for the background floating icons */}
      <div className="absolute inset-0 w-full h-full">
        {icons.map((iconData, index) => (
          <Icon
            key={iconData.id}
            mouseX={mouseX}
            mouseY={mouseY}
            iconData={iconData}
            index={index}
            isInView={isInView}
            iconsPhysics={iconsPhysics}
            registerIcon={registerIcon}
            updateIconDisplacement={updateIconDisplacement}
          />
        ))}
      </div>

      {/* Container for the foreground content */}
      <div className="relative z-20 text-center px-4 tech-stack-content max-w-[290px] md:max-w-none mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text">
          {title}
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-lg text-muted-foreground">
          {subtitle}
        </p>
        <div className="mt-10 flex justify-center">
          <Button asChild className="relative text-sm font-semibold rounded-full h-12 p-1 ps-8 pe-16 group transition-all duration-500 hover:ps-16 hover:pe-8 w-fit overflow-hidden cursor-pointer bg-[#ff7a1a] text-black border-transparent hover:bg-white hover:text-black">
            <a href={ctaHref} className="flex items-center">
              <span className="relative z-10 transition-all duration-500">
                {ctaText}
              </span>
              <div className="absolute right-1 top-1 w-10 h-10 bg-[#070707] text-white rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                <ArrowUpRight size={16} />
              </div>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
});

FloatingIconsHero.displayName = 'FloatingIconsHero';

export { FloatingIconsHero };

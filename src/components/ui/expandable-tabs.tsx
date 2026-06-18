"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useOnClickOutside } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Tab {
  title: string;
  icon: LucideIcon;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
}

interface Placeholder {
  type: "placeholder";
  title?: never;
  icon?: never;
}

type TabItem = Tab | Separator | Placeholder;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  activeTab?: number | null;
  onChange?: (index: number | null) => void;
  placeholderRef?: React.RefObject<HTMLDivElement | null>;
}

const buttonVariants = {
  initial: (custom: { isExpanded: boolean; isDesktop: boolean }) => ({
    gap: 0,
    paddingLeft: custom?.isDesktop ? ".5rem" : "0.25rem",
    paddingRight: custom?.isDesktop ? ".5rem" : "0.25rem",
  }),
  animate: (custom: { isExpanded: boolean; isDesktop: boolean }) => ({
    gap: custom?.isExpanded ? ".5rem" : 0,
    paddingLeft: custom?.isExpanded ? "1rem" : (custom?.isDesktop ? ".5rem" : "0.25rem"),
    paddingRight: custom?.isExpanded ? "1rem" : (custom?.isDesktop ? ".5rem" : "0.25rem"),
  }),
};

const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "text-primary",
  activeTab = null,
  onChange,
  placeholderRef,
}: ExpandableTabsProps) {
  const [selected, setSelected] = React.useState<number | null>(null);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const outsideClickRef = React.useRef(null);

  React.useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 640);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  useOnClickOutside(outsideClickRef, () => {
    setSelected(null);
    onChange?.(null);
  });

  const handleSelect = (index: number) => {
    setSelected(index);
    onChange?.(index);
  };

  const Separator = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-white/10" aria-hidden="true" />
  );

  const placeholderIndex = tabs.findIndex((tab) => tab.type === "placeholder");
  const leftEndIndex = placeholderIndex !== -1 ? placeholderIndex : 3;

  return (
    <motion.div
      ref={outsideClickRef}
      onMouseLeave={() => setHovered(null)}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 30,
      }}
      className={cn(
        "grid grid-cols-[1fr_40px_1fr] sm:grid-cols-[1fr_64px_1fr] items-center rounded-2xl border bg-background p-1 shadow-sm w-full",
        className
      )}
    >
      {/* Left Column - Home, About, Services */}
      <div className="flex items-center justify-between w-full px-2">
        {tabs.map((tab, index) => {
          if (index >= leftEndIndex) return null;
          if (tab.type === "separator" || tab.type === "placeholder") return null;

          const Icon = tab.icon;
          const isActive = activeTab !== null ? activeTab === index : selected === index;
          const isExpanded = isDesktop && (hovered !== null ? hovered === index : isActive);
          const isHighlighted = isActive || (isDesktop && hovered === index);

          return (
            <motion.button
              key={tab.title}
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              custom={{ isExpanded, isDesktop }}
              onMouseEnter={() => setHovered(index)}
              onClick={() => handleSelect(index)}
              transition={transition}
              style={isExpanded ? {
                boxShadow: '0 4px 20px rgba(255, 122, 26, 0.25), 0 0 10px rgba(255, 122, 26, 0.15)'
              } : undefined}
              className={cn(
                "relative inline-flex items-center justify-center rounded-xl text-[11px] sm:text-sm font-medium transition-colors duration-300 cursor-pointer select-none py-2",
                isHighlighted
                  ? cn("bg-muted", activeColor)
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={isDesktop ? 20 : 16} />
              <span
                className={cn(
                  "inline-block overflow-hidden whitespace-nowrap font-medium transition-all duration-300 ease-out",
                  isExpanded ? "w-[56px] sm:w-[72px] opacity-100 ml-1.5" : "w-0 opacity-0 ml-0"
                )}
              >
                {tab.title}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Middle Column - Fixed Spacer for Independent Floating Logo */}
      <div ref={placeholderRef} className="w-10 sm:w-16 shrink-0 pointer-events-none" />

      {/* Right Column - Services, Tech, Work, Contact */}
      <div className="flex items-center justify-between w-full px-2">
        {tabs.map((tab, index) => {
          if (index <= leftEndIndex) return null;
          if (tab.type === "separator" || tab.type === "placeholder") return null;

          const Icon = tab.icon;
          const isActive = activeTab !== null ? activeTab === index : selected === index;
          const isExpanded = isDesktop && (hovered !== null ? hovered === index : isActive);
          const isHighlighted = isActive || (isDesktop && hovered === index);

          return (
            <motion.button
              key={tab.title}
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              custom={{ isExpanded, isDesktop }}
              onMouseEnter={() => setHovered(index)}
              onClick={() => handleSelect(index)}
              transition={transition}
              style={isExpanded ? {
                boxShadow: '0 4px 20px rgba(255, 122, 26, 0.25), 0 0 10px rgba(255, 122, 26, 0.15)'
              } : undefined}
              className={cn(
                "relative inline-flex items-center justify-center rounded-xl text-[11px] sm:text-sm font-medium transition-colors duration-300 cursor-pointer select-none py-2",
                isHighlighted
                  ? cn("bg-muted", activeColor)
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={isDesktop ? 20 : 16} />
              <span
                className={cn(
                  "inline-block overflow-hidden whitespace-nowrap font-medium transition-all duration-300 ease-out",
                  isExpanded ? "w-[56px] sm:w-[72px] opacity-100 ml-1.5" : "w-0 opacity-0 ml-0"
                )}
              >
                {tab.title}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

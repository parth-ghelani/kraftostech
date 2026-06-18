"use client";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 4 wave paths — trimmed from the original 5
const PATH_DATA = [
  "M0 663C145.5 663 191 666.265 269 647C326.5 630 339.5 621 397.5 566C439 531.5 455 529.5 490 523C509.664 519.348 521 503.736 538 504.236C553.591 504.236 562.429 514.739 584.66 522.749C592.042 525.408 600.2 526.237 607.356 523.019C624.755 515.195 641.446 496.324 657 496.735C673.408 496.735 693.545 519.572 712.903 526.769C718.727 528.934 725.184 528.395 730.902 525.965C751.726 517.115 764.085 497.106 782 496.735C794.831 496.47 804.103 508.859 822.469 518.515C835.13 525.171 850.214 526.815 862.827 520.069C875.952 513.049 889.748 502.706 903.5 503.736C922.677 505.171 935.293 510.562 945.817 515.673C954.234 519.76 963.095 522.792 972.199 524.954C996.012 530.611 1007.42 534.118 1034 549C1077.5 573.359 1082.5 594.5 1140 629C1206 670 1328.5 662.5 1440 662.5",
  "M0 587.5C147 587.5 277 587.5 310 573.5C348 563 392.5 543.5 408 535C434 523.5 426 526.235 479 515.235C494 512.729 523 510.435 534.5 512.735C554.5 516.735 555.5 523.235 576 523.735C592 523.735 616 496.735 633 497.235C648.671 497.235 661.31 515.052 684.774 524.942C692.004 527.989 700.2 528.738 707.349 525.505C724.886 517.575 741.932 498.33 757.5 498.742C773.864 498.742 791.711 520.623 810.403 527.654C816.218 529.841 822.661 529.246 828.451 526.991C849.246 518.893 861.599 502.112 879.5 501.742C886.47 501.597 896.865 506.047 907.429 510.911C930.879 521.707 957.139 519.639 982.951 520.063C1020.91 520.686 1037.5 530.797 1056.5 537C1102.24 556.627 1116.5 570.704 1180.5 579.235C1257.5 589.5 1279 587 1440 588",
  "M0 438.5C150.5 438.5 261 438.318 323.5 456.5C351 464.5 387.517 484.001 423.5 494.5C447.371 501.465 472 503.735 487 507.735C503.786 512.212 504.5 516.808 523 518.735C547 521.235 564.814 501.235 584.5 501.235C604.5 501.235 626 529.069 643 528.569C658.676 528.569 672.076 511.63 695.751 501.972C703.017 499.008 711.231 498.208 718.298 501.617C735.448 509.889 751.454 529.98 767 529.569C783.364 529.569 801.211 507.687 819.903 500.657C825.718 498.469 832.141 499.104 837.992 501.194C859.178 508.764 873.089 523.365 891 523.735C907.8 524.083 923 504.235 963 506.735C1034.5 506.735 1047.5 492.68 1071 481.5C1122.5 457 1142.23 452.871 1185 446.5C1255.5 436 1294 439 1439.5 439",
  "M0.5 364C145.288 362.349 195 361.5 265.5 378C322 391.223 399.182 457.5 411 467.5C424.176 478.649 456.916 491.677 496.259 502.699C498.746 503.396 501.16 504.304 503.511 505.374C517.104 511.558 541.149 520.911 551.5 521.236C571.5 521.236 590 498.736 611.5 498.736C631.5 498.736 652.5 529.236 669.5 528.736C685.171 528.736 697.81 510.924 721.274 501.036C728.505 497.988 736.716 497.231 743.812 500.579C761.362 508.857 778.421 529.148 794 528.736C810.375 528.736 829.35 508.68 848.364 502.179C854.243 500.169 860.624 500.802 866.535 502.718C886.961 509.338 898.141 519.866 916 520.236C932.8 520.583 934.5 510.236 967.5 501.736C1011.5 491 1007.5 493.5 1029.5 480C1069.5 453.5 1072 440.442 1128.5 403.5C1180.5 369.5 1275 360.374 1439 364"
];

// 4 shades of red — deep to bright
const STROKE_COLORS = ["#8B0000", "#B22222", "#DC143C", "#FF1A1A"];

interface KraftosEffectProps {
  className?: string;
  scrollTriggerRef: React.RefObject<HTMLElement | null>;
}

export const KraftosEffect = ({ className, scrollTriggerRef }: KraftosEffectProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    if (!svgRef.current || !scrollTriggerRef.current) return;

    const paths = pathRefs.current.filter(Boolean) as SVGPathElement[];
    
    // Set initial state: paths fully hidden via strokeDashoffset
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });

    const mm = gsap.matchMedia();

    // Desktop: Scroll-scrubbed drawing animation
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollTriggerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      });

      paths.forEach((path, i) => {
        tl.to(path, {
          strokeDashoffset: 0,
          duration: 1,
          ease: "none",
        }, i * 0.15);
      });
    });

    // Mobile: Simple one-time fade/draw animation on viewport entry
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollTriggerRef.current,
          start: "top 80%",
          once: true,
        }
      });

      paths.forEach((path, i) => {
        tl.to(path, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.out",
        }, i * 0.2);
      });
    });

    return () => {
      mm.revert();
    };
  }, [scrollTriggerRef]);

  return (
    <div className={cn("w-full h-full overflow-visible", className)}>
      <svg
        ref={svgRef}
        width="1440"
        height="890"
        viewBox="0 0 1440 890"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        {/* Background blurred ghost paths — barely visible for atmospheric depth */}
        {PATH_DATA.map((d, i) => (
          <path
            key={`blur-${i}`}
            d={d}
            stroke={STROKE_COLORS[i]}
            strokeWidth="3"
            fill="none"
            pathLength={1}
            filter="url(#blurMe)"
            opacity="0.08"
          />
        ))}

        {/* Foreground animated paths — very subtle */}
        {PATH_DATA.map((d, i) => (
          <path
            key={`path-${i}`}
            ref={(el) => { pathRefs.current[i] = el; }}
            d={d}
            stroke={STROKE_COLORS[i]}
            strokeWidth="1.5"
            fill="none"
            opacity="0.15"
          />
        ))}

        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};


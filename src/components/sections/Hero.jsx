import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Custom Hooks ---

/**
 * A custom hook to throttle a callback function.
 * This ensures the function is not called more than once every `delay` milliseconds.
 */
const useThrottledCallback = (callback, delay) => {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args) => {
    if (!timeoutRef.current) {
      callbackRef.current(...args);
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null;
      }, delay);
    }
  }, [delay]);
};

/**
 * A custom hook to encapsulate all WebGL shader logic.
 */
const useShaderAnimation = (canvasRef, params) => {
  const { hue, speed, intensity, complexity } = params;
  const mousePos = useRef({ x: 0.0, y: 0.0 });
  const canvasRect = useRef({ pageLeft: 0, pageTop: 0, width: 100, height: 100 });

  const updateRect = useCallback(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      canvasRect.current = {
        pageLeft: rect.left + window.scrollX,
        pageTop: rect.top + window.scrollY,
        width: rect.width || 100,
        height: rect.height || 100,
      };
    }
  }, [canvasRef]);

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    const timer = setTimeout(updateRect, 300); // Allow layout settlement
    return () => {
      window.removeEventListener('resize', updateRect);
      clearTimeout(timer);
    };
  }, [updateRect]);

  const throttledMouseMove = useThrottledCallback((e) => {
    const mousePageX = e.clientX + window.scrollX;
    const mousePageY = e.clientY + window.scrollY;
    const { pageLeft, pageTop, width, height } = canvasRect.current;
    
    mousePos.current.x = ((mousePageX - pageLeft) / width) * 2 - 1;
    mousePos.current.y = -(((mousePageY - pageTop) / height) * 2 - 1);
  }, 16);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported.");
      return;
    }

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
    `;
    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_hue;
      uniform float u_speed;
      uniform float u_intensity;
      uniform float u_complexity;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.y * u.x;
      }

      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 3; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        float t = u_time * u_speed * 0.08;
        
        // Mouse warp effect
        float mouse_dist = distance(uv, u_mouse);
        float warp = smoothstep(0.6, 0.0, mouse_dist) * 0.4;
        
        vec2 p = uv * 1.8 + vec2(t, t * 0.4) + warp;
        float noise_pattern = fbm(p);
        
        // Exact requested color theme: RGB (233, 105, 66) and its premium gradients
        vec3 colorOrange1 = vec3(0.9137, 0.4118, 0.2588); // Core RGB (233, 105, 66)
        vec3 colorOrange2 = vec3(0.9608, 0.5059, 0.3608); // Lighter shade (245, 129, 92)
        vec3 colorOrange3 = vec3(0.8118, 0.3176, 0.1804); // Darker shade (207, 81, 46)
        
        // Shift coordinate slightly for secondary noise layer
        float n1 = noise(p + vec2(u_time * 0.02));
        float n2 = noise(p * 1.5 - vec2(u_time * 0.015));
        
        // Blend Orange shades smoothly
        vec3 blend1 = mix(colorOrange1, colorOrange2, n1);
        vec3 baseColor = mix(blend1, colorOrange3, n2 * 0.8);
        
        // Add soft highlights to make the liquid look glassy/glowing
        float highlight = smoothstep(0.4, 0.9, noise_pattern) * 0.15;
        baseColor += vec3(highlight);
        
        // Vignette for focus and layout depth
        float vignette = 1.0 - smoothstep(0.7, 1.6, length(uv));
        
        // Increased overall brightness for a lighter look
        float brightness = 0.32 + (noise_pattern * 0.68) * u_intensity * vignette;
        
        vec3 finalColor = baseColor * brightness;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`Shader compile error: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`Program link error: ${gl.getProgramInfoLog(program)}`);
      return;
    }
    gl.useProgram(program);
    
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");
    const hueLocation = gl.getUniformLocation(program, "u_hue");
    const speedLocation = gl.getUniformLocation(program, "u_speed");
    const intensityLocation = gl.getUniformLocation(program, "u_intensity");
    const complexityLocation = gl.getUniformLocation(program, "u_complexity");

    let animationFrameId = null;
    let isVisible = true;
    const startTime = performance.now();

    const render = () => {
      if (!isVisible || document.hidden) {
        animationFrameId = null;
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const scaleFactor = 0.6; // Downsample WebGL resolution to 60% of clamped DPR for render fill-rate performance boost
      const targetWidth = Math.floor(canvas.clientWidth * dpr * scaleFactor);
      const targetHeight = Math.floor(canvas.clientHeight * dpr * scaleFactor);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      }
      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
      gl.uniform1f(timeLocation, (performance.now() - startTime) * 0.001);
      gl.uniform2f(mouseLocation, mousePos.current.x, mousePos.current.y);
      gl.uniform1f(hueLocation, hue);
      gl.uniform1f(speedLocation, speed);
      gl.uniform1f(intensityLocation, intensity);
      gl.uniform1f(complexityLocation, complexity);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    // Use IntersectionObserver to stop/start drawing when section leaves/enters viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible && !document.hidden) {
          if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(render);
          }
        }
      });
    }, { threshold: 0 });

    observer.observe(canvas);

    // Pause WebGL loops completely when tab is hidden
    const handleVisibilityChange = () => {
      if (!document.hidden && isVisible) {
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(render);
        }
      } else {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial render trigger
    animationFrameId = requestAnimationFrame(render);

    window.addEventListener('mousemove', throttledMouseMove);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('mousemove', throttledMouseMove);
      if (gl && !gl.isContextLost()) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(positionBuffer);
      }
    };
  }, [hue, speed, intensity, complexity, canvasRef, throttledMouseMove]);
};

// The core canvas component using the useShaderAnimation hook.
const ShaderCanvas = React.memo(({ hue, speed, intensity, complexity }) => {
  const canvasRef = useRef(null);
  useShaderAnimation(canvasRef, { hue, speed, intensity, complexity });
  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
});

// --- Main Hero Component ---
export default function Hero({ isLoading = false }) {
  // Hardcoded premium static values matching requirements
  const hue = 352;
  const speed = 1.4;
  const intensity = 0.9;
  const complexity = 3.0; // Reduced to 3 octaves — fbm loop now hardcoded to 3 iterations for max GPU perf

  // Refs for the split-word parallax effect
  const leftScrollRef = useRef(null);
  const leftMouseRef = useRef(null);
  const bgLayerRef = useRef(null);

  useEffect(() => {
    if (isLoading) return;
    if (!leftScrollRef.current || !leftMouseRef.current || !bgLayerRef.current) return;

    // Center the element using Tailwind v4 classes to prevent double translation conflicts with GSAP


    // 1. Mouse move parallax using GSAP quickTo (targeted at the single text ref layer)
    const leftXTo = gsap.quickTo(leftMouseRef.current, "x", { duration: 1.2, ease: "power2.out" });
    const leftYTo = gsap.quickTo(leftMouseRef.current, "y", { duration: 1.2, ease: "power2.out" });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const x = (clientX / innerWidth) - 0.5;
      const y = (clientY / innerHeight) - 0.5;

      leftXTo(x * -12);
      leftYTo(y * -12);
    };

    const mm = gsap.matchMedia();

    // Desktop: Mouse parallax + Scroll-scrubbed text parallax & WebGL fade
    mm.add("(min-width: 768px)", () => {
      window.addEventListener('mousemove', handleMouseMove);

      const tl300 = gsap.timeline({
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "300px top",
          scrub: true,
          onToggle: (self) => {
            const state = self.isActive ? "transform, opacity" : "auto";
            if (leftScrollRef.current) leftScrollRef.current.style.willChange = state;
          }
        }
      });

      tl300.to(leftScrollRef.current, {
        y: 120,
        opacity: 0,
        ease: "none"
      }, 0);

      const tlBg = gsap.timeline({
        scrollTrigger: {
          trigger: "#about",
          start: "top top",
          end: "top -50%",
          scrub: true,
          onToggle: (self) => {
            if (bgLayerRef.current) {
              bgLayerRef.current.style.willChange = self.isActive ? "opacity" : "auto";
            }
          }
        }
      });

      tlBg.to(bgLayerRef.current, {
        opacity: 0,
        ease: "none"
      });
    });

    // Mobile: Static text layout (scrolls naturally) and simple toggle fade-out for WebGL background
    mm.add("(max-width: 767px)", () => {
      gsap.to(bgLayerRef.current, {
        opacity: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#about",
          start: "top 80%",
          toggleActions: "play none none reverse",
          onToggle: (self) => {
            if (bgLayerRef.current) {
              bgLayerRef.current.style.willChange = self.isActive ? "opacity" : "auto";
            }
          }
        }
      });
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      mm.revert();
    };
  }, [isLoading]);

  return (
    <section
      id="home"
      className="relative w-full h-dvh bg-transparent flex flex-col justify-between items-center pt-24 pb-8 md:pb-12 overflow-x-hidden"
    >
      {/* Background WebGL canvas layer - FIXED to cover viewport without scrolling or cropping */}
      <div ref={bgLayerRef} className="fixed top-0 left-0 w-full h-dvh z-0 overflow-hidden pointer-events-none">
        <ShaderCanvas hue={hue} speed={speed} intensity={intensity} complexity={complexity} />
        
        {/* Premium blending gradient overlay: cinematic progression from transparent to pure black (#070707) */}
        <div 
          className="absolute inset-0 pointer-events-none z-1"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(10,10,10,0.15) 40%, rgba(10,10,10,0.45) 65%, rgba(10,10,10,0.75) 80%, #070707 100%)'
          }}
        />
      </div>

      {/* Brand Text - single merged line "Kraftostech" positioned absolute below the logo */}
      <div 
        ref={leftScrollRef} 
        className="absolute top-1/2 left-1/2 z-10 text-center -translate-x-1/2 -translate-y-1/2 mt-[188px] md:mt-[220px] will-change-[transform,opacity] pointer-events-auto"
      >
        <div ref={leftMouseRef}>
          <h1 className="select-none leading-[0.9] tracking-[-0.04em] text-[clamp(42px,11vw,55px)] md:text-[clamp(65px,8vw,130px)] text-center whitespace-nowrap">
            <span className="font-['Outfit'] font-[900] text-[#F2ECE6]">
              {"Kraftos".split("").map((char, index) => (
                <span 
                  key={`k-${index}`}
                  className="inline-block transition-all duration-300 hover:scale-120 hover:-translate-y-3 hover:bg-gradient-to-br hover:from-[#ffeb00] hover:to-[#ff7a1a] hover:bg-clip-text hover:text-transparent cursor-pointer"
                >
                  {char}
                </span>
              ))}
            </span><span className="font-serif italic font-[700] text-[#F2ECE6]/90">
              {"tech.".split("").map((char, index) => (
                <span 
                  key={`t-${index}`}
                  className="inline-block transition-all duration-300 hover:scale-120 hover:-translate-y-3 hover:bg-gradient-to-br hover:from-[#ffeb00] hover:to-[#ff7a1a] hover:bg-clip-text hover:text-transparent cursor-pointer"
                >
                  {char}
                </span>
              ))}
            </span>
          </h1>
        </div>
      </div>

      {/* Spacer to maintain vertical flex structure */}
      <div className="flex-1" />
    </section>
  );
}

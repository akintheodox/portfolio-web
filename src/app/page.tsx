"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Homepage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for the glass distortion lens
  const cursorX = useMotionValue(-1000);
  const cursorY = useMotionValue(-1000);

  const springConfig = { damping: 35, stiffness: 250, mass: 0.4 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] overflow-hidden flex flex-col md:flex-row select-none"
    >
      
      {/* 
        The Glass Distortion Lens: 
        A backdrop-filter element that physically warps and refracts whatever is underneath it.
      */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 w-64 h-64 rounded-full border border-white/20 backdrop-invert-[0.15] backdrop-blur-[2px] -translate-x-1/2 -translate-y-1/2 z-30 hidden md:block overflow-hidden"
        style={{ x: smoothX, y: smoothY }}
      >
        {/* Inner lens glare to give it physical depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
      </motion.div>

      {/* Left Column: Case Studies */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-0">
        <Link 
          href="/case-studies"
          className="relative w-full h-full flex flex-col items-center justify-center bg-[#050505] hover:bg-white text-white hover:text-black border-r border-white/10 transition-colors duration-300 group overflow-hidden"
        >
          <span className="text-4xl md:text-6xl font-light tracking-tight transition-transform duration-500 group-hover:scale-105">
            Case Studies
          </span>
          <span className="absolute bottom-12 text-xs tracking-[0.3em] uppercase font-bold text-gray-500 group-hover:text-gray-400 transition-colors">
            View Projects
          </span>
        </Link>
      </div>

      {/* Right Column: Gallery */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-0">
        <Link 
          href="/gallery"
          className="relative w-full h-full flex flex-col items-center justify-center bg-[#050505] hover:bg-white text-white hover:text-black transition-colors duration-300 group overflow-hidden"
        >
          <span className="text-4xl md:text-6xl font-light tracking-tight transition-transform duration-500 group-hover:scale-105">
            Gallery
          </span>
          <span className="absolute bottom-12 text-xs tracking-[0.3em] uppercase font-bold text-gray-500 group-hover:text-gray-400 transition-colors">
            View Media
          </span>
        </Link>
      </div>

    </div>
  );
}
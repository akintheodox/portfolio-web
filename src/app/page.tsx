"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Homepage() {
  // Setup motion values for the cursor position
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  
  // Apply a spring to make the cursor follow feel heavy, buttery, and smooth
  const springConfig = { damping: 40, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden flex flex-col md:flex-row">
      
      {/* 
        The Light Source: 
        A heavily blurred orb that follows the mouse behind the glass panels 
      */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-white/15 blur-[120px] -translate-x-1/2 -translate-y-1/2 z-0"
        style={{ x: smoothX, y: smoothY }}
      />

      {/* Left Column: Case Studies */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8">
        <Link 
          href="/case-studies"
          className="relative w-full h-full flex flex-col items-center justify-center rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl transition-all duration-500 hover:bg-white/[0.04] hover:border-white/10 group overflow-hidden shadow-2xl"
        >
          <span className="text-gray-500 group-hover:text-white transition-colors duration-500 text-4xl md:text-6xl font-light tracking-tight drop-shadow-md">
            Case Studies
          </span>
          <span className="absolute bottom-12 text-xs tracking-[0.3em] uppercase font-bold text-gray-600 group-hover:text-gray-400 transition-colors duration-500">
            View Projects
          </span>
        </Link>
      </div>

      {/* Right Column: Gallery */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8 pt-0 md:pt-8 md:pl-0">
        <Link 
          href="/gallery"
          className="relative w-full h-full flex flex-col items-center justify-center rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl transition-all duration-500 hover:bg-white/[0.04] hover:border-white/10 group overflow-hidden shadow-2xl"
        >
          <span className="text-gray-500 group-hover:text-white transition-colors duration-500 text-4xl md:text-6xl font-light tracking-tight drop-shadow-md">
            Gallery
          </span>
          <span className="absolute bottom-12 text-xs tracking-[0.3em] uppercase font-bold text-gray-600 group-hover:text-gray-400 transition-colors duration-500">
            View Media
          </span>
        </Link>
      </div>

    </div>
  );
}
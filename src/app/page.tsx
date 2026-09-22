"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Homepage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bioDraft, setBioDraft] = useState("");

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
        The Glass Distortion Lens 
      */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 w-64 h-64 rounded-full border border-white/20 backdrop-invert-[0.15] backdrop-blur-[2px] -translate-x-1/2 -translate-y-1/2 z-30 hidden md:block overflow-hidden"
        style={{ x: smoothX, y: smoothY }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
      </motion.div>

      {/* Left Column: Case Studies */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-0 border-b md:border-b-0 md:border-r border-white/10">
        <Link 
          href="/case-study"
          className="relative w-full h-full flex flex-col items-center justify-center bg-[#050505] hover:bg-white text-white hover:text-black transition-colors duration-300 group overflow-hidden"
        >
          <span className="text-4xl lg:text-6xl font-light tracking-tight transition-transform duration-500 group-hover:scale-105">
            Case Studies
          </span>
          <span className="absolute bottom-12 text-xs tracking-[0.3em] uppercase font-bold text-gray-500 group-hover:text-gray-400 transition-colors">
            View Projects
          </span>
        </Link>
      </div>

      {/* Middle Column: Gallery */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-0">
        <Link 
          href="/gallery"
          className="relative w-full h-full flex flex-col items-center justify-center bg-[#050505] hover:bg-white text-white hover:text-black transition-colors duration-300 group overflow-hidden"
        >
          <span className="text-4xl lg:text-6xl font-light tracking-tight transition-transform duration-500 group-hover:scale-105">
            Gallery
          </span>
          <span className="absolute bottom-12 text-xs tracking-[0.3em] uppercase font-bold text-gray-500 group-hover:text-gray-400 transition-colors">
            View Media
          </span>
        </Link>
      </div>

      {/* Right Column: Anchored Bio Editor */}
      <div className="relative z-20 w-full md:w-[320px] lg:w-[400px] shrink-0 bg-[#050505] border-t md:border-t-0 md:border-l border-white/10 flex flex-col h-full">
        <div className="p-8 md:p-12 flex flex-col h-full">
          
          <header className="mb-12">
            <h2 className="text-xs tracking-[0.3em] uppercase font-bold text-white mb-2">
              Identity Protocol
            </h2>
            <p className="text-gray-500 text-sm">
              I am terrible at writing about myself. You do it.
            </p>
          </header>

          <textarea
            value={bioDraft}
            onChange={(e) => setBioDraft(e.target.value)}
            placeholder="Start typing..."
            className="flex-1 w-full bg-transparent text-gray-300 text-lg leading-relaxed placeholder:text-gray-700 resize-none outline-none z-30 relative"
            spellCheck="false"
          />

          <div className="pt-8 border-t border-white/10 mt-auto">
            <button 
              onClick={() => {
                if(bioDraft) {
                  // Ready to hook up to a backend (Sanity, Supabase, or an email action)
                  alert("Bio submitted: " + bioDraft);
                  setBioDraft("");
                }
              }}
              className="w-full py-4 text-xs tracking-[0.3em] uppercase font-bold text-white border border-white/20 hover:bg-white hover:text-black transition-colors duration-300 relative z-30"
            >
              Submit Override
            </button>
          </div>
          
        </div>
      </div>

    </div>
  );
}
"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { submitBioDraft, getAllApprovedBios } from "./actions";

export default function Homepage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for the community bio stream
  const [communityBios, setCommunityBios] = useState<string[]>([]);
  const [bioDraft, setBioDraft] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const cursorX = useMotionValue(-1000);
  const cursorY = useMotionValue(-1000);
  const springConfig = { damping: 35, stiffness: 250, mass: 0.4 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  // Fetch all approved bios on mount
  useEffect(() => {
    getAllApprovedBios().then((bios) => {
      if (bios && bios.length > 0) {
        setCommunityBios(bios.map((b: any) => b.content));
      }
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY]);

  const handleSubmit = () => {
    if (!bioDraft.trim()) return;
    
    setStatus("idle");
    startTransition(async () => {
      const result = await submitBioDraft(bioDraft);
      if (result.success) {
        setStatus("success");
        setBioDraft("");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    });
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] overflow-hidden flex flex-col md:flex-row select-none"
    >
      <motion.div
        className="pointer-events-none fixed top-0 left-0 w-64 h-64 rounded-full border border-white/20 backdrop-invert-[0.15] backdrop-blur-[2px] -translate-x-1/2 -translate-y-1/2 z-30 hidden md:block overflow-hidden"
        style={{ x: smoothX, y: smoothY }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
      </motion.div>

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

      <div className="relative z-20 w-full md:w-[320px] lg:w-[400px] shrink-0 bg-[#050505] border-t md:border-t-0 md:border-l border-white/10 flex flex-col h-full">
        <div className="p-8 md:p-12 flex flex-col h-full overflow-y-auto no-scrollbar">
          
          {/* Static Personal Bio */}
          <header className="mb-10 shrink-0">
            <h2 className="text-xs tracking-[0.3em] uppercase font-bold text-white mb-4">
              Current Identity
            </h2>
            <p className="text-gray-300 text-base leading-relaxed border-l border-white/20 pl-4">
              I am a brand designer and creative director specializing in minimal, architectural visual identities. I build digital experiences that feel precise and intentional.
            </p>
          </header>

          {/* Crowd-Sourced Continuation Stream */}
          <div className="mb-8 shrink-0">
            <h2 className="text-xs tracking-[0.3em] uppercase font-bold text-gray-500 mb-4">
              Here's who people think I am
            </h2>
            {communityBios.length > 0 ? (
              <p className="text-gray-400 text-base leading-relaxed italic">
                {communityBios.map((bio, index) => (
                  <span key={index} className="transition-colors hover:text-white cursor-crosshair">
                    {bio}{" "}
                  </span>
                ))}
              </p>
            ) : (
              <p className="text-gray-600 text-sm italic">
                No entries yet. Be the first to add to the story.
              </p>
            )}
          </div>

          <div className="flex-1 flex flex-col min-h-[250px] border-t border-white/10 pt-8">
            <h3 className="text-xs tracking-[0.3em] uppercase font-bold text-gray-500 mb-4">
              Continue the story
            </h3>
            <textarea
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              disabled={isPending || status === "success"}
              placeholder="Add your sentence..."
              className="flex-1 w-full bg-transparent text-gray-400 text-base leading-relaxed placeholder:text-gray-700 resize-none outline-none z-30 relative disabled:opacity-50"
              spellCheck="false"
            />
          </div>

          <div className="pt-8 shrink-0 mt-4">
            <button 
              onClick={handleSubmit}
              disabled={isPending || status === "success" || !bioDraft.trim()}
              className="w-full py-4 text-xs tracking-[0.3em] uppercase font-bold text-white border border-white/20 hover:bg-white hover:text-black transition-colors duration-300 relative z-30 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white"
            >
              {isPending ? "Transmitting..." : status === "success" ? "Sent for Review" : status === "error" ? "Transmission Failed" : "Submit Addition"}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
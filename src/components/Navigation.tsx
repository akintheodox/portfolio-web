"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Works", href: "/case-study" },
  { name: "Gallery", href: "/gallery" },
];

interface FloatingImage {
  id: string;
  url: string;
  top: string;
  left: string;
  rotate: string;
}

export default function Navigation({ galleryImages = [] }: { galleryImages?: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [floatingImages, setFloatingImages] = useState<FloatingImage[]>([]);
  const pathname = usePathname();

  // Close menu automatically on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Bulletproof body scroll locking with cleanup to prevent it from getting stuck
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (!galleryImages || galleryImages.length === 0) return;

    const selected: FloatingImage[] = [];
    const numToPick = Math.min(2, galleryImages.length);
    const shuffled = [...galleryImages].sort(() => 0.5 - Math.random());

    for (let i = 0; i < numToPick; i++) {
      selected.push({
        id: Math.random().toString(),
        url: shuffled[i],
        top: `${Math.floor(Math.random() * 50) + 15}%`,
        left: `${Math.floor(Math.random() * 50) + 15}%`,
        rotate: `${Math.floor(Math.random() * 30) - 15}deg`,
      });
    }
    
    setFloatingImages(selected);
  };

  const handleMouseLeave = () => {
    setFloatingImages([]);
  };

  const isCaseStudyDetail = pathname.startsWith("/case-study/") && pathname !== "/case-study";
  const backHref = isCaseStudyDetail ? "/case-study" : "/";
  const backLabel = isCaseStudyDetail ? "Works" : "Varanda";

  return (
    <>
      {/* 
        HEADER NAV
        Increased z-index to 100 and removed mix-blend-difference to prevent browser click-freezing bugs.
      */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-[#050505]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center pointer-events-auto">
        <div className="w-1/3">
          {pathname !== "/" && (
            <Link href={backHref} className="text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors flex items-center gap-2 w-fit">
              <span>←</span> {backLabel}
            </Link>
          )}
        </div>
        
        <div className="w-1/3 flex justify-center">
          <button 
            // Using prev state ensures React never uses a stale state variable
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-xs font-mono uppercase tracking-widest text-white font-bold hover:text-gray-400 transition-colors p-2"
          >
            {isOpen ? "Close" : "Rooms"}
          </button>
        </div>

        <div className="w-1/3 flex justify-end">
          <span className="text-xs font-mono uppercase tracking-widest text-gray-500 hidden md:block">
            TA © {new Date().getFullYear()}
          </span>
        </div>
      </nav>

      {/* 
        OVERLAY MENU
        Added pointer-events-none when closed so invisible divs don't trap mouse clicks.
      */}
      <div 
        className={`fixed inset-0 z-[90] bg-[#050505] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isOpen ? "translate-y-0 pointer-events-auto" : "-translate-y-full pointer-events-none"
        }`}
      >
        {/* Floating Background Images */}
        {floatingImages.map((img) => (
          <div
            key={img.id}
            className="absolute w-[250px] md:w-[350px] aspect-[4/3] pointer-events-none z-0 border border-white/10 shadow-2xl transition-all duration-300 ease-out"
            style={{
              top: img.top,
              left: img.left,
              transform: `translate(-50%, -50%) rotate(${img.rotate})`,
            }}
          >
            <Image 
              src={img.url} 
              alt="Gallery Preview" 
              fill 
              className="object-cover" 
            />
          </div>
        ))}
        
        {/* Links */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 md:gap-10 z-10">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              // Added mix-blend-difference here instead of the header so text cuts through images beautifully
              className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter uppercase text-white hover:text-gray-400 transition-colors duration-300 relative group mix-blend-difference"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
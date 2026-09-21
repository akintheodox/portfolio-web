"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";

export default function CanvasBoard({ assets }: { assets: any[] }) {
  const controls = useAnimation();

  // Listen for 'R' keypress to reset view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r") {
        controls.start({ x: 0, y: 0 });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [controls]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#050505]">
      
      {/* The Draggable Infinite Surface */}
      <motion.div
        drag
        animate={controls}
        // Creates limits so the board doesn't float away forever
        dragConstraints={{ left: -1500, right: 1500, top: -1500, bottom: 1500 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[2000px] md:w-[3000px] columns-3 md:columns-5 lg:columns-8 gap-8 p-10 cursor-grab active:cursor-grabbing"
      >
        {assets.map((item: any) => {
          let mediaContent = null;
          
          // 1. External Files
          if (item.assetSource === 'external' && item.externalUrl) {
            // Smart check: forces video render if url ends with mp4/webm, regardless of Sanity dropdown
            const isVideo = item.mediaType === 'video' || item.externalUrl.match(/\.(mp4|webm|mov)$/i);
            
            if (isVideo) {
              mediaContent = (
                <video src={item.externalUrl} autoPlay muted loop playsInline className="w-full h-auto rounded-xl object-cover" />
              );
            } else {
              mediaContent = (
                <img src={item.externalUrl} alt={item.caption || 'Gallery item'} loading="lazy" className="w-full h-auto rounded-xl object-cover transition-transform duration-700 group-hover:scale-105" />
              );
            }
          } 
          // 2. Sanity Uploads
          else if (item.assetSource === 'sanity' && item.image?.asset) {
            const width = item.image.asset.metadata?.dimensions?.width || 1200;
            const height = item.image.asset.metadata?.dimensions?.height || 1200;
            mediaContent = (
              <Image src={item.image.asset.url} alt={item.caption || 'Gallery item'} width={width} height={height} className="w-full h-auto rounded-xl object-cover transition-transform duration-700 group-hover:scale-105" />
            );
          }

          if (!mediaContent) return null;

          return (
            // bg-transparent removes the blue cast from PNGs
            <div key={item._key} className="relative w-full break-inside-avoid group bg-transparent mb-8">
              {mediaContent}
              <HoverOverlay tag={item.folderName} caption={item.caption} />
            </div>
          );
        })}
      </motion.div>

      {/* Floating Instructions UI */}
      <div className="absolute bottom-8 left-8 text-gray-500 text-xs tracking-widest uppercase font-semibold flex items-center gap-6 pointer-events-none z-50">
        <span>Drag to pan</span>
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-gray-400 font-mono">R</kbd> 
          Reset
        </span>
      </div>
    </div>
  );
}

function HoverOverlay({ tag, caption }: { tag: string, caption?: string }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 pointer-events-none rounded-xl">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
        {tag}
      </p>
      {caption && (
        <h3 className="text-xl font-semibold text-white">
          {caption}
        </h3>
      )}
    </div>
  );
}
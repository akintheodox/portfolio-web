"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

export default function CanvasBoard({ assets }: { assets: any[] }) {
  const controls = useAnimation();
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard reset and escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r" && !selectedAsset) {
        controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 100 } });
      }
      if (e.key === "Escape" && selectedAsset) {
        setSelectedAsset(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [controls, selectedAsset]);

  // Refined Media Renderer
  const renderMedia = (item: any, isExpanded: boolean = false) => {
    const isVideo = item.mediaType === 'video' || (item.externalUrl && item.externalUrl.match(/\.(mp4|webm|mov)$/i));
    
    // ADDED: rounded-2xl, overflow-hidden, and pointer-events-none (for grid) to stop ghost dragging
    const mediaClasses = isExpanded 
      ? "w-auto max-h-[70vh] object-contain drop-shadow-2xl rounded-2xl" 
      : "w-[220px] h-[220px] object-cover transition-transform duration-300 hover:scale-105 drop-shadow-lg rounded-2xl pointer-events-none"; 

    if (item.assetSource === 'external' && item.externalUrl) {
      if (isVideo) {
        return <video src={item.externalUrl} autoPlay muted loop playsInline draggable={false} className={mediaClasses} />;
      }
      return <img src={item.externalUrl} alt={item.caption || 'Gallery item'} loading="lazy" draggable={false} className={mediaClasses} />;
    }
    
    if (item.assetSource === 'sanity' && item.image?.asset) {
      return (
        <div className={`relative rounded-2xl overflow-hidden ${isExpanded ? 'w-[80vw] max-w-4xl h-[70vh]' : 'w-[220px] h-[220px] pointer-events-none'}`}>
          <Image 
            src={item.image.asset.url} 
            alt={item.caption || 'Gallery item'} 
            fill 
            draggable={false}
            className={`object-cover ${!isExpanded && 'transition-transform duration-300 hover:scale-105 drop-shadow-lg'}`} 
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#050505] text-white" ref={containerRef}>
      
      {/* State 1: The Draggable Grid View */}
      <AnimatePresence>
        {!selectedAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <motion.div
              drag
              animate={controls}
              dragConstraints={containerRef}
              dragElastic={0.1}
              // REFINED GRID: Tighter canvas (2000px), uniform gaps, flex-center to act as a tight cluster
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[2000px] flex flex-wrap content-center justify-center gap-10 p-16 cursor-grab active:cursor-grabbing"
            >
              {[...assets, ...assets, ...assets, ...assets].map((item: any, index: number) => (
                <motion.div 
                  key={`${item._key}-${index}`} 
                  // ADDED: cursor-pointer to the wrapper since the image inside ignores pointers now
                  className="relative flex items-center justify-center cursor-pointer" 
                  onClick={() => setSelectedAsset(item)}
                  layoutId={`media-${item._key}`}
                >
                  {renderMedia(item)}
                </motion.div>
              ))}
            </motion.div>

            {/* Grid View UI */}
            <div className="absolute bottom-8 left-8 text-gray-500 text-xs tracking-widest uppercase font-semibold flex items-center gap-6 pointer-events-none z-50">
              <span>Drag to pan</span>
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-gray-400 font-mono">R</kbd> 
                Reset
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* State 2: The Expanded Horizontal Carousel */}
      <AnimatePresence>
        {selectedAsset && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center bg-[#050505]"
          >
            <div className="w-full h-full overflow-x-auto overflow-y-hidden flex items-center snap-x snap-mandatory px-[20vw] hide-scrollbar">
              {assets.map((item: any, index: number) => (
                <div 
                  key={`carousel-${item._key}-${index}`} 
                  className="min-w-[60vw] h-full flex flex-col items-center justify-center snap-center shrink-0"
                >
                  <motion.div
                    layoutId={item._key === selectedAsset._key ? `media-${item._key}` : undefined}
                    className="relative flex items-center justify-center"
                  >
                     {renderMedia(item, true)}
                  </motion.div>
                  
                  {item.caption && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-8 text-sm text-gray-400 tracking-wide uppercase font-medium"
                    >
                      {item.caption}
                    </motion.p>
                  )}
                </div>
              ))}
            </div>

            {/* Back to Grid Button */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
              <button 
                onClick={() => setSelectedAsset(null)}
                className="px-6 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-xs tracking-widest font-bold uppercase rounded-md flex items-center gap-2 transition-colors border border-gray-800"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                Grid View
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
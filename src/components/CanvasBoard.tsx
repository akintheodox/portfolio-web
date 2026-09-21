"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function CanvasBoard({ assets }: { assets: any[] }) {
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedAsset) {
        setSelectedAsset(null);
        setActiveIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAsset]);

  useEffect(() => {
    if (selectedAsset) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedAsset]);

  useEffect(() => {
    if (selectedAsset && activeIndex !== null && carouselRef.current) {
      setTimeout(() => {
        const container = carouselRef.current;
        if (container && container.children[activeIndex]) {
          const target = container.children[activeIndex] as HTMLElement;
          const scrollPos = target.offsetLeft - (container.clientWidth / 2) + (target.clientWidth / 2);
          container.scrollTo({ left: scrollPos, behavior: 'instant' });
        }
      }, 10);
    }
  }, [selectedAsset, activeIndex]);

  const renderMedia = (item: any, isExpanded: boolean = false) => {
    const isVideo = item.mediaType === 'video' || (item.externalUrl && item.externalUrl.match(/\.(mp4|webm|mov)$/i));
    
    // THE MAGIC: 
    // Grid: Fixed heights (220px to 380px depending on screen) and 'w-auto'. The width shapes itself naturally!
    // Expanded: Max constraints to ensure it never exceeds the screen size.
    const gridClasses = "h-[220px] sm:h-[300px] lg:h-[380px] w-auto max-w-full object-cover transition-transform duration-500 hover:scale-105 rounded-2xl";
    const expandedClasses = "w-auto h-auto max-w-[85vw] max-h-[75vh] object-contain drop-shadow-2xl rounded-2xl";
    
    const appliedClasses = isExpanded ? expandedClasses : gridClasses;

    if (item.assetSource === 'external' && item.externalUrl) {
      if (isVideo) {
        return <video src={item.externalUrl} autoPlay muted loop playsInline draggable={false} className={appliedClasses} />;
      }
      return <img src={item.externalUrl} alt={item.caption || 'Gallery item'} loading="lazy" draggable={false} className={appliedClasses} />;
    }
    
    if (item.assetSource === 'sanity' && item.image?.asset) {
      // We pull the real dimensions from your Sanity metadata so Next.js knows the exact aspect ratio!
      const w = item.image.asset.metadata?.dimensions?.width || 1200;
      const h = item.image.asset.metadata?.dimensions?.height || 1200;
      
      return (
        <Image 
          src={item.image.asset.url} 
          alt={item.caption || 'Gallery item'} 
          width={w}
          height={h}
          draggable={false}
          className={appliedClasses} 
        />
      );
    }
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { y: -800, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring" as const, bounce: 0.4, duration: 0.8 } 
    },
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-[#050505] text-white pt-32 pb-12 px-6 md:px-12 overflow-x-hidden">
      
      <div className="flex-grow"></div>

      {/* State 1: The Falling Grid - Now using items-end to stack flat on the floor */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mt-auto flex flex-wrap-reverse gap-4 md:gap-8 w-full max-w-[2400px] mx-auto justify-start items-end"
      >
        {assets.map((item: any, index: number) => (
          <motion.div 
            key={`grid-${item._key}-${index}`} 
            variants={itemVariants}
            // All the complicated math is gone. The motion wrapper simply shrink-wraps around the flexible image!
            className="relative cursor-pointer rounded-2xl overflow-hidden drop-shadow-lg" 
            onClick={() => {
              setSelectedAsset(item);
              setActiveIndex(index);
            }}
            layoutId={`media-${item._key}-${index}`}
          >
            {renderMedia(item)}
          </motion.div>
        ))}
      </motion.div>

      {/* State 2: The Expanded Horizontal Carousel */}
      <AnimatePresence>
        {selectedAsset && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center bg-[#050505]/95 backdrop-blur-sm"
          >
            <div 
              ref={carouselRef}
              className="w-full h-full overflow-x-auto overflow-y-hidden flex items-center snap-x snap-mandatory px-[20vw] hide-scrollbar scroll-smooth"
            >
              {assets.map((item: any, index: number) => {
                const isSelected = selectedAsset._key === item._key && activeIndex === index;
                
                return (
                  <div 
                    key={`carousel-${item._key}-${index}`} 
                    className="min-w-[70vw] md:min-w-[50vw] h-full flex flex-col items-center justify-center snap-center shrink-0 px-4"
                  >
                    <motion.div
                      layoutId={isSelected ? `media-${item._key}-${activeIndex}` : undefined}
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
                );
              })}
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
              <button 
                onClick={() => {
                  setSelectedAsset(null);
                  setActiveIndex(null);
                }}
                className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-xs tracking-widest font-bold uppercase rounded-full flex items-center gap-2 transition-colors border border-gray-800 drop-shadow-xl"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>
                Close View
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
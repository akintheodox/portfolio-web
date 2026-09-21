"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function CanvasBoard({ assets }: { assets: any[] }) {
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Reference to the horizontal scroll container
  const carouselRef = useRef<HTMLDivElement>(null);

  // Escape key to close carousel
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

  // Lock body scroll when the carousel is open
  useEffect(() => {
    if (selectedAsset) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedAsset]);

  // Instantly scroll the carousel to the clicked item when opened
  useEffect(() => {
    if (selectedAsset && activeIndex !== null && carouselRef.current) {
      // A tiny timeout ensures Framer Motion has mounted the DOM nodes first
      setTimeout(() => {
        const container = carouselRef.current;
        if (container && container.children[activeIndex]) {
          const target = container.children[activeIndex] as HTMLElement;
          // Math to perfectly center the active item in the viewport
          const scrollPos = target.offsetLeft - (container.clientWidth / 2) + (target.clientWidth / 2);
          container.scrollTo({ left: scrollPos, behavior: 'instant' });
        }
      }, 10);
    }
  }, [selectedAsset, activeIndex]);

  const renderMedia = (item: any, isExpanded: boolean = false) => {
    const isVideo = item.mediaType === 'video' || (item.externalUrl && item.externalUrl.match(/\.(mp4|webm|mov)$/i));
    
    // CHANGED: object-cover is now object-contain to prevent cropping
    const mediaClasses = isExpanded 
      ? "w-auto max-h-[70vh] object-contain drop-shadow-2xl rounded-2xl" 
      : "w-full h-full aspect-square object-contain transition-transform duration-500 hover:scale-105 rounded-2xl"; 

    if (item.assetSource === 'external' && item.externalUrl) {
      if (isVideo) {
        return <video src={item.externalUrl} autoPlay muted loop playsInline draggable={false} className={mediaClasses} />;
      }
      return <img src={item.externalUrl} alt={item.caption || 'Gallery item'} loading="lazy" draggable={false} className={mediaClasses} />;
    }
    
    if (item.assetSource === 'sanity' && item.image?.asset) {
      return (
        <div className={`relative rounded-2xl overflow-hidden ${isExpanded ? 'w-[80vw] max-w-4xl h-[70vh]' : 'w-full h-full aspect-square'}`}>
          <Image 
            src={item.image.asset.url} 
            alt={item.caption || 'Gallery item'} 
            fill 
            draggable={false}
            // CHANGED: object-cover is now object-contain
            className={`object-contain ${!isExpanded && 'transition-transform duration-500 hover:scale-105'}`} 
          />
        </div>
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
    <div className="relative w-full min-h-screen flex flex-col bg-[#050505] text-white pt-32 pb-12 px-6 md:px-12">
      
      <div className="flex-grow"></div>

      {/* State 1: The Falling Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mt-auto flex flex-wrap-reverse gap-6 md:gap-10 w-full max-w-[2400px] mx-auto justify-start"
      >
        {assets.map((item: any, index: number) => (
          <motion.div 
            key={`grid-${item._key}-${index}`} 
            variants={itemVariants}
            className="relative flex items-center justify-center cursor-pointer rounded-2xl overflow-hidden drop-shadow-lg aspect-square w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] md:w-[calc(25%-30px)] lg:w-[calc(20%-32px)] xl:w-[calc(16.666%-33.33px)]" 
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
            {/* Added ref={carouselRef} here so we can control the scroll position */}
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
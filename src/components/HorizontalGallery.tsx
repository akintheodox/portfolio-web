"use client";

import { useRef, useState, useEffect } from "react";
// @ts-ignore
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/client";

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function HorizontalGalleryTrack({ images }: { images: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const direction = useRef(1); 
  
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Smooth Auto-Scroll Logic
  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (scrollRef.current && !isHovered && !isDragging) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        
        scrollRef.current.scrollLeft += 1 * direction.current;

        if (scrollLeft >= scrollWidth - clientWidth - 1) {
          direction.current = -1;
        }
        if (scrollLeft <= 0) {
          direction.current = 1;
        }
      }
    }, 16); 

    return () => clearInterval(autoScroll);
  }, [isHovered, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; 
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!images || images.length === 0) return null;

  return (
    <div 
      ref={scrollRef}
      className={`w-full flex overflow-x-auto gap-6 my-16 pb-6 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {images.map((img: any, idx: number) => {
        const imageSrc = img?.asset?.url || (img?.asset?._ref ? urlFor(img).height(800).url() : "");
        if (!imageSrc) return null;

        return (
          <div 
            key={img._key || idx} 
            className="shrink-0 flex flex-col gap-4"
          >
            {/* Reduced Fixed Height Container to emulate an editorial filmstrip */}
            <div className="h-[240px] md:h-[320px] w-max border border-white/10 bg-[#050505] overflow-hidden group relative">
              <img
                src={imageSrc}
                alt={img.alt || `Gallery image ${idx + 1}`}
                draggable={false} 
                className="h-full w-auto max-w-none pointer-events-none" 
              />
            </div>
            
            {/* Optional Caption Annotation */}
            {img.caption && (
              <div className="flex items-start gap-3 pl-1 pr-4">
                <span className="text-[10px] font-mono text-gray-600 mt-0.5">
                  // {(idx + 1).toString().padStart(2, '0')}
                </span>
                <p className="text-xs font-mono uppercase tracking-widest text-gray-400">
                  {img.caption}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
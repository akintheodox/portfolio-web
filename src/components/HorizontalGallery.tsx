"use client";

import React from "react";
import Image from "next/image";

interface ImageItem {
  _key: string;
  asset: { url: string };
  alt?: string;
}

export default function HorizontalGalleryTrack({ images }: { images: ImageItem[] }) {
  if (!images || images.length === 0) return null;

  // Duplicate the array to create a seamless infinite loop
  const duplicatedImages = [...images, ...images, ...images];
  
  // Calculate a responsive speed based on image count
  const duration = images.length * 7; 

  return (
    <div className="relative w-[100vw] left-1/2 -translate-x-1/2 my-32 overflow-hidden bg-transparent">
      
      {/* Native CSS injection for buttery smooth looping and pausing */}
      <style>{`
        @keyframes infinite-scroll-${images.length} {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
        .animate-marquee {
          animation: infinite-scroll-${images.length} ${duration}s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="animate-marquee flex w-max gap-2 px-2 cursor-crosshair">
        {duplicatedImages.map((img, i) => (
          <div 
            key={`${img._key}-${i}`} 
            className="relative w-[85vw] md:w-[60vw] h-[50vh] md:h-[70vh] max-h-[650px] flex-shrink-0"
          >
            {img.asset?.url && (
              <Image
                src={img.asset.url}
                alt={img.alt || "Gallery image"}
                fill
                className="object-contain pointer-events-none"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
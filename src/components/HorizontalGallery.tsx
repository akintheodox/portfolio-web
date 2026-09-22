"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ImageItem {
  _key: string;
  asset: {
    url: string;
  };
  alt?: string;
  caption?: string;
}

interface HorizontalGalleryProps {
  images: ImageItem[];
}

export default function HorizontalGalleryTrack({ images }: HorizontalGalleryProps) {
  // This ref acts as the bounding box for the drag physics
  const constraintsRef = useRef<HTMLDivElement>(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full my-12 md:my-24 cursor-grab active:cursor-grabbing">
      {/* 
        The parent container must have overflow-hidden and hold the ref.
        This allows Framer Motion to measure the visible window vs the total track width.
      */}
      <motion.div ref={constraintsRef} className="w-full overflow-hidden pl-4 md:pl-8">
        <motion.div 
          drag="x" 
          // Replaced the hardcoded -1200 with the dynamic ref
          dragConstraints={constraintsRef} 
          // Adds a slight physical bounce when they hit the edge of the track
          dragElastic={0.15}
          className="flex gap-4 md:gap-8 w-max pr-8"
          whileTap={{ cursor: "grabbing" }}
        >
          {images.map((img) => (
            <div 
              key={img._key} 
              // Kept your sharp zero-radius edges to match the brand identity
              className="relative w-[85vw] md:w-[60vw] h-[50vh] md:h-[70vh] flex-shrink-0 bg-[#050505] border border-white/10 overflow-hidden"
            >
              {img.asset?.url && (
                <Image
                  src={img.asset.url}
                  alt={img.alt || "Case study gallery image"}
                  fill
                  sizes="(max-width: 768px) 85vw, 60vw"
                  // pointer-events-none is crucial here so the image doesn't steal the drag event
                  className="object-cover pointer-events-none"
                />
              )}
              {/* Glassmorphism caption block */}
              {img.caption && (
                <div className="absolute bottom-4 left-4 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 text-xs tracking-widest uppercase font-medium text-white/80">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
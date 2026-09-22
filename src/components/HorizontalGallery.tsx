"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ImageItem {
  _key: string;
  asset: { url: string };
  alt?: string;
}

export default function HorizontalGalleryTrack({ images }: { images: ImageItem[] }) {
  const [isDragging, setIsDragging] = useState(false);

  if (!images || images.length === 0) return null;

  const duplicatedImages = [...images, ...images, ...images];

  return (
    <div className="relative w-[100vw] left-1/2 -translate-x-1/2 my-32 overflow-hidden cursor-grab active:cursor-grabbing bg-transparent">
      <motion.div
        animate={isDragging ? undefined : { x: ["0%", "-33.333%"] }}
        transition={{
          x: {
            ease: "linear",
            duration: images.length * 7, 
            repeat: Infinity,
          }
        }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        drag="x"
        dragConstraints={{ left: -10000, right: 10000 }} 
        className="flex w-max gap-4 md:gap-8 px-4 md:px-8"
      >
        {duplicatedImages.map((img, i) => (
          <div 
            key={`${img._key}-${i}`} 
            // Clamped the max height to 650px so they remain elegant on large screens
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
      </motion.div>
    </div>
  );
}
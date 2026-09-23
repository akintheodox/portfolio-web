"use client";

import { useEffect, useState } from "react";
import TerminalHome from "@/components/home-variants/TerminalHome";
import TypographicHome from "@/components/home-variants/TypographicHome";

// Import future variants here:
// import CyberHome from "@/components/home-variants/CyberHome";
// import MinimalHome from "@/components/home-variants/MinimalHome";

export default function Orchestrator() {
  const [Variant, setVariant] = useState<React.ElementType | null>(null);

  useEffect(() => {
    // Add all your imported variants to this array. 
    // The orchestrator will pick one at random every time the page mounts.
    const variants = [TerminalHome, TypographicHome];
    
    const randomChoice = variants[Math.floor(Math.random() * variants.length)];
    setVariant(() => randomChoice);
  }, []);

  // Show a neutral background while the math calculates to prevent layout shifts
  if (!Variant) return <div className="w-full h-screen bg-[#0c0d12]" />; 

  return <Variant />;
}
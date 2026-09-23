"use client";

import { useEffect, useState } from "react";
import TerminalHome from "@/components/home-variants/TerminalHome";
import RetroOSHome from "@/components/home-variants/RetroOSHome";
import TypographicHome from "@/components/home-variants/TypographicHome";

export default function Orchestrator() {
  const [Variant, setVariant] = useState<React.ElementType | null>(null);

  useEffect(() => {
    // Add all your imported variants to this array
    const variants = [TerminalHome, RetroOSHome, TypographicHome];
    
    // Check the browser memory for the last viewed index
    const storedIndex = localStorage.getItem("akin_portfolio_variant");
    
    // If it exists, add 1 to move to the next variant. If it exceeds the array length, loop back to 0.
    // If it doesn't exist (first time visitor), start at 0.
    let nextIndex = 0;
    if (storedIndex !== null) {
      nextIndex = (parseInt(storedIndex, 10) + 1) % variants.length;
    }

    // Save the new index back to browser memory for the next refresh
    localStorage.setItem("akin_portfolio_variant", nextIndex.toString());
    
    // Render the selected variant
    setVariant(() => variants[nextIndex]);
  }, []);

  // Show a neutral background for a split second to prevent layout shift
  if (!Variant) return <div className="w-full h-screen bg-[#0c0d12]" />; 

  return <Variant />;
}
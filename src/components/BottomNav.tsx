"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function BottomNav() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Index", href: "/" },
    { label: "Works", href: "/case-study" },
    { label: "Gallery", href: "/gallery" },
  ];

  return (
    <nav 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#ffde59] border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-none transition-all duration-300 ease-in-out flex items-center justify-center ${
        isScrolled 
          ? "px-4 py-2 w-24 h-8 group overflow-hidden cursor-pointer" 
          : "px-6 py-3 gap-8"
      }`}
    >
      {/* Expanded State Items */}
      <div className={`flex items-center gap-8 transition-opacity duration-200 ${isScrolled ? "opacity-0 group-hover:opacity-100 absolute" : "opacity-100"}`}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 text-xs font-mono uppercase font-extrabold tracking-widest transition-colors ${
                isActive ? "text-black" : "text-gray-700 hover:text-black"
              }`}
            >
              <span className={`w-2.5 h-2.5 border-2 border-black ${isActive ? "bg-black" : "bg-white"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Collapsed iPhone Home Indicator Bar State */}
      {isScrolled && (
        <div className="w-10 h-1.5 bg-black rounded-full group-hover:opacity-0 transition-opacity" />
      )}
    </nav>
  );
}
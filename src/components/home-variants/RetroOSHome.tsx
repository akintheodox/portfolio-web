"use client";

import { useEffect, useState, useTransition } from "react";
import { submitBioDraft, getAllApprovedBios } from "@/app/actions";

export default function RetroOSHome() {
  const [communityBios, setCommunityBios] = useState<string[]>([]);
  const [bioDraft, setBioDraft] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    getAllApprovedBios().then((bios) => {
      if (bios && bios.length > 0) setCommunityBios(bios.map((b: any) => b.content));
    });
  }, []);

  const handleSubmit = () => {
    if (!bioDraft.trim()) return;
    
    setStatus("idle");
    startTransition(async () => {
      const submittedText = bioDraft.trim(); // Capture the text before we clear the input
      
      const result = await submitBioDraft(submittedText);
      if (result.success) {
        setStatus("success");
        setBioDraft("");
        
        // Instantly inject the new text into the live feed on the screen
        setCommunityBios((prev) => [...prev, submittedText]);
        
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    });
  };

  return (
    <main className="w-full min-h-screen bg-[#00d2ff] text-black overflow-x-hidden flex flex-col items-center p-6 md:p-12 pb-36 font-mono select-none">
      
      {/* Top Right Desktop Info */}
      <div className="absolute top-6 right-8 text-right hidden md:block">
        <p className="text-[10px] font-black uppercase tracking-widest">MON APR 28 2025  10:24 AM</p>
        <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Good Ideas<br/>Better Tomorrow</p>
      </div>

      {/* Left Desktop Icons */}
      <div className="absolute top-12 left-8 hidden xl:flex flex-col gap-8">
        <DesktopIcon icon="💻" label="AKIN" />
        <DesktopIcon icon="📁" label="WORKS" />
        <DesktopIcon icon="📁" label="THOUGHTS" />
        <DesktopIcon icon="🗑️" label="RECYCLE" />
      </div>

      <div className="relative w-full max-w-5xl mx-auto flex flex-col md:block h-auto md:h-[750px] mt-4 md:mt-16 gap-8">
        
        {/* Main AKIN.EXE Window */}
        <div className="relative md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2 z-10 w-full md:w-[640px] bg-[#f4f4f0] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
          <WindowTitle title="AKIN.EXE" />
          <div className="p-6 md:p-10 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">AKIN</h1>
                <div className="w-4 h-12 md:h-16 bg-[#00d2ff] ml-2 border-2 border-black"></div>
              </div>
              <div className="text-[10px] leading-tight text-gray-400 font-bold uppercase text-right hidden sm:block">
                Brands<br/>Experiences<br/>Systems<br/>Ideas
              </div>
            </div>
            
            <p className="text-xl md:text-2xl font-black uppercase tracking-tight leading-snug">
              I am a brand designer and creative director specializing in minimal, architectural visual identities.
            </p>
            <p className="text-sm md:text-base font-medium">
              I build digital experiences that feel precise and intentional.
            </p>
          </div>
        </div>

        {/* THOUGHTS.TXT Window */}
        <div className="relative md:absolute md:bottom-20 md:left-0 z-20 w-full md:w-[420px] bg-[#f4f4f0] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
          <WindowTitle title="THOUGHTS.TXT" />
          <div className="p-5 md:p-8 flex flex-col gap-4 min-h-[220px] bg-[#f4f4f0]">
            {communityBios.length > 0 ? (
              <p className="text-sm leading-relaxed font-medium bg-white p-4 border-2 border-black h-full shadow-inner">
                {communityBios.map((bio, i) => (
                  <span key={i} className="mr-2">
                    {bio}
                  </span>
                ))}
                <span className="inline-block w-2 h-4 bg-black animate-pulse align-middle"></span>
              </p>
            ) : (
              <p className="text-sm font-medium italic text-gray-500 bg-white p-4 border-2 border-black h-full shadow-inner">
                Awaiting community input...<span className="inline-block w-2 h-4 bg-gray-500 animate-pulse align-middle ml-1"></span>
              </p>
            )}
          </div>
        </div>

        {/* DOWNLOADING.CREATIVE Window */}
        <div className="relative md:absolute md:bottom-0 md:right-0 z-30 w-full md:w-[420px] bg-[#f4f4f0] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
          <WindowTitle title="DOWNLOADING.CREATIVE" />
          <div className="p-5 md:p-6 flex flex-col gap-4">
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-12 flex flex-col gap-1 border-2 border-black bg-white p-1 shadow-[2px_2px_0px_0px_#000]">
                 <div className="w-full h-1 bg-black"></div>
                 <div className="w-full h-1 bg-black"></div>
                 <div className="w-full h-1 bg-black"></div>
                 <div className="w-full h-1 bg-black"></div>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase mb-1">Building a better internet...</p>
                <div className="w-full h-4 border-2 border-black p-[2px] flex gap-[2px] bg-white">
                   {/* Fake progress bar blocks */}
                   {[...Array(10)].map((_, i) => (
                     <div key={i} className="h-full w-full bg-[#00d2ff]"></div>
                   ))}
                   <div className="h-full w-full bg-transparent"></div>
                   <div className="h-full w-full bg-transparent"></div>
                </div>
              </div>
              <span className="text-xs font-black">72%</span>
            </div>
            
            <textarea
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              disabled={isPending || status === "success"}
              placeholder="Visual identities, loading..."
              className="w-full h-16 bg-white border-2 border-black p-3 text-sm resize-none outline-none focus:bg-[#00d2ff]/10 transition-colors mt-2"
              spellCheck="false"
            />
            
            <button 
              onClick={handleSubmit}
              disabled={isPending || status === "success" || !bioDraft.trim()}
              className="w-full py-2.5 bg-black text-white font-black text-xs uppercase tracking-widest border-2 border-black hover:bg-[#00d2ff] hover:text-black transition-all disabled:opacity-50"
            >
              {isPending ? "Syncing..." : status === "success" ? "Accepted" : "Submit Override →"}
            </button>
          </div>
          
          {/* Floating Arrow Graphic */}
          <div className="absolute -bottom-16 -right-4 rotate-[-15deg] hidden md:flex flex-col items-center gap-1 pointer-events-none text-black">
            <span className="text-[10px] font-black uppercase text-center leading-tight">Ideas<br/>Live<br/>Here</span>
            <span className="text-2xl font-black">↗</span>
          </div>
        </div>

      </div>
    </main>
  );
}

// OS Window UI Helpers
function WindowTitle({ title }: { title: string }) {
  return (
    <div className="bg-black text-white px-2 py-1 flex justify-between items-center border-b-4 border-black">
      <span className="font-mono text-[10px] font-bold tracking-widest uppercase">{title}</span>
      <div className="flex gap-1">
        <div className="w-4 h-4 bg-white text-black flex items-center justify-center border-2 border-black font-black text-[10px] pb-1">-</div>
        <div className="w-4 h-4 bg-white text-black flex items-center justify-center border-2 border-black font-black text-[10px]">□</div>
        <div className="w-4 h-4 bg-white text-black flex items-center justify-center border-2 border-black font-black text-[10px]">×</div>
      </div>
    </div>
  );
}

function DesktopIcon({ icon, label }: { icon: string, label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer group">
      <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-xl group-hover:-translate-y-1 transition-transform">
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase bg-transparent group-hover:bg-black group-hover:text-white px-1 mt-1 transition-colors">{label}</span>
    </div>
  );
}
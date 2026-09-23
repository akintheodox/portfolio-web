"use client";

import { useEffect, useState, useTransition } from "react";
import { submitBioDraft, getAllApprovedBios } from "@/app/actions";

export default function TerminalHome() {
  const [communityBios, setCommunityBios] = useState<string[]>([]);
  const [bioDraft, setBioDraft] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    getAllApprovedBios().then((bios) => {
      if (bios && bios.length > 0) {
        setCommunityBios(bios.map((b: any) => b.content));
      }
    });
  }, []);

  const handleSubmit = () => {
    if (!bioDraft.trim()) return;
    
    setStatus("idle");
    startTransition(async () => {
      const result = await submitBioDraft(bioDraft);
      if (result.success) {
        setStatus("success");
        setBioDraft("");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    });
  };

  return (
    <main className="relative w-full min-h-screen bg-[#0c0d12] text-black overflow-x-hidden flex flex-col items-center justify-center p-6 md:p-12 select-none pb-36">
      
      {/* Technical Grid Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #333 1px, transparent 1px),
            linear-gradient(to bottom, #333 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* --- CENTRAL TERMINAL WINDOW (Focused Centerpiece) --- */}
      <div className="relative z-20 w-full max-w-2xl bg-[#ffde59] border-4 border-black shadow-[16px_16px_0px_0px_#000] flex flex-col my-auto">
        
        {/* Window Title Bar */}
        <div className="bg-white border-b-4 border-black px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-none border-2 border-black bg-[#ff5252]" />
            <div className="w-3.5 h-3.5 rounded-none border-2 border-black bg-[#ffeb3b]" />
            <div className="w-3.5 h-3.5 rounded-none border-2 border-black bg-[#69f0ae]" />
          </div>
          <span className="text-xs font-mono font-extrabold tracking-widest text-black uppercase">
            Terminal://Akin-Identity-Protocol
          </span>
          <span className="text-xs font-mono font-bold text-gray-500">v1.0</span>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 flex flex-col gap-6 bg-[#ffde59]">
          
          {/* Core Identity Box */}
          <div className="bg-white border-3 border-black p-5 shadow-[6px_6px_0px_0px_#000]">
            <div className="inline-block bg-[#10b981] text-white font-mono font-black text-[10px] tracking-widest uppercase px-2 py-1 border border-black mb-3">
              [Core Identity]
            </div>
            <h1 className="text-black text-xl md:text-2xl font-bold tracking-tight leading-snug mb-2">
              I am a brand designer and creative director specializing in minimal, architectural visual identities.
            </h1>
            <p className="text-gray-700 text-sm md:text-base font-medium">
              I build digital experiences that feel precise and intentional.
            </p>
          </div>

          {/* Community Stream Box */}
          <div className="bg-[#ff3d00] text-white border-3 border-black p-5 shadow-[6px_6px_0px_0px_#000]">
            <div className="inline-block bg-white text-black font-mono font-black text-[10px] tracking-widest uppercase px-2 py-1 border border-black mb-3">
              [Here&apos;s who people think I am]
            </div>
            {communityBios.length > 0 ? (
              <div className="font-mono text-sm md:text-base leading-relaxed flex flex-wrap gap-x-2 gap-y-1">
                {communityBios.map((bio, index) => (
                  <span key={index} className="bg-black/20 px-1.5 py-0.5 border border-black/30">
                    {bio}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-white/90 font-mono text-sm italic">
                No entries recorded yet. Add your perspective below.
              </p>
            )}
          </div>

          {/* Submission Input Box */}
          <div className="bg-white border-3 border-black p-5 shadow-[6px_6px_0px_0px_#000] flex flex-col gap-3">
            <label className="text-xs font-mono font-extrabold uppercase tracking-widest text-black flex items-center gap-2">
              <span>&gt;</span> Submit a new override:
            </label>
            <textarea
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              disabled={isPending || status === "success"}
              placeholder="Type your sentence here..."
              className="w-full h-24 bg-gray-50 border-2 border-black p-3 text-black font-mono text-sm resize-none outline-none focus:bg-white transition-colors"
              spellCheck="false"
            />
            <button 
              onClick={handleSubmit}
              disabled={isPending || status === "success" || !bioDraft.trim()}
              className="w-full py-3.5 bg-black text-[#ffde59] font-mono text-xs uppercase tracking-[0.25em] font-black border-2 border-black hover:bg-[#10b981] hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{isPending ? "Transmitting..." : status === "success" ? "Sent for Review ✓" : "Submit Override"}</span>
              <span>→</span>
            </button>
          </div>

        </div>

      </div>

      {/* Footer Branding Info */}
      <footer className="absolute bottom-20 left-0 w-full px-8 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-gray-500 pointer-events-none">
        <span>© 2026 Akin</span>
        <span>Designed Somewhere on Earth</span>
      </footer>

    </main>
  );
}
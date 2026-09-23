"use client";

import { useEffect, useState, useTransition } from "react";
import { submitBioDraft, getAllApprovedBios } from "@/app/actions";

export default function TypographicHome() {
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
    <main className="w-full min-h-screen bg-white text-black overflow-hidden flex flex-col justify-between p-6 md:p-12 pb-36">
      
      {/* Massive Header */}
      <header className="w-full border-b-8 border-black pb-4 mb-12">
        <h1 className="text-[12vw] leading-none font-black tracking-tighter uppercase">
          Akinloluwa
        </h1>
        <h2 className="text-[4vw] leading-none font-bold tracking-tight uppercase text-gray-400">
          Identity Protocol v2.0
        </h2>
      </header>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-12 w-full flex-1">
        
        {/* Left: The Feed */}
        <div className="flex-1 border-4 border-black p-8 flex flex-col">
          <h3 className="text-2xl font-black uppercase tracking-widest border-b-4 border-black pb-4 mb-6">
            Collective Memory
          </h3>
          <div className="flex-1 text-3xl font-medium leading-tight tracking-tight">
            {communityBios.length > 0 ? (
              communityBios.map((bio, i) => (
                <span key={i} className="hover:bg-black hover:text-white transition-colors cursor-crosshair">
                  {bio}{" "}
                </span>
              ))
            ) : (
              <span className="text-gray-300">Awaiting input...</span>
            )}
          </div>
        </div>

        {/* Right: The Input */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6">
          <h3 className="text-5xl font-black uppercase tracking-tighter leading-none">
            Alter<br/>The<br/>Record
          </h3>
          <textarea
            value={bioDraft}
            onChange={(e) => setBioDraft(e.target.value)}
            disabled={isPending || status === "success"}
            placeholder="Inject data..."
            className="w-full h-48 bg-black text-white p-6 text-xl font-medium outline-none resize-none placeholder:text-gray-600 focus:bg-gray-900 transition-colors"
            spellCheck="false"
          />
          <button 
            onClick={handleSubmit}
            disabled={isPending || status === "success" || !bioDraft.trim()}
            className="w-full py-6 bg-white border-4 border-black text-black font-black text-xl uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-50"
          >
            {isPending ? "Syncing..." : status === "success" ? "Accepted" : "Submit"}
          </button>
        </div>
      </div>
    </main>
  );
}
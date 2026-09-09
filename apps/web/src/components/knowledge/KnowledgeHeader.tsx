"use client";

import React from "react";
import { Bot, Sparkles } from "lucide-react";

export function KnowledgeHeader() {
  return (
    <div className="w-full select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#DDD2C0]">
        {/* Left: Page Title & Subtitle */}
        <div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-[#142B3A] text-[#D96B3B] flex items-center justify-center shrink-0">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0D1B24] font-sans">
              ASK THE FIELD
            </h1>
            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#142B3A] text-white">
              ENGINEERING RAG
            </span>
          </div>
          <p className="text-xs text-[#5A6572] mt-0.5 font-sans">
            Search historical drilling experience, offset-well events, and lessons learned using natural language.
          </p>
        </div>

        {/* Right: Knowledge Engine Status & Subtle Disclaimer */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-[#8B877D] bg-white border border-[#DDD2C0]">
            <Sparkles className="h-2.5 w-2.5 text-[#D96B3B]" />
            <span>SYNTHETIC DEMO DATA</span>
          </span>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-[#DDD2C0] shadow-2xs text-[11px] font-mono">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2F8068] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#2F8068]" />
            </span>
            <span className="font-bold text-[#0D1B24]">KNOWLEDGE ENGINE</span>
            <span className="text-[10px] text-[#2F8068] font-bold">READY</span>
          </div>
        </div>
      </div>
    </div>
  );
}

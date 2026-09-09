"use client";

import React from "react";
import { ShieldAlert, Sparkles, Activity } from "lucide-react";

export function RiskHeader() {
  return (
    <div className="w-full select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DDD2C0]">
        {/* Left: Page Title & Subtitle */}
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-[#142B3A] text-[#D96B3B] flex items-center justify-center shrink-0">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0D1B24] font-sans">
              RISK INTELLIGENCE
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#142B3A] text-white">
              DECISION SUPPORT
            </span>
          </div>
          <p className="text-xs text-[#142B3A]/80 mt-1 font-sans">
            Explainable early-warning signals backed by drilling history, offset wells, and current operating context.
          </p>
        </div>

        {/* Right: Engine Status & Synthetic Disclaimer */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono text-[#8B877D] bg-white border border-[#DDD2C0]">
            <Sparkles className="h-3 w-3 text-[#D96B3B]" />
            <span>Synthetic Demonstration Data</span>
          </span>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white border border-[#DDD2C0] shadow-2xs text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D96B3B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D96B3B]" />
            </span>
            <span className="font-bold text-[#0D1B24]">EARLY-WARNING ENGINE</span>
            <span className="text-[10px] text-[#2F8068] font-bold">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

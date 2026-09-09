"use client";

import React from "react";
import { GitCompare, CheckCircle2, ArrowRight } from "lucide-react";
import { Well } from "@/components/dashboard/data/wells";

interface HistoricalPatternMatchProps {
  well: Well;
  currentDepthM: number;
}

export function HistoricalPatternMatch({
  well,
  currentDepthM,
}: HistoricalPatternMatchProps) {
  const offsetId = well.similarWells?.[0]?.name || "NHK-119";
  const formation = well.formation || "Jurassic T13";

  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl p-3.5 sm:p-4 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2">
          <GitCompare className="h-4 w-4 text-[#245463]" />
          <h3 className="text-xs sm:text-sm font-extrabold font-mono text-[#0D1B24] tracking-tight">
            HISTORICAL PATTERN MATCH
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-[#2F8068] bg-[#2F8068]/15 px-2 py-0.5 rounded border border-[#2F8068]/30">
          92% SIMILARITY
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs font-mono">
        {/* Current Active Pattern */}
        <div className="p-3 rounded-lg bg-white border border-[#DDD2C0] space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#D96B3B] animate-pulse" />
            <strong className="text-xs text-[#0D1B24] uppercase">Current Active Pattern</strong>
          </div>
          <p className="font-sans text-xs text-[#142B3A] font-medium leading-relaxed">
            Elevated surface torque (+13.4%) + declining ROP (-4.8%) + rising SPP (+5%) relative to baseline.
          </p>
          <div className="text-[10px] text-[#8B877D] pt-1 border-t border-[#DDD2C0]/50">
            Active Depth: {currentDepthM} m in {formation}
          </div>
        </div>

        {/* Matched Historical Offset Evidence */}
        <div className="p-3 rounded-lg bg-white border border-[#DDD2C0] space-y-1.5">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-[#2F8068]" />
            <strong className="text-xs text-[#245463] uppercase">Matched Offset History</strong>
          </div>
          <p className="font-sans text-xs text-[#142B3A] font-medium leading-relaxed">
            3 offset wells ({offsetId} corridor) logged stick-slip and permeable drag in the 3,050–3,200 m interval.
          </p>
          <div className="text-[10px] text-[#8B877D] pt-1 border-t border-[#DDD2C0]/50">
            Match Status: <strong className="text-[#2F8068]">STRONG CORRELATION</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

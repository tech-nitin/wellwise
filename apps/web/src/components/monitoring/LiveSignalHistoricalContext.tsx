"use client";

import React from "react";
import { BookOpen, ArrowRight, FileText } from "lucide-react";
import { Well } from "@/components/dashboard/data/wells";
import { LiveTelemetryPoint } from "./types";
import { cn } from "@/lib/utils";

interface LiveSignalHistoricalContextProps {
  well: Well;
  currentPoint: LiveTelemetryPoint;
  onOpenEvidenceModal: () => void;
}

export function LiveSignalHistoricalContext({
  well,
  currentPoint,
  onOpenEvidenceModal,
}: LiveSignalHistoricalContextProps) {
  const offsetId = well.similarWells?.[0]?.name || "NHK-119";
  const matchPct = well.similarWells?.[0]?.matchPercent || 92;
  const formation = well.formation || "Jurassic T13";

  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl p-3.5 sm:p-4 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#D96B3B]" />
          <h3 className="text-xs sm:text-sm font-extrabold font-mono text-[#0D1B24] tracking-tight">
            LIVE SIGNAL + HISTORICAL EVIDENCE
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-[#2F8068] bg-[#2F8068]/15 px-2 py-0.5 rounded-full border border-[#2F8068]/30">
          {matchPct}% EVIDENCE MATCH
        </span>
      </div>

      {/* Main Content */}
      <div className="pt-2.5 space-y-2.5">
        <div className="flex items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#D96B3B] animate-pulse" />
            <strong className="text-[#0D1B24]">TORQUE PATTERN — WATCH</strong>
          </div>
          <span className="text-[10px] text-[#8B877D]">Evidence Records: 7</span>
        </div>

        <p className="text-xs font-sans text-[#142B3A] leading-relaxed">
          Current telemetry shows elevated torque (<strong>{currentPoint.torqueKftLb} kft-lb</strong>) at <strong>{currentPoint.depthM} m</strong> in {formation}.
        </p>

        <div className="p-2.5 rounded-lg bg-white border border-[#DDD2C0] text-xs font-mono text-[#142B3A]">
          <span className="text-[9px] text-[#8B877D] uppercase font-bold block mb-0.5">Historical Offset Match:</span>
          <p className="font-sans text-[11px] text-[#142B3A]/90">
            3 nearby offset wells ({offsetId} corridor) reported similar torque spikes and stick-slip between <strong>3,050–3,200 m</strong>.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-mono text-[#8B877D]">
            Match: <strong className="text-[#2F8068]">STRONG</strong>
          </span>

          <button
            onClick={onOpenEvidenceModal}
            className="px-3 py-1.5 rounded-lg bg-[#142B3A] text-white text-xs font-mono font-bold hover:bg-[#245463] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FileText className="h-3 w-3 text-[#D96B3B]" />
            <span>VIEW SUPPORTING EVIDENCE →</span>
          </button>
        </div>
      </div>
    </div>
  );
}

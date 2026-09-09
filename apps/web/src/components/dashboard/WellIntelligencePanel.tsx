"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  X,
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  AlertTriangle,
  FileText,
  Activity,
} from "lucide-react";
import { Well } from "./data/wells";

interface WellIntelligencePanelProps {
  well: Well;
  onClose: () => void;
  onSelectSimilarWell?: (wellId: string) => void;
}

export const WellIntelligencePanel: React.FC<WellIntelligencePanelProps> = ({
  well,
  onClose,
  onSelectSimilarWell,
}) => {
  if (!well) return null;

  const formattedDepth =
    typeof well.depthM === "number"
      ? well.depthM.toLocaleString()
      : well.depthM || "3,240";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 12 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-3 right-3 bottom-3 w-full sm:w-[380px] max-h-[96%] bg-[#FAF8F5]/98 backdrop-blur-md rounded-2xl border-2 border-[#DDD2C0] shadow-xl p-4 sm:p-5 z-40 text-left font-sans select-none flex flex-col justify-between overflow-hidden"
    >
      {/* Scrollable Body */}
      <div className="overflow-y-auto pr-1 space-y-3.5 scrollbar-none flex-1">
        {/* Top Header Row */}
        <div className="flex items-start justify-between pb-2.5 border-b border-[#DDD2C0]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#142B3A] text-[#D96B3B] flex items-center justify-center shrink-0 shadow-2xs">
              <Compass className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#0D1B24] font-mono tracking-tight">
                  {well.id}
                </h3>
                <span className="text-[9px] font-mono uppercase px-2 py-0.2 rounded-full border font-bold bg-[#D96B3B]/15 text-[#A9533D] border-[#D96B3B]/40">
                  DEMO WELL
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#142B3A]/75 mt-0.5">
                {well.field || "Nahorkatiya Main"} &bull; <strong className="text-[#0D1B24]">{formattedDepth} m</strong> TD
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-7 w-7 rounded-lg text-[#142B3A]/60 hover:text-[#0D1B24] hover:bg-[#DDD2C0]/40 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 3 Metric Chips */}
        <div className="grid grid-cols-3 gap-2 py-0.5 font-mono text-xs text-center">
          <div className="bg-[#DDD2C0]/30 p-2 rounded-xl border border-[#DDD2C0]">
            <span className="text-[8px] uppercase tracking-wider text-[#142B3A]/70 block font-semibold">
              Risk Indicator
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#843D35] block mt-0.5">
              {well.riskScore || 72}/100
            </span>
          </div>

          <div className="bg-[#DDD2C0]/30 p-2 rounded-xl border border-[#DDD2C0]">
            <span className="text-[8px] uppercase tracking-wider text-[#142B3A]/70 block font-semibold">
              Offset Match
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#2F8068] block mt-0.5">
              {well.historicalMatch || 92}%
            </span>
          </div>

          <div className="bg-[#DDD2C0]/30 p-2 rounded-xl border border-[#DDD2C0]">
            <span className="text-[8px] uppercase tracking-wider text-[#142B3A]/70 block font-semibold">
              Formation
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-[#0D1B24] truncate block mt-0.5">
              {well.formation || "Jurassic T13"}
            </span>
          </div>
        </div>

        {/* Formation Depth Correlation Rail */}
        <div className="p-3 rounded-xl bg-white border border-[#DDD2C0] space-y-2">
          <span className="text-[10px] font-mono uppercase font-bold text-[#8B877D] tracking-wider block">
            FORMATION DEPTH CORRELATION:
          </span>
          <div className="space-y-1 text-xs font-mono text-[#142B3A] pl-2 border-l-2 border-[#245463]/40">
            <div className="flex items-center justify-between">
              <span className="text-[#5A6572]">SURFACE</span>
              <span className="font-bold">0 m</span>
            </div>
            <div className="text-[10px] text-[#8B877D] py-0.5">&bull; Alluvial Sand &amp; Clay (1,200 m)</div>
            <div className="flex items-center justify-between bg-[#FAF8F5] p-1 rounded border border-[#DDD2C0]/60">
              <span className="font-bold text-[#D96B3B]">{well.formation || "JURASSIC T13"}</span>
              <span className="font-bold text-[#245463]">3,120–3,280 m</span>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-[#5A6572]">SECTION TD</span>
              <span className="font-bold text-[#0D1B24]">{formattedDepth} m</span>
            </div>
          </div>
        </div>

        {/* Historical Events Recorded in Interval */}
        <div className="p-3 rounded-xl bg-white border border-[#DDD2C0] space-y-1.5">
          <span className="text-[10px] font-mono uppercase font-bold text-[#8B877D] tracking-wider block">
            HISTORICAL PRECEDENT EVENTS:
          </span>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between p-1.5 rounded bg-[#FAF8F5] border border-[#DDD2C0]/50">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#843D35]" />
                <span className="font-semibold text-[#0D1B24]">Lost Circulation (3,120 m)</span>
              </div>
              <span className="text-[9px] font-bold text-[#843D35] px-1.5 py-0.2 rounded bg-[#843D35]/15">HIGH</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-[#FAF8F5] border border-[#DDD2C0]/50">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#D96B3B]" />
                <span className="font-semibold text-[#0D1B24]">Torque Spike (3,180 m)</span>
              </div>
              <span className="text-[9px] font-bold text-[#D96B3B] px-1.5 py-0.2 rounded bg-[#D96B3B]/15">MEDIUM</span>
            </div>
          </div>
        </div>

        {/* Similar Offset Correlation Ranking */}
        <div className="p-3 rounded-xl bg-white border border-[#DDD2C0] space-y-1.5">
          <span className="text-[10px] font-mono uppercase font-bold text-[#8B877D] tracking-wider block">
            SIMILAR OFFSET WELLS:
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-mono text-center">
            <div
              onClick={() => onSelectSimilarWell?.("NHK-119")}
              className="p-1.5 rounded bg-[#FAF8F5] border border-[#DDD2C0] hover:border-[#245463] cursor-pointer transition-colors"
            >
              <strong className="text-[#0D1B24] block">NHK-119</strong>
              <span className="text-[10px] text-[#2F8068] font-bold">91% Match</span>
            </div>
            <div
              onClick={() => onSelectSimilarWell?.("NHK-121")}
              className="p-1.5 rounded bg-[#FAF8F5] border border-[#DDD2C0] hover:border-[#245463] cursor-pointer transition-colors"
            >
              <strong className="text-[#0D1B24] block">NHK-121</strong>
              <span className="text-[10px] text-[#2F8068] font-bold">84% Match</span>
            </div>
            <div
              onClick={() => onSelectSimilarWell?.("NHK-117")}
              className="p-1.5 rounded bg-[#FAF8F5] border border-[#DDD2C0] hover:border-[#245463] cursor-pointer transition-colors"
            >
              <strong className="text-[#0D1B24] block">NHK-117</strong>
              <span className="text-[10px] text-[#D96B3B] font-bold">78% Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-3 border-t border-[#DDD2C0] flex items-center justify-between gap-2 shrink-0">
        <Link
          href={`/wells/${well.id}`}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#142B3A] hover:bg-[#245463] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-2xs"
        >
          <span>OPEN WELL INTELLIGENCE</span>
          <ArrowRight className="h-3.5 w-3.5 text-[#D96B3B]" />
        </Link>
      </div>
    </motion.div>
  );
};

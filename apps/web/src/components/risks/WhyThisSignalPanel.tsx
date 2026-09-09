"use client";

import React from "react";
import { ArrowRight, BookOpen, Compass, CheckCircle2, ShieldAlert } from "lucide-react";
import { RiskSignalItem } from "./types";
import { cn } from "@/lib/utils";

interface WhyThisSignalPanelProps {
  signal: RiskSignalItem;
  formation: string;
  onOpenEvidence: () => void;
}

export function WhyThisSignalPanel({
  signal,
  formation,
  onOpenEvidence,
}: WhyThisSignalPanelProps) {
  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl p-3.5 sm:p-4 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-[#D96B3B]" />
          <h3 className="text-xs sm:text-sm font-extrabold font-mono text-[#0D1B24] tracking-tight">
            WHY THIS SIGNAL? — EXPLAINABLE REASONING
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-[#D96B3B] bg-[#D96B3B]/15 px-2 py-0.5 rounded border border-[#D96B3B]/30">
          {signal.name} ({signal.attentionLevel})
        </span>
      </div>

      {/* Observation & Context Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-white border border-[#DDD2C0]">
          <span className="text-[9px] text-[#8B877D] uppercase font-bold block mb-0.5">
            1. Current Observation
          </span>
          <p className="font-sans text-xs text-[#0D1B24] font-medium leading-snug">
            {signal.name} measured at <strong>{signal.currentValueFormatted}</strong> vs baseline <strong>{signal.baselineValueFormatted}</strong> ({signal.deviationFormatted}).
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-white border border-[#DDD2C0]">
          <span className="text-[9px] text-[#8B877D] uppercase font-bold block mb-0.5">
            2. Active Geological Context
          </span>
          <p className="font-sans text-xs text-[#0D1B24] font-medium leading-snug">
            Drill bit operating at <strong>{signal.depthM} m MD</strong> in <strong>{formation}</strong> pay interval.
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-white border border-[#DDD2C0]">
          <span className="text-[9px] text-[#8B877D] uppercase font-bold block mb-0.5">
            3. Historical Offset Context
          </span>
          <p className="font-sans text-xs text-[#0D1B24] font-medium leading-snug">
            {signal.matchedOffsetCount} offset wells experienced similar behavior across this 3,050–3,200 m corridor.
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-white border border-[#DDD2C0]">
          <span className="text-[9px] text-[#8B877D] uppercase font-bold block mb-0.5">
            4. Supporting Evidence
          </span>
          <p className="font-sans text-xs text-[#0D1B24] font-medium leading-snug">
            {signal.evidenceRecordCount} verified synthetic DDR and mud recap records in this formation block.
          </p>
        </div>
      </div>

      {/* Visual Step-by-Step Reasoning Pattern Chain */}
      <div className="p-3 rounded-lg bg-white border border-[#DDD2C0] space-y-2">
        <div className="text-[10px] font-mono font-bold text-[#8B877D] uppercase tracking-wider">
          Explainable Reasoning Chain
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-[#FAF8F5] text-[#142B3A] border border-[#DDD2C0]">
            Current Telemetry
          </span>
          <ArrowRight className="h-3 w-3 text-[#8B877D]" />
          <span className="px-2 py-0.5 rounded bg-[#D96B3B]/15 text-[#D96B3B] border border-[#D96B3B]/30 font-bold">
            {signal.name} Deviation ({signal.deviationFormatted})
          </span>
          <ArrowRight className="h-3 w-3 text-[#8B877D]" />
          <span className="px-2 py-0.5 rounded bg-[#FAF8F5] text-[#142B3A] border border-[#DDD2C0]">
            Depth / Formation Correlation ({formation})
          </span>
          <ArrowRight className="h-3 w-3 text-[#8B877D]" />
          <span className="px-2 py-0.5 rounded bg-[#245463]/15 text-[#245463] border border-[#245463]/30 font-bold">
            Offset Similarity (3 Wells)
          </span>
          <ArrowRight className="h-3 w-3 text-[#8B877D]" />
          <span className="px-2 py-0.5 rounded bg-[#142B3A] text-white font-bold">
            Early-Warning Indicator
          </span>
        </div>
      </div>

      {/* Footer trigger */}
      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#DDD2C0]/50 text-xs font-mono">
        <span className="text-[#8B877D] text-[10px]">
          Confidence in Pattern Match: <strong className="text-[#2F8068]">{signal.historicalMatchLevel}</strong>
        </span>

        <button
          onClick={onOpenEvidence}
          className="text-[#245463] font-bold hover:text-[#D96B3B] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Examine Supporting DDRs ({signal.evidenceRecordCount})</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

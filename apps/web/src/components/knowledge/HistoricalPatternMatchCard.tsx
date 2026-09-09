"use client";

import React from "react";
import { GitCompare, ArrowRight, Activity, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Well } from "@/components/dashboard/data/wells";

interface HistoricalPatternMatchCardProps {
  well: Well;
  currentDepth: number;
  formation: string;
  historicalMatchesCount: number;
  depthMatch: "Strong" | "Moderate" | "Low";
  formationMatch: "Strong" | "Moderate" | "Low";
  patternDescription?: string;
  topic?: string;
}

export const HistoricalPatternMatchCard: React.FC<HistoricalPatternMatchCardProps> = ({
  well,
  currentDepth,
  formation,
  historicalMatchesCount,
  topic = "Torque / Drag",
}) => {
  return (
    <div className="bg-[#FAF7F2] border-2 border-[#DDD2C0] rounded-xl p-4 sm:p-5 shadow-sm space-y-3.5 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDD2C0]/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2F8068]" />
          <h3 className="text-sm font-bold tracking-wider uppercase text-[#142B3A]">
            HISTORICAL PATTERN MATCH
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded bg-[#2F8068]/15 text-[#2F8068] border border-[#2F8068]/40">
            STRONG HISTORICAL MATCH
          </span>
        </div>
      </div>

      {/* Comparison Grid: Current Well VS Matching Offsets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Left: Current Well */}
        <div className="bg-white border border-[#DDD2C0] rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-[#DDD2C0]/60 pb-1">
            <span className="text-[10px] font-mono font-bold uppercase text-[#6B7280] flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#245463]" />
              CURRENT WELL
            </span>
            <span className="text-xs font-mono font-bold text-[#142B3A]">{well.id}</span>
          </div>
          <div className="space-y-1 text-xs font-mono text-[#142B3A]">
            <p className="flex justify-between">
              <span className="text-[#5A6572]">Depth:</span>
              <strong className="font-bold">{currentDepth.toLocaleString()} m</strong>
            </p>
            <p className="flex justify-between">
              <span className="text-[#5A6572]">Formation:</span>
              <strong className="font-bold text-[#D96B3B]">{formation}</strong>
            </p>
            <p className="flex justify-between">
              <span className="text-[#5A6572]">Active Signal:</span>
              <strong className="font-bold text-[#245463]">
                {topic.toLowerCase().includes("loss") ? "Circulation Loss Precursor" : "Elevated Surface Torque"}
              </strong>
            </p>
          </div>
        </div>

        {/* Right: Matching Offsets */}
        <div className="bg-white border border-[#DDD2C0] rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-[#DDD2C0]/60 pb-1">
            <span className="text-[10px] font-mono font-bold uppercase text-[#2F8068] flex items-center gap-1">
              <GitCompare className="w-3 h-3 text-[#2F8068]" />
              MATCHING OFFSETS
            </span>
            <span className="text-xs font-mono font-bold text-[#2F8068]">{historicalMatchesCount || 3} Wells</span>
          </div>
          <div className="space-y-1 text-xs font-mono text-[#142B3A]">
            <p className="flex justify-between">
              <span className="text-[#5A6572]">Depth Interval:</span>
              <strong className="font-bold">3,080–3,220 m</strong>
            </p>
            <p className="flex justify-between">
              <span className="text-[#5A6572]">Formation:</span>
              <strong className="font-bold text-[#D96B3B]">{formation}</strong>
            </p>
            <p className="flex justify-between">
              <span className="text-[#5A6572]">Historical Event:</span>
              <strong className="font-bold text-[#245463]">
                {topic.toLowerCase().includes("loss") ? "Seepage Losses (35 bbl/hr)" : "Torque Escalation & Stick-Slip"}
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* Matched Factors Checklist */}
      <div className="bg-white border border-[#DDD2C0] rounded-lg p-3 space-y-1.5">
        <span className="text-[10px] font-mono uppercase font-bold text-[#8B877D] tracking-wider block">
          MATCHED STRATIGRAPHIC &amp; OPERATIONAL FACTORS:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1.5 rounded border border-[#DDD2C0]/60 text-[#142B3A]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2F8068] shrink-0" />
            <span>Formation Match</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1.5 rounded border border-[#DDD2C0]/60 text-[#142B3A]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2F8068] shrink-0" />
            <span>Depth Interval</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1.5 rounded border border-[#DDD2C0]/60 text-[#142B3A]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2F8068] shrink-0" />
            <span>Event Type</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1.5 rounded border border-[#DDD2C0]/60 text-[#142B3A]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2F8068] shrink-0" />
            <span>Drilling Behaviour</span>
          </div>
        </div>
      </div>

      {/* Cross-Page Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 text-xs text-[#5A6572]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2F8068]" />
          <span>Cross-referenced against active precursor telemetry engine.</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/live-monitoring?well=${well.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-[#DDD2C0] hover:border-[#245463] text-xs font-bold text-[#142B3A] transition-colors shadow-2xs"
          >
            <span>VIEW LIVE SIGNAL</span>
            <ArrowRight className="w-3 h-3 text-[#245463]" />
          </Link>
          <Link
            href={`/risks?well=${well.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-[#DDD2C0] hover:border-[#D96B3B] text-xs font-bold text-[#843D35] transition-colors shadow-2xs"
          >
            <span>VIEW ACTIVE RISKS</span>
            <ArrowRight className="w-3 h-3 text-[#D96B3B]" />
          </Link>
        </div>
      </div>
    </div>
  );
};

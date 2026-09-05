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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Well } from "./data/wells";

interface WellIntelligencePanelProps {
  well: Well;
  onClose: () => void;
  onSelectSimilarWell?: (wellId: string) => void;
}

export function WellIntelligencePanel({
  well,
  onClose,
  onSelectSimilarWell,
}: WellIntelligencePanelProps) {
  if (!well) return null;

  const getStatusBadge = (status: Well["status"] = "healthy") => {
    switch (status) {
      case "active":
        return "bg-[#2F8068]/15 text-[#2F8068] border-[#2F8068]/40";
      case "warning":
        return "bg-[#D96B3B]/20 text-[#A9533D] border-[#D96B3B]/50";
      case "critical":
        return "bg-[#843D35]/15 text-[#843D35] border-[#843D35]/40";
      case "historical":
        return "bg-[#245463]/15 text-[#245463] border-[#245463]/40";
      case "healthy":
      default:
        return "bg-[#2F8068]/15 text-[#2F8068] border-[#2F8068]/40";
    }
  };

  const formattedDepth =
    typeof well.depthM === "number"
      ? well.depthM.toLocaleString()
      : well.depthM || "3,240";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 15 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-4 right-4 bottom-4 w-full sm:w-[390px] max-h-[94%] bg-[#FAF8F5]/98 backdrop-blur-md rounded-2xl border border-[#DDD2C0] shadow-xl p-5 z-40 text-left font-sans select-none flex flex-col justify-between overflow-hidden"
    >
      {/* Scrollable Container */}
      <div className="overflow-y-auto pr-1 space-y-3.5 scrollbar-none flex-1">
        {/* Top Header Row: Well Name, Status & Depth */}
        <div className="flex items-start justify-between pb-3 border-b border-[#DDD2C0]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#142B3A] text-[#D96B3B] flex items-center justify-center shrink-0 shadow-2xs">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#0D1B24] font-mono tracking-tight">
                  {well.id}
                </h3>
                <span
                  className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border font-bold ${getStatusBadge(
                    well.status
                  )}`}
                >
                  {well.isDemo ? "DEMO WELL" : well.status === "active" ? "ACTIVE WELL" : well.status.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#142B3A]/75 mt-0.5">
                {well.field || "Upper Assam"} &bull; <strong className="text-[#0D1B24]">{formattedDepth} m</strong> TD
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-7 w-7 rounded-lg text-[#142B3A]/60 hover:text-[#0D1B24] hover:bg-[#DDD2C0]/40 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close intelligence panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 3 Metric Chips: Risk Indicator, Match, Formation */}
        <div className="grid grid-cols-3 gap-2 py-0.5 font-mono text-xs">
          <div className="bg-[#DDD2C0]/30 p-2.5 rounded-xl border border-[#DDD2C0]">
            <span className="text-[9px] uppercase tracking-wider text-[#142B3A]/70 block font-semibold">
              Risk Indicator
            </span>
            <span
              className={`text-base font-extrabold block mt-0.5 ${
                (well.riskScore || 0) > 75
                  ? "text-[#843D35]"
                  : (well.riskScore || 0) > 50
                  ? "text-[#D96B3B]"
                  : "text-[#2F8068]"
              }`}
            >
              {well.riskScore ?? 0}
              <span className="text-[10px] text-[#142B3A]/60 font-normal">/100</span>
            </span>
          </div>

          <div className="bg-[#DDD2C0]/30 p-2.5 rounded-xl border border-[#DDD2C0]">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-wider text-[#142B3A]/70 block font-semibold">
                Match
              </span>
              <Sparkles className="h-3 w-3 text-[#245463]" />
            </div>
            <span className="text-base font-extrabold text-[#245463] block mt-0.5">
              {well.historicalMatch ?? 0}%
            </span>
          </div>

          <div className="bg-[#DDD2C0]/30 p-2.5 rounded-xl border border-[#DDD2C0]">
            <span className="text-[9px] uppercase tracking-wider text-[#142B3A]/70 block font-semibold">
              Formation
            </span>
            <span className="text-xs font-bold text-[#0D1B24] truncate block mt-0.5" title={well.formation}>
              {well.formation || "Tipam"}
            </span>
          </div>
        </div>

        {/* Formation Depth Profile Visualization */}
        <div className="p-3 rounded-xl bg-[#DDD2C0]/25 border border-[#DDD2C0] font-mono text-[11px]">
          <span className="text-[9px] uppercase tracking-wider text-[#0D1B24] font-bold block mb-1.5 flex items-center gap-1.5">
            <Layers className="h-3 w-3 text-[#D96B3B]" />
            Formation Depth Correlation
          </span>
          <div className="pl-2 space-y-0.5 text-[#142B3A]/70 leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-[#0D1B24] font-bold">SURFACE</span>
              <span className="text-[9px] text-[#142B3A]/60">(0 m)</span>
            </div>
            <div>│ 1,200 m &bull; Alluvium / Dhekiajuli</div>
            <div className="flex items-center gap-2 text-[#0D1B24] font-bold bg-[#DDD2C0]/50 p-1 rounded border border-[#DDD2C0]">
              <span>├── {well.formation || "Target Formation"}</span>
              <span className="text-[10px] text-[#142B3A]/60 font-normal">({well.formationInterval || "Zone"})</span>
            </div>
            <div className="flex items-center gap-2 text-[#0D1B24] font-bold">
              <span>└── TD {formattedDepth} m</span>
            </div>
          </div>
        </div>

        {/* Historical Operational Events */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#142B3A]/70 font-bold block">
            HISTORICAL OPERATIONAL EVENTS
          </span>

          <div className="space-y-1.5">
            {(well.events || []).slice(0, 2).map((evt, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-2 rounded-xl bg-[#DDD2C0]/20 border border-[#DDD2C0]/70 text-xs"
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`h-2 w-2 rounded-full mt-1 shrink-0 ${
                      evt.severity === "critical"
                        ? "bg-[#843D35]"
                        : evt.severity === "high"
                        ? "bg-[#D96B3B]"
                        : evt.severity === "medium"
                        ? "bg-[#D96B3B]"
                        : "bg-[#2F8068]"
                    }`}
                  />
                  <div>
                    <span className="font-bold text-[#0D1B24] block">{evt.event}</span>
                    <span className="text-[10px] font-mono text-[#142B3A]/70">
                      Depth: {evt.depthM != null ? evt.depthM.toLocaleString() : "—"} m
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#DDD2C0] text-[#142B3A]">
                  {evt.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Wells */}
        {(well.similarWells || []).length > 0 && (
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#142B3A]/70 font-bold block">
              OFFSET CORRELATION
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(well.similarWells || []).map((sim) => (
                <button
                  key={sim.id}
                  onClick={() => onSelectSimilarWell?.(sim.id)}
                  className="px-2 py-0.5 rounded-lg bg-[#DDD2C0]/30 border border-[#DDD2C0] hover:border-[#142B3A] text-[11px] font-mono text-[#0D1B24] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="font-bold">{sim.name}</span>
                  <span className="text-[#245463] font-semibold">{sim.matchPercent}%</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA: Streamlined Preview to Full Intelligence */}
      <div className="pt-3 border-t border-[#DDD2C0] mt-2">
        <Link href={`/wells/${well.id}`} className="block">
          <Button
            size="sm"
            className="w-full bg-[#D96B3B] hover:bg-[#c45a2c] text-white font-mono text-xs font-bold gap-2 py-2.5 rounded-xl cursor-pointer shadow-2xs border border-[#D96B3B]/30"
          >
            <span>OPEN WELL INTELLIGENCE</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

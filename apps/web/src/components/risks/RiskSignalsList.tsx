"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, AlertTriangle, ArrowRight, BookOpen, Layers, CheckCircle2 } from "lucide-react";
import { RiskSignalItem, RiskAttentionLevel } from "./types";
import { cn } from "@/lib/utils";

interface RiskSignalsListProps {
  signals: RiskSignalItem[];
  selectedSignalId: string;
  onSelectSignal: (signal: RiskSignalItem) => void;
  onOpenEvidence: (signal: RiskSignalItem) => void;
}

export function RiskSignalsList({
  signals,
  selectedSignalId,
  onSelectSignal,
  onOpenEvidence,
}: RiskSignalsListProps) {
  const getBadge = (level: RiskAttentionLevel) => {
    switch (level) {
      case "CRITICAL":
        return {
          bg: "bg-[#843D35]/15 border-[#843D35]/30 text-[#843D35]",
          dot: "bg-[#843D35]",
          label: "CRITICAL",
        };
      case "WATCH":
        return {
          bg: "bg-[#D96B3B]/15 border-[#D96B3B]/30 text-[#D96B3B]",
          dot: "bg-[#D96B3B]",
          label: "WATCH",
        };
      case "ADVISORY":
        return {
          bg: "bg-[#245463]/15 border-[#245463]/30 text-[#245463]",
          dot: "bg-[#245463]",
          label: "ADVISORY",
        };
      default:
        return {
          bg: "bg-[#2F8068]/15 border-[#2F8068]/30 text-[#2F8068]",
          dot: "bg-[#2F8068]",
          label: "NORMAL",
        };
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl p-3.5 sm:p-4 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-[#D96B3B]" />
          <h2 className="text-sm sm:text-base font-extrabold font-mono text-[#0D1B24] tracking-tight">
            EARLY-WARNING SIGNALS &amp; HAZARD RANKING
          </h2>
        </div>
        <span className="text-[10px] font-mono font-bold text-[#8B877D]">
          RANKED BY ATTENTION PRIORITY
        </span>
      </div>

      {/* Signals Ranked List */}
      <div className="space-y-2.5 pt-3">
        {signals.map((sig) => {
          const isSelected = selectedSignalId === sig.id;
          const badge = getBadge(sig.attentionLevel);
          const isWatch = sig.attentionLevel === "WATCH" || sig.attentionLevel === "CRITICAL";

          return (
            <div
              key={sig.id}
              onClick={() => onSelectSignal(sig)}
              className={cn(
                "p-3.5 rounded-xl border transition-all cursor-pointer text-xs font-mono group",
                isSelected
                  ? "bg-white border-[#142B3A] shadow-xs ring-2 ring-[#D96B3B]/40"
                  : isWatch
                  ? "bg-white border-[#D96B3B]/60 hover:border-[#D96B3B]"
                  : "bg-white border-[#DDD2C0] hover:border-[#8B877D]"
              )}
            >
              {/* Top Row: Rank + Title + Attention Badge + Signal Strength */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded bg-[#142B3A] text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                    0{sig.rank}
                  </span>
                  <strong className="text-xs sm:text-sm font-bold text-[#0D1B24] tracking-tight">
                    {sig.name}
                  </strong>
                  <span className="text-[10px] text-[#8B877D] hidden sm:inline">
                    · {sig.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold border flex items-center gap-1",
                      badge.bg
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", badge.dot)} />
                    <span>{badge.label}</span>
                  </span>

                  <div className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#DDD2C0] text-[10px]">
                    <span className="text-[#8B877D]">Signal Strength: </span>
                    <strong className={cn("font-extrabold", isWatch ? "text-[#D96B3B]" : "text-[#2F8068]")}>
                      {sig.signalStrength}
                    </strong>
                    <span className="text-[#8B877D]">/100</span>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-2 p-2 rounded-lg bg-[#FAF8F5] border border-[#DDD2C0]/70 text-xs">
                <div>
                  <span className="text-[8px] text-[#8B877D] uppercase font-bold block">Current Observation</span>
                  <strong className="text-[#0D1B24] font-bold">{sig.currentValueFormatted}</strong>
                </div>
                <div>
                  <span className="text-[8px] text-[#8B877D] uppercase font-bold block">Synthetic Baseline</span>
                  <span className="text-[#142B3A] font-semibold">{sig.baselineValueFormatted}</span>
                </div>
                <div>
                  <span className="text-[8px] text-[#8B877D] uppercase font-bold block">Baseline Variance</span>
                  <strong
                    className={cn(
                      "font-bold",
                      sig.deviationPercent > 5
                        ? "text-[#D96B3B]"
                        : sig.deviationPercent < -5
                        ? "text-[#245463]"
                        : "text-[#2F8068]"
                    )}
                  >
                    {sig.deviationFormatted}
                  </strong>
                </div>
                <div>
                  <span className="text-[8px] text-[#8B877D] uppercase font-bold block">Active Depth</span>
                  <span className="text-[#0D1B24] font-bold">{sig.depthM} m</span>
                </div>
              </div>

              {/* Reason Explanation */}
              <p className="text-xs font-sans text-[#142B3A] leading-relaxed my-1.5">
                <span className="font-mono font-bold text-[10px] text-[#8B877D] uppercase mr-1.5">Why Flagged:</span>
                {sig.whyFlagged}
              </p>

              {/* Historical Context Match Strip */}
              <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#DDD2C0]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
                <div className="text-[11px] font-sans text-[#142B3A]">
                  <span className="font-mono font-bold text-[10px] text-[#245463] uppercase mr-1">
                    Historical Match ({sig.historicalMatchLevel}):
                  </span>
                  <span>{sig.historicalSummary}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto pt-1 sm:pt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenEvidence(sig);
                    }}
                    className="px-2 py-1 rounded bg-[#142B3A] text-white text-[10px] font-mono font-bold hover:bg-[#245463] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <BookOpen className="h-2.5 w-2.5 text-[#D96B3B]" />
                    <span>VIEW EVIDENCE</span>
                  </button>

                  <Link
                    href="/nearby-wells"
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-1 rounded bg-white text-[#142B3A] border border-[#DDD2C0] text-[10px] font-mono font-bold hover:bg-[#DDD2C0]/40 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Layers className="h-2.5 w-2.5 text-[#245463]" />
                    <span>OFFSET WELLS</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

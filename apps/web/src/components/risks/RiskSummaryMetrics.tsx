"use client";

import React from "react";
import { ShieldAlert, AlertTriangle, CheckCircle2, BookOpen, Layers, Activity } from "lucide-react";
import { RiskSignalItem } from "./types";
import { getRiskSummaryMetrics } from "./riskIntelligenceData";
import { cn } from "@/lib/utils";

interface RiskSummaryMetricsProps {
  signals: RiskSignalItem[];
}

export function RiskSummaryMetrics({ signals }: RiskSummaryMetricsProps) {
  const metrics = getRiskSummaryMetrics(signals);

  const items = [
    {
      label: "ACTIVE SIGNALS",
      value: metrics.activeSignals,
      unit: "Flagged",
      color: "text-[#0D1B24]",
      badgeBg: "bg-[#142B3A] text-white",
    },
    {
      label: "HIGH ATTENTION",
      value: metrics.highAttention,
      unit: "Priority",
      color: "text-[#843D35]",
      badgeBg: "bg-[#843D35]/15 text-[#843D35] border border-[#843D35]/30",
    },
    {
      label: "WATCH STATUS",
      value: metrics.watch,
      unit: "Signals",
      color: "text-[#D96B3B]",
      badgeBg: "bg-[#D96B3B]/15 text-[#D96B3B] border border-[#D96B3B]/30",
    },
    {
      label: "NORMAL BEHAVIOR",
      value: metrics.normal,
      unit: "Nominal",
      color: "text-[#2F8068]",
      badgeBg: "bg-[#2F8068]/15 text-[#2F8068] border border-[#2F8068]/30",
    },
    {
      label: "HISTORICAL MATCHES",
      value: metrics.historicalMatches,
      unit: "Offset Wells",
      color: "text-[#245463]",
      badgeBg: "bg-[#245463]/15 text-[#245463] border border-[#245463]/30",
    },
    {
      label: "EVIDENCE RECORDS",
      value: metrics.evidenceRecords,
      unit: "DDR Recaps",
      color: "text-[#142B3A]",
      badgeBg: "bg-[#DDD2C0]/40 text-[#142B3A]",
    },
  ];

  return (
    <div className="w-full select-none">
      {/* 6-Cell Compact Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD2C0] flex flex-col justify-between"
          >
            <span className="text-[9px] font-mono font-bold text-[#8B877D] uppercase truncate">
              {item.label}
            </span>

            <div className="flex items-baseline gap-1.5 my-0.5">
              <strong className={cn("text-xl sm:text-2xl font-extrabold font-mono", item.color)}>
                {item.value}
              </strong>
              <span className="text-[10px] font-mono text-[#8B877D]">{item.unit}</span>
            </div>

            <div className="pt-1 border-t border-[#DDD2C0]/40 flex items-center justify-between">
              <span className={cn("text-[8px] font-mono font-bold px-1.5 py-0.2 rounded", item.badgeBg)}>
                EVALUATED
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

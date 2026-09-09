"use client";

import React from "react";
import { Grid, Activity } from "lucide-react";
import { RiskMatrixRow } from "./types";
import { cn } from "@/lib/utils";

interface CompactRiskMatrixProps {
  rows: RiskMatrixRow[];
}

export function CompactRiskMatrix({ rows }: CompactRiskMatrixProps) {
  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl p-3.5 sm:p-4 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2">
          <Grid className="h-4 w-4 text-[#142B3A]" />
          <h3 className="text-xs sm:text-sm font-extrabold font-mono text-[#0D1B24] tracking-tight">
            COMPACT RISK ATTENTION MATRIX
          </h3>
        </div>
        <span className="text-[9px] font-mono text-[#8B877D]">
          5 MONITORED CATEGORIES
        </span>
      </div>

      {/* Matrix Table */}
      <div className="pt-2">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="text-[9px] text-[#8B877D] uppercase border-b border-[#DDD2C0]/70">
              <th className="pb-1.5 font-bold">Hazard Category</th>
              <th className="pb-1.5 font-bold text-center">Low</th>
              <th className="pb-1.5 font-bold text-center">Medium</th>
              <th className="pb-1.5 font-bold text-center">High</th>
              <th className="pb-1.5 font-bold text-right">Strength</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDD2C0]/40">
            {rows.map((r) => (
              <tr key={r.hazardName} className="hover:bg-white/60 transition-colors">
                <td className="py-1.5 font-bold text-[#0D1B24] text-[11px]">
                  {r.hazardName}
                </td>
                <td className="py-1.5 text-center">
                  {r.level === "LOW" && (
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#2F8068]" />
                  )}
                </td>
                <td className="py-1.5 text-center">
                  {r.level === "MEDIUM" && (
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#D96B3B]" />
                  )}
                </td>
                <td className="py-1.5 text-center">
                  {r.level === "HIGH" && (
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#843D35]" />
                  )}
                </td>
                <td className="py-1.5 text-right font-bold text-[11px] text-[#142B3A]">
                  {r.signalStrength}/100
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

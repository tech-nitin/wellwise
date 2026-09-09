"use client";

import React from "react";
import Link from "next/link";
import { Layers, ArrowRight, ExternalLink } from "lucide-react";
import { OffsetWellComparisonItem } from "./types";
import { cn } from "@/lib/utils";

interface OffsetWellsRiskComparisonProps {
  offsets: OffsetWellComparisonItem[];
}

export function OffsetWellsRiskComparison({ offsets }: OffsetWellsRiskComparisonProps) {
  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl p-3.5 sm:p-4 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#245463]" />
          <h3 className="text-xs sm:text-sm font-extrabold font-mono text-[#0D1B24] tracking-tight">
            SIMILAR OFFSET WELLS &amp; CORRELATION BENCHMARK
          </h3>
        </div>
        <Link
          href="/nearby-wells"
          className="text-[10px] font-mono font-bold text-[#245463] hover:text-[#D96B3B] flex items-center gap-0.5"
        >
          <span>GIS Map View</span>
          <ArrowRight className="h-2.5 w-2.5" />
        </Link>
      </div>

      {/* Table / List */}
      <div className="overflow-x-auto pt-2">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="text-[9px] text-[#8B877D] uppercase border-b border-[#DDD2C0]/70">
              <th className="pb-1.5 font-bold">Offset Well</th>
              <th className="pb-1.5 font-bold">Proximity</th>
              <th className="pb-1.5 font-bold">Formation Match</th>
              <th className="pb-1.5 font-bold">Risk Match</th>
              <th className="pb-1.5 font-bold">Historical Incident</th>
              <th className="pb-1.5 font-bold text-right">Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDD2C0]/40">
            {offsets.map((off) => (
              <tr key={off.wellId} className="hover:bg-white/60 transition-colors">
                <td className="py-2 font-bold text-[#0D1B24]">
                  {off.wellId}
                </td>
                <td className="py-2 text-[#142B3A]">
                  {off.distanceKm} km
                </td>
                <td className="py-2 text-[#2F8068] font-bold">
                  {off.formationMatchPct}%
                </td>
                <td className="py-2">
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded text-[9px] font-bold",
                      off.riskMatchLevel === "Strong"
                        ? "bg-[#D96B3B]/15 text-[#D96B3B]"
                        : "bg-[#245463]/15 text-[#245463]"
                    )}
                  >
                    {off.riskMatchLevel}
                  </span>
                </td>
                <td className="py-2 font-sans text-[11px] text-[#142B3A] max-w-[200px] truncate">
                  {off.historicalEvent}
                </td>
                <td className="py-2 text-right">
                  <Link
                    href={`/wells/${off.wellId}`}
                    className="inline-flex items-center gap-1 text-[10px] text-[#142B3A] hover:text-[#D96B3B] font-bold"
                  >
                    <span>{off.evidenceRecordCount} records</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

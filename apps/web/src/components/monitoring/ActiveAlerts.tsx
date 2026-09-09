"use client";

import React from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import { ActiveAlertItem } from "./types";
import { cn } from "@/lib/utils";

interface ActiveAlertsProps {
  alerts: ActiveAlertItem[];
}

export function ActiveAlerts({ alerts }: ActiveAlertsProps) {
  const topAlerts = alerts.slice(0, 3);

  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl p-3.5 sm:p-4 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5 text-[#D96B3B]" />
          <h3 className="text-xs sm:text-sm font-extrabold font-mono text-[#0D1B24] tracking-tight">
            ACTIVE ALERTS
          </h3>
        </div>
        <button className="text-[10px] font-mono font-bold text-[#245463] hover:text-[#D96B3B] flex items-center gap-0.5 cursor-pointer">
          <span>View All</span>
          <ArrowRight className="h-2.5 w-2.5" />
        </button>
      </div>

      {/* 3 Compact Alert Rows */}
      <div className="space-y-1.5 pt-2 text-xs font-mono">
        {topAlerts.map((alt) => {
          const isWatch = alt.severity === "WATCH";

          return (
            <div
              key={alt.id}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-[#DDD2C0] flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0",
                    isWatch
                      ? "bg-[#D96B3B]/15 text-[#D96B3B]"
                      : alt.severity === "HISTORICAL"
                      ? "bg-[#245463]/15 text-[#245463]"
                      : "bg-[#2F8068]/15 text-[#2F8068]"
                  )}
                >
                  {alt.severity}
                </span>
                <span className="font-sans text-[11px] text-[#0D1B24] truncate">
                  {alt.title}
                </span>
              </div>

              <span className="text-[9px] text-[#8B877D] shrink-0">
                {alt.timestampAgo}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

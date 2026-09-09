"use client";

import React from "react";
import { Clock } from "lucide-react";
import { SignalHistoryEvent } from "./types";
import { cn } from "@/lib/utils";

interface SignalHistoryTimelineProps {
  events: SignalHistoryEvent[];
}

export function SignalHistoryTimeline({ events }: SignalHistoryTimelineProps) {
  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl p-3.5 sm:p-4 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#D96B3B]" />
          <h3 className="text-xs sm:text-sm font-extrabold font-mono text-[#0D1B24] tracking-tight">
            SIGNAL HISTORY &amp; PROGRESSION TIMELINE
          </h3>
        </div>
        <span className="text-[9px] font-mono text-[#8B877D]">
          LAST 45 MINUTES
        </span>
      </div>

      {/* Timeline List */}
      <div className="space-y-1.5 pt-2.5 text-xs font-mono">
        {events.map((ev, idx) => {
          const isWatch = ev.status === "WATCH";

          return (
            <div
              key={idx}
              className="p-2 rounded-lg bg-white border border-[#DDD2C0] flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <strong className={cn("font-bold text-xs shrink-0", isWatch ? "text-[#D96B3B]" : "text-[#0D1B24]")}>
                  {ev.timeLabel}
                </strong>

                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded text-[8px] font-bold shrink-0",
                    isWatch
                      ? "bg-[#D96B3B]/15 text-[#D96B3B]"
                      : ev.status === "ADVISORY"
                      ? "bg-[#245463]/15 text-[#245463]"
                      : "bg-[#2F8068]/15 text-[#2F8068]"
                  )}
                >
                  {ev.status}
                </span>

                <span className="font-sans text-[11px] text-[#142B3A] truncate">
                  {ev.summary}
                </span>
              </div>

              <span className="text-[10px] text-[#8B877D] shrink-0 font-bold">
                {ev.valueFormatted}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

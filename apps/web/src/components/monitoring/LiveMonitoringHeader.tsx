"use client";

import React from "react";
import { Play, Pause, Radio, Sparkles } from "lucide-react";
import { StreamState } from "./types";
import { cn } from "@/lib/utils";

interface LiveMonitoringHeaderProps {
  streamState: StreamState;
  onTogglePlayPause: () => void;
  onSelectSpeed: (speed: 1 | 2 | 5) => void;
}

export function LiveMonitoringHeader({
  streamState,
  onTogglePlayPause,
  onSelectSpeed,
}: LiveMonitoringHeaderProps) {
  const { isConnected, isPaused, speed, lastUpdatedSecondsAgo } = streamState;

  return (
    <div className="w-full select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DDD2C0]">
        {/* Left: Page Title & Subtitle */}
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0D1B24] font-sans">
              LIVE MONITORING
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#142B3A] text-white">
              REAL-TIME
            </span>
          </div>
          <p className="text-xs text-[#142B3A]/80 mt-0.5">
            Real-time drilling performance, early-warning signals, and historical context.
          </p>
        </div>

        {/* Right: Compact Live Stream & Speed Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Synthetic Demo Disclaimer Tag */}
          <span className="hidden md:inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono text-[#8B877D] bg-white border border-[#DDD2C0]">
            <Sparkles className="h-2.5 w-2.5 text-[#D96B3B]" />
            <span>Synthetic Demo Stream</span>
          </span>

          {/* Live Status Pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white border border-[#DDD2C0] shadow-2xs">
            <div className="relative flex items-center justify-center">
              {!isPaused && isConnected ? (
                <>
                  <span className="absolute h-3 w-3 rounded-full bg-[#2F8068]/30 animate-ping" />
                  <span className="h-2 w-2 rounded-full bg-[#2F8068]" />
                </>
              ) : isPaused ? (
                <span className="h-2 w-2 rounded-full bg-[#D96B3B]" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-[#843D35]" />
              )}
            </div>
            <span className="text-[11px] font-bold font-mono text-[#0D1B24]">
              {isPaused ? "PAUSED" : "LIVE"}
            </span>
            <span className="text-[10px] text-[#8B877D] font-mono">
              {lastUpdatedSecondsAgo === 0 ? "2s ago" : `${lastUpdatedSecondsAgo}s ago`}
            </span>
          </div>

          {/* Stream Controls */}
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-[#DDD2C0]">
            <button
              onClick={onTogglePlayPause}
              title={isPaused ? "Resume Stream" : "Pause Stream"}
              className={cn(
                "h-6 px-2 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer",
                isPaused
                  ? "bg-[#D96B3B] text-white"
                  : "bg-[#142B3A] text-white hover:bg-[#245463]"
              )}
            >
              {isPaused ? <Play className="h-2.5 w-2.5 fill-current" /> : <Pause className="h-2.5 w-2.5 fill-current" />}
            </button>

            {([1, 2, 5] as const).map((s) => (
              <button
                key={s}
                onClick={() => onSelectSpeed(s)}
                className={cn(
                  "px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-md transition-colors cursor-pointer",
                  speed === s
                    ? "bg-[#142B3A] text-white"
                    : "text-[#142B3A]/70 hover:bg-[#DDD2C0]/40"
                )}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

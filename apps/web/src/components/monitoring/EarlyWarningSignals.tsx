"use client";

import React from "react";
import { ShieldAlert, ArrowUpRight } from "lucide-react";
import { EarlyWarningSignal, SignalSeverity } from "./types";
import { cn } from "@/lib/utils";

interface EarlyWarningSignalsProps {
  signals: EarlyWarningSignal[];
  onOpenEvidence?: (signal: EarlyWarningSignal) => void;
}

export function EarlyWarningSignals({ signals, onOpenEvidence }: EarlyWarningSignalsProps) {
  const getStatusBadge = (status: SignalSeverity) => {
    switch (status) {
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
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl p-3.5 sm:p-4 shadow-2xs select-none flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-[#D96B3B]" />
          <h3 className="text-sm font-extrabold font-mono text-[#0D1B24] tracking-tight">
            EARLY-WARNING SIGNALS
          </h3>
        </div>
        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#D96B3B] text-white">
          SIGNALS (4)
        </span>
      </div>

      {/* List of 4 Compact Signals */}
      <div className="space-y-2 py-2">
        {signals.map((sig) => {
          const badge = getStatusBadge(sig.status);
          const isWatch = sig.status === "WATCH" || sig.status === "CRITICAL";

          return (
            <div
              key={sig.id}
              className={cn(
                "p-2.5 rounded-lg border transition-colors text-xs font-mono flex flex-col justify-between",
                isWatch
                  ? "bg-white border-[#D96B3B] ring-1 ring-[#D96B3B]/20"
                  : "bg-white border-[#DDD2C0]"
              )}
            >
              {/* Title + Badge + Score */}
              <div className="flex items-center justify-between gap-1 mb-1">
                <strong className="font-bold text-[#0D1B24] text-xs">
                  {sig.name}
                </strong>

                <div className="flex items-center gap-1.5">
                  <span className={cn("px-1.5 py-0.2 rounded text-[9px] font-bold border flex items-center gap-1", badge.bg)}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", badge.dot)} />
                    <span>{badge.label}</span>
                  </span>
                  <span className={cn("text-[10px] font-extrabold", isWatch ? "text-[#D96B3B]" : "text-[#2F8068]")}>
                    {sig.signalStrengthPct}
                  </span>
                </div>
              </div>

              {/* Concise Reason */}
              <p className="text-[11px] font-sans text-[#142B3A] leading-tight">
                {sig.status === "WATCH" && sig.id === "signal-torque"
                  ? "Torque is approximately 12% above recent baseline."
                  : sig.status === "WATCH" && sig.id === "signal-pressure"
                  ? "SPP is elevated (+106 psi) relative to baseline."
                  : sig.id === "signal-mud-loss"
                  ? "Flow return rate remains stable."
                  : sig.id === "signal-rop"
                  ? "ROP remains within recent range."
                  : sig.reason}
              </p>

              {/* Footer: Values */}
              <div className="flex items-center justify-between text-[10px] text-[#8B877D] mt-1 pt-1 border-t border-[#DDD2C0]/40">
                <span>{sig.currentValue} vs {sig.baselineValue} {sig.unit}</span>
                {onOpenEvidence && isWatch && (
                  <button
                    onClick={() => onOpenEvidence(sig)}
                    className="text-[#245463] font-bold hover:text-[#D96B3B] flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Evidence</span>
                    <ArrowUpRight className="h-2.5 w-2.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

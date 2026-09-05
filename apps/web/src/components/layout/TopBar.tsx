"use client";

import React, { useEffect, useState } from "react";
import { APP_CONFIG } from "@/lib/constants";
import { useWellStore } from "@/store/wellStore";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Activity, Radio } from "lucide-react";
import { formatTimestampIST } from "@/lib/formatters";

export function TopBar() {
  const { selectedWellId, selectedRigId } = useWellStore();
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentTime(formatTimestampIST());
    }, 0);
    const interval = setInterval(() => {
      setCurrentTime(formatTimestampIST());
    }, 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full bg-background-secondary border-b border-border text-[11px] font-mono text-muted-foreground select-none z-30">
      <div className="flex flex-wrap items-center justify-between px-3 py-1 gap-2">
        {/* Left: Organization & Rig Telemetry Ribbon */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-foreground font-semibold tracking-wide">
            <span className="text-primary font-bold">OIL</span>
            <span className="text-border-bright">/</span>
            <span>eRTMAC-NWIS</span>
          </div>

          <div className="h-3 w-[1px] bg-border hidden sm:block" />

          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">RIG:</span>
            <span className="text-foreground font-semibold">{selectedRigId}</span>
            <span className="inline-block px-1 py-0.2 rounded text-[9px] bg-success/20 text-success border border-success/40">
              DRILLING
            </span>
          </div>

          <div className="h-3 w-[1px] bg-border hidden md:block" />

          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">WELL:</span>
            <span className="text-telemetry font-semibold">{selectedWellId}</span>
            <span className="text-muted-foreground text-[10px]">
              ({APP_CONFIG.defaultBasin.split(" ")[0]})
            </span>
          </div>

          <div className="h-3 w-[1px] bg-border hidden lg:block" />

          {/* Key Drilling Telemetry Highlights */}
          <div className="hidden lg:flex items-center gap-3 text-[10px]">
            <div>
              <span className="text-muted-foreground">DEPTH: </span>
              <span className="text-foreground font-medium">3,248.5 m MD</span>
              <span className="text-muted-foreground ml-1">
                (2,840.2 m TVD)
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">ROP: </span>
              <span className="text-telemetry font-medium">18.4 m/h</span>
            </div>
            <div>
              <span className="text-muted-foreground">WOB: </span>
              <span className="text-foreground font-medium">24.5 klbf</span>
            </div>
            <div>
              <span className="text-muted-foreground">SPP: </span>
              <span className="text-foreground font-medium">2,850 psi</span>
            </div>
          </div>
        </div>

        {/* Right: Stream Health & Clock */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-card px-2 py-0.5 rounded border border-border">
            <Radio className="h-3 w-3 text-telemetry animate-pulse" />
            <span className="text-[10px] text-foreground">WITSML FEED</span>
            <StatusIndicator status="online" pulse />
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Activity className="h-3 w-3 text-success" />
            <span>{currentTime || "STREAMING"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

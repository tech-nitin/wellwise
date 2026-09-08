import React from "react";
import { Gauge } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-muted-foreground select-none">
      <div className="relative flex items-center justify-center">
        <Gauge className="h-8 w-8 text-telemetry animate-pulse" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-xs uppercase tracking-widest text-foreground">
          Acquiring Telemetry Stream...
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          Synchronizing with OIL eRTMAC-NWIS Gateway
        </span>
      </div>
    </div>
  );
}

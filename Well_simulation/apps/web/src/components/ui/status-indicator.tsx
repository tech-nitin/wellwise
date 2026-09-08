import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusType =
  | "online"
  | "normal"
  | "warning"
  | "critical"
  | "offline";

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  pulse?: boolean;
  className?: string;
}

export function StatusIndicator({
  status,
  label,
  pulse = false,
  className,
}: StatusIndicatorProps) {
  const dotColorMap: Record<StatusType, string> = {
    online: "bg-telemetry",
    normal: "bg-success",
    warning: "bg-warning",
    critical: "bg-risk-critical",
    offline: "bg-muted-foreground",
  };

  const pingColorMap: Record<StatusType, string> = {
    online: "bg-telemetry",
    normal: "bg-success",
    warning: "bg-warning",
    critical: "bg-risk-critical",
    offline: "bg-muted-foreground",
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5 text-xs", className)}>
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              pingColorMap[status]
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            dotColorMap[status]
          )}
        />
      </span>
      {label && (
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
}

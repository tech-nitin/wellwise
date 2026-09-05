"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Drilling Control Room UI Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center select-none">
      <div className="h-12 w-12 rounded-full bg-risk-critical/15 border border-risk-critical/30 flex items-center justify-center text-risk-critical mb-4">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-1">
        Telemetry Stream Fault Detected
      </h2>
      <p className="text-xs text-muted-foreground max-w-md mb-5 font-mono">
        {error.message ||
          "An unexpected system exception occurred in the control room interface."}
      </p>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => reset()}
          className="gap-1.5 font-mono"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Retry Stream
        </Button>
      </div>
    </div>
  );
}

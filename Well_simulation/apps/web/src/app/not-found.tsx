import React from "react";
import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center select-none">
      <div className="h-12 w-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary mb-4">
        <Compass className="h-6 w-6" />
      </div>

      <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-1">
        Well / Asset Not Found (404)
      </h2>
      <p className="text-xs text-muted-foreground max-w-md mb-5 font-mono">
        The requested asset or telemetry route does not exist within the Oil India Limited basin index.
      </p>

      <Link href="/dashboard">
        <Button variant="secondary" size="sm" className="gap-1.5 font-mono">
          <ArrowLeft className="h-3.5 w-3.5" />
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}

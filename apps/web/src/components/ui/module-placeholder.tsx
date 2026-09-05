import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LucideIcon, CheckCircle2, Cpu } from "lucide-react";

interface SpecItem {
  label: string;
  value: string;
}

interface ModulePlaceholderProps {
  moduleName: string;
  category: string;
  description: string;
  icon: LucideIcon;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "telemetry" | "success" | "warning";
  specs: SpecItem[];
  plannedCapabilities: string[];
  backLink?: string;
}

export function ModulePlaceholder({
  moduleName,
  category,
  description,
  icon: Icon,
  badgeText = "ARCHITECTURE FOUNDATION READY",
  badgeVariant = "telemetry",
  specs,
  plannedCapabilities,
  backLink = "/dashboard",
}: ModulePlaceholderProps) {
  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Header Banner */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded bg-telemetry/10 border border-telemetry/30 flex items-center justify-center text-telemetry shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {category}
                </span>
                <span className="text-border-bright">&bull;</span>
                <span className="text-[10px] font-mono text-telemetry">
                  SIH26121 &bull; Oil India Limited
                </span>
              </div>
              <CardTitle className="text-sm sm:text-base mt-0.5">
                {moduleName}
              </CardTitle>
            </div>
          </div>
          <Badge variant={badgeVariant}>{badgeText}</Badge>
        </CardHeader>

        <CardContent className="pt-3 space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
            {description}
          </p>

          {/* Engineering Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60 font-mono text-xs">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="bg-card-muted/70 p-2.5 rounded border border-border/50"
              >
                <span className="text-[10px] text-muted-foreground block uppercase">
                  {spec.label}
                </span>
                <span className="font-semibold text-foreground mt-0.5 block">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Planned Engineering Capabilities & Architectural Integration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <CardTitle>Planned Technical Capabilities</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <ul className="space-y-2">
              {plannedCapabilities.map((cap, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader className="pb-2">
              <CardTitle>Integration Foundation Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-3 font-mono text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between text-muted-foreground text-[11px]">
                  <span>Component Shell & Layout:</span>
                  <span className="text-success font-semibold">INITIALIZED</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-[11px]">
                  <span>Domain Type Definitions:</span>
                  <span className="text-success font-semibold">TYPED</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-[11px]">
                  <span>TanStack Query & Service Client:</span>
                  <span className="text-telemetry font-semibold">PREPARED</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-[11px]">
                  <span>Next Feature Implementation:</span>
                  <span className="text-warning font-semibold">INCREMENTAL</span>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground pt-2 border-t border-border/50">
                Ready for backend API service and operational engine integration in accordance with the SIH26121 technical roadmap.
              </p>
            </CardContent>
          </div>

          <div className="p-3.5 pt-0">
            <Link href={backLink}>
              <Button variant="outline" size="sm" className="w-full gap-1.5 font-mono">
                <ArrowLeft className="h-3 w-3" />
                Return to Operational Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

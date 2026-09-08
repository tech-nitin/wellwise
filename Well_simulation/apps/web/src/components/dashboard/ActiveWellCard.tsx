import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, ArrowRight } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export function ActiveWellCard() {
  const currentDepth = 3248.5;
  const targetDepth = 3850.0;
  const progressPercent = Math.min(
    100,
    Math.round((currentDepth / targetDepth) * 100)
  );

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-telemetry" />
            <CardTitle>Active Well Operation</CardTitle>
          </div>
          <Badge variant="success">ACTIVE DRILLING</Badge>
        </CardHeader>

        <CardContent className="space-y-3 pt-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl font-bold font-mono tracking-tight text-foreground">
                {APP_CONFIG.defaultWellId}
              </span>
              <p className="text-[11px] text-muted-foreground">
                Nahorkatiya Field &bull; Upper Assam Basin
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-muted-foreground uppercase">
                Rig
              </span>
              <p className="text-xs font-mono font-semibold text-foreground">
                {APP_CONFIG.defaultRigId}
              </p>
            </div>
          </div>

          {/* Depth Progress */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">Measured Depth (MD):</span>
              <span className="font-semibold text-telemetry">
                {currentDepth.toFixed(1)} m / {targetDepth.toFixed(1)} m
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-telemetry h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>Current Formation: Tipam Sandstone</span>
              <span>{progressPercent}% to TD</span>
            </div>
          </div>

          {/* Quick Technical Specs */}
          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
            <div className="bg-muted/40 p-2 rounded border border-border/50">
              <span className="text-[10px] text-muted-foreground block">
                TRUE VERTICAL DEPTH
              </span>
              <span className="font-semibold text-foreground">2,840.2 m TVD</span>
            </div>
            <div className="bg-muted/40 p-2 rounded border border-border/50">
              <span className="text-[10px] text-muted-foreground block">
                CASING SECTION
              </span>
              <span className="font-semibold text-foreground">9-5/8&quot; Intermediate</span>
            </div>
          </div>
        </CardContent>
      </div>

      <div className="p-3.5 pt-0">
        <Link href={`/wells/${APP_CONFIG.defaultWellId}`}>
          <Button variant="outline" size="sm" className="w-full gap-1.5 font-mono">
            View Full Well Dossier
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gauge, ArrowRight } from "lucide-react";

export function TelemetrySnapshot() {
  const telemetryItems = [
    {
      label: "Rate of Penetration",
      short: "ROP",
      value: "18.4",
      unit: "m/h",
      status: "normal",
      statusText: "OPTIMAL",
    },
    {
      label: "Weight on Bit",
      short: "WOB",
      value: "24.5",
      unit: "klbf",
      status: "normal",
      statusText: "STABLE",
    },
    {
      label: "Surface Rotary Speed",
      short: "RPM",
      value: "115",
      unit: "rpm",
      status: "normal",
      statusText: "SMOOTH",
    },
    {
      label: "Standpipe Pressure",
      short: "SPP",
      value: "2,850",
      unit: "psi",
      status: "normal",
      statusText: "NORMAL",
    },
    {
      label: "Mud Weight (In / Out)",
      short: "MW",
      value: "11.4 / 11.6",
      unit: "ppg",
      status: "normal",
      statusText: "CIRCULATING",
    },
    {
      label: "Formation Gas",
      short: "GAS",
      value: "0.8",
      unit: "%",
      status: "warning",
      statusText: "ADVISORY",
    },
  ];

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-telemetry" />
            <CardTitle>Real-Time Telemetry Snapshot</CardTitle>
          </div>
          <Badge variant="telemetry">WITSML LIVE</Badge>
        </CardHeader>

        <CardContent className="pt-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono">
            {telemetryItems.map((item) => (
              <div
                key={item.short}
                className="bg-card-muted/70 p-2.5 rounded border border-border/60 hover:border-border-bright transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">
                    {item.short}
                  </span>
                  <span
                    className={`text-[9px] px-1 rounded font-semibold ${
                      item.status === "warning"
                        ? "text-warning bg-warning/10"
                        : "text-success bg-success/10"
                    }`}
                  >
                    {item.statusText}
                  </span>
                </div>
                <div className="text-base font-bold text-foreground tracking-tight">
                  {item.value}
                  <span className="text-[10px] font-normal text-muted-foreground ml-1">
                    {item.unit}
                  </span>
                </div>
                <span className="text-[9px] text-muted-foreground truncate block mt-0.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </div>

      <div className="p-3.5 pt-0">
        <Link href="/live-monitoring">
          <Button variant="outline" size="sm" className="w-full gap-1.5 font-mono">
            Open Live Telemetry Feed
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

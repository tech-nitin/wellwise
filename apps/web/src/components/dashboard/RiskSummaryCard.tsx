import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";

export function RiskSummaryCard() {
  const activeAlerts = [
    {
      id: "risk-01",
      severity: "risk-high" as const,
      severityLabel: "HIGH RISK",
      category: "DIFFERENTIAL STICKING",
      depth: "3,260 m - 3,310 m MD",
      description:
        "High permeable depleted sand anticipated in Tipam formation. Precedent in offset well NHK-118 (1.2 km North).",
      offsetWell: "NHK-118",
    },
    {
      id: "risk-02",
      severity: "warning" as const,
      severityLabel: "MEDIUM ADVISORY",
      category: "FORMATION GAS INFLUX",
      depth: "3,340 m MD",
      description:
        "Mud weight window narrows. Monitor trip tank volume and connection gas closely.",
      offsetWell: "NHK-102",
    },
  ];

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <CardTitle>AI Risk & Hazard Advisory</CardTitle>
          </div>
          <Badge variant="warning">2 HAZARDS PREDICTED</Badge>
        </CardHeader>

        <CardContent className="space-y-2.5 pt-3">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-2.5 rounded bg-card-muted/70 border border-border/70 hover:border-border-bright transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert
                    className={`h-3.5 w-3.5 ${
                      alert.severity === "risk-high"
                        ? "text-risk-high"
                        : "text-warning"
                    }`}
                  />
                  <span className="text-xs font-bold font-mono text-foreground">
                    {alert.category}
                  </span>
                </div>
                <Badge variant={alert.severity}>{alert.severityLabel}</Badge>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {alert.description}
              </p>

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/40 text-[10px] font-mono text-muted-foreground">
                <span>Depth: {alert.depth}</span>
                <span className="text-telemetry">
                  Precedent: {alert.offsetWell}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </div>

      <div className="p-3.5 pt-0">
        <Link href="/risks">
          <Button variant="outline" size="sm" className="w-full gap-1.5 font-mono">
            View All Hazard Precedents
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

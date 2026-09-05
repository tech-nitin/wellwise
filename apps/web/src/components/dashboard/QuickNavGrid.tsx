import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Compass,
  Bot,
  FileText,
  GitCompare,
  BarChart3,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

export function QuickNavGrid() {
  const quickModules = [
    {
      title: "Nearby Wells GIS",
      desc: "Radar view of offset wells within 5.0 km radius",
      href: "/nearby-wells",
      icon: Compass,
      tag: "5 Offset Wells",
    },
    {
      title: "AI Knowledge Assistant",
      desc: "RAG query engine across historical well dossiers & DDRs",
      href: "/knowledge",
      icon: Bot,
      tag: "LLM Ready",
    },
    {
      title: "Documents & OCR",
      desc: "Mud logs, casing tallies, and daily reports",
      href: "/documents",
      icon: FileText,
      tag: "18 Documents",
    },
    {
      title: "Well Correlation",
      desc: "Stratigraphic markers and offset log matching",
      href: "/correlation",
      icon: GitCompare,
      tag: "4 Formations",
    },
    {
      title: "Drilling Analytics",
      desc: "ROP vs WOB trends and hydraulics calculations",
      href: "/analytics",
      icon: BarChart3,
      tag: "Hydraulics",
    },
    {
      title: "Audit Trail",
      desc: "Engineering decisions, alarms, and supervisor actions",
      href: "/audit",
      icon: ShieldCheck,
      tag: "Compliance",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Operational Modules Quick Access</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickModules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.href}
                href={m.href}
                className="group flex flex-col justify-between p-3 rounded bg-card-muted/60 border border-border/70 hover:border-telemetry/50 hover:bg-card-muted transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-muted flex items-center justify-center text-telemetry group-hover:bg-telemetry/20 transition-colors">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-foreground font-mono">
                        {m.title}
                      </span>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-telemetry group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-3 pt-1 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>STATUS: READY</span>
                  <span className="text-telemetry">{m.tag}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

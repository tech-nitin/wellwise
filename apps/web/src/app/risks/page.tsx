import React from "react";
import { ModulePlaceholder } from "@/components/ui/module-placeholder";
import { AlertTriangle } from "lucide-react";

export default function RisksPage() {
  return (
    <ModulePlaceholder
      moduleName="Risk & Hazard Early Warning System"
      category="PREDICTIVE DRILLING SAFETY"
      description="Continuous AI-powered drilling hazard prediction engine. Evaluates real-time telemetry against historical offset well incident signatures to forecast kicks, differential sticking, lost circulation, and wellbore instability before critical events occur."
      icon={AlertTriangle}
      badgeText="2 ACTIVE HAZARDS"
      badgeVariant="warning"
      specs={[
        { label: "Active Hazards", value: "2 Monitored Events" },
        { label: "High Risk Threshold", value: "Depth: 3,260 m MD" },
        { label: "Offset Incident Match", value: "92% Similarity (NHK-118)" },
        { label: "Evaluation Cadence", value: "Continuous (Real-time)" },
      ]}
      plannedCapabilities={[
        "Differential sticking probability matrix based on mud overbalance, permeable sand thickness, and drillstring stationary time",
        "Kick and influx detection comparing flow-out delta vs pump rate and total gas trends",
        "Lost circulation detection comparing pit volume trends against annular pressure loss",
        "Offset well incident timeline mapping: shows exact depths where offset wells encountered kicks/stuck pipes",
        "Engineered mitigation checklist and automated supervisor escalation workflow",
      ]}
    />
  );
}

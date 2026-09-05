import React from "react";
import { ModulePlaceholder } from "@/components/ui/module-placeholder";
import { GitCompare } from "lucide-react";

export default function CorrelationPage() {
  return (
    <ModulePlaceholder
      moduleName="Multi-Well Stratigraphic Correlation"
      category="GEOLOGICAL FORMATION MATCHING"
      description="Stratigraphic and petrophysical well log correlation tool. Aligns active well lithology and gamma ray/resistivity logs against key offset wells across the Upper Assam Basin to predict formation tops, fault boundaries, and pay zone depths."
      icon={GitCompare}
      specs={[
        { label: "Active Comparison", value: "NHK-124 vs NHK-118, NHK-102" },
        { label: "Log Channels", value: "GR, Resistivity, Sonic, Density" },
        { label: "Key Horizons", value: "Tipam, Girujan, Barail, Kopili" },
        { label: "Datum", value: "Mean Sea Level (MSL)" },
      ]}
      plannedCapabilities={[
        "Interactive multi-track log correlation canvas with synchronized depth scrolling",
        "Automated formation top pick suggestion using offset marker similarities",
        "Stratigraphic flattening on chosen datum marker (e.g., Top of Barail)",
        "Lithological column shading (Sandstone, Shale, Siltstone, Limestone)",
        "Structural cross-section generation displaying fault throws and dip angles",
      ]}
    />
  );
}

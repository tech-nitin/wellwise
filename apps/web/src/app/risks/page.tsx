import React from "react";
import { Metadata } from "next";
import { RiskIntelligenceView } from "@/components/risks/RiskIntelligenceView";

export const metadata: Metadata = {
  title: "Risk Intelligence & Early-Warning Precursor Engine",
  description:
    "Explainable early-warning signals, offset hazard benchmarking, and historical evidence correlation for Oil India Limited (OIL) drilling operations.",
};

export default function RisksPage() {
  return <RiskIntelligenceView />;
}

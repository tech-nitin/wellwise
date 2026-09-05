"use client";

import React from "react";
import { useGeologicalParallax } from "@/hooks/useGeologicalParallax";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { InteractiveWellMap } from "@/components/dashboard/InteractiveWellMap";
import { IntelligenceFeatures } from "@/components/dashboard/IntelligenceFeatures";
import { LiveTelemetry } from "@/components/dashboard/LiveTelemetry";
import { RiskIntelligence } from "@/components/dashboard/RiskIntelligence";
import { AIKnowledge } from "@/components/dashboard/AIKnowledge";
import { KeyMetrics } from "@/components/dashboard/KeyMetrics";
import { FooterSection } from "@/components/dashboard/FooterSection";

export default function DashboardPage() {
  const containerRef = useGeologicalParallax<HTMLDivElement>();

  return (
    <div ref={containerRef} className="w-full flex flex-col relative">
      {/* 1. Large Editorial Hero Section with 3D Drilling Visualization */}
      <HeroSection />

      {/* 2. Full-Width Interactive GIS Map with Floating Intelligence Panel */}
      <InteractiveWellMap />

      {/* 3. Open Layout Intelligence Features with 3D Tilt */}
      <IntelligenceFeatures />

      {/* 4. Live Drilling Performance Telemetry Strip */}
      <LiveTelemetry />

      {/* 5. Predictive Risk Intelligence & Evidence Timeline */}
      <RiskIntelligence />

      {/* 6. AI Knowledge Engine ("Ask the Field") */}
      <AIKnowledge />

      {/* 7. Key Operational Statistics & Numbers */}
      <KeyMetrics />

      {/* 8. Minimal Engineering Footer */}
      <FooterSection />
    </div>
  );
}

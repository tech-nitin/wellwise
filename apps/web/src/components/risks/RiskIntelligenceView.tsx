"use client";

import React, { useState, useMemo, useCallback } from "react";
import { SYNTHETIC_WELLS, Well } from "@/components/dashboard/data/wells";
import {
  RiskSignalItem,
  RiskCategory,
  RiskEvidenceRecord,
} from "./types";
import {
  getRiskSignals,
  getRiskEvidenceRecords,
  getOffsetWellRiskComparisons,
  getDepthRiskRailEvents,
  getSignalHistoryEvents,
  getMitigationPractices,
  getRiskMatrixRows,
} from "./riskIntelligenceData";

import { RiskHeader } from "./RiskHeader";
import { RiskWellContextBar } from "./RiskWellContextBar";
import { RiskSummaryMetrics } from "./RiskSummaryMetrics";
import { RiskCategoryFilter } from "./RiskCategoryFilter";
import { RiskSignalsList } from "./RiskSignalsList";
import { WhyThisSignalPanel } from "./WhyThisSignalPanel";
import { HistoricalEvidenceList } from "./HistoricalEvidenceList";
import { OffsetWellsRiskComparison } from "./OffsetWellsRiskComparison";
import { DepthRiskMap } from "./DepthRiskMap";
import { HistoricalPatternMatch } from "./HistoricalPatternMatch";
import { EngineeringInterpretation } from "./EngineeringInterpretation";
import { MitigationPractices } from "./MitigationPractices";
import { SignalHistoryTimeline } from "./SignalHistoryTimeline";
import { CompactRiskMatrix } from "./CompactRiskMatrix";
import { RiskActionsBar } from "./RiskActionsBar";
import { EvidenceDocumentModal } from "./EvidenceDocumentModal";

interface RiskIntelligenceViewProps {
  initialWellId?: string;
}

export function RiskIntelligenceView({ initialWellId }: RiskIntelligenceViewProps) {
  // 1. Active Well state
  const [selectedWell, setSelectedWell] = useState<Well>(() => {
    if (initialWellId) {
      const found = SYNTHETIC_WELLS.find(
        (w) => w.id.toLowerCase() === initialWellId.toLowerCase()
      );
      if (found) return found;
    }
    return SYNTHETIC_WELLS.find((w) => w.id === "NHK-124") || SYNTHETIC_WELLS[0];
  });

  // 2. Active Category filter
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory>("ALL");

  // 3. Selected Signal for detailed reasoning chain
  const allSignals = useMemo(() => getRiskSignals(selectedWell), [selectedWell]);
  const [selectedSignalId, setSelectedSignalId] = useState<string>(() => allSignals[0]?.id || "sig-torque");

  // 4. Modal state for evidence transcript preview
  const [activeEvidenceRecord, setActiveEvidenceRecord] = useState<RiskEvidenceRecord | null>(null);

  // Derived current depth (e.g. 3,180.4 m)
  const currentDepthM = useMemo(() => {
    const td = selectedWell.depthM || 3240;
    return Math.max(100, Math.round(td - 60)) + 0.4;
  }, [selectedWell]);

  // Filtered signals by category
  const filteredSignals = useMemo(() => {
    if (selectedCategory === "ALL") return allSignals;
    return allSignals.filter((s) => s.category === selectedCategory);
  }, [allSignals, selectedCategory]);

  // Active signal object
  const activeSignal = useMemo(() => {
    return allSignals.find((s) => s.id === selectedSignalId) || allSignals[0];
  }, [allSignals, selectedSignalId]);

  // Counts by category for filter pills
  const signalCountsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    allSignals.forEach((s) => {
      map[s.category] = (map[s.category] || 0) + 1;
    });
    return map;
  }, [allSignals]);

  // Other derived data models
  const evidenceRecords = useMemo(
    () => getRiskEvidenceRecords(selectedWell, activeSignal?.id),
    [selectedWell, activeSignal?.id]
  );

  const offsetComparisons = useMemo(
    () => getOffsetWellRiskComparisons(selectedWell),
    [selectedWell]
  );

  const depthRailEvents = useMemo(
    () => getDepthRiskRailEvents(selectedWell),
    [selectedWell]
  );

  const signalHistoryEvents = useMemo(
    () => getSignalHistoryEvents(selectedWell),
    [selectedWell]
  );

  const mitigationPractices = useMemo(
    () => getMitigationPractices(selectedWell, activeSignal?.id),
    [selectedWell, activeSignal?.id]
  );

  const riskMatrixRows = useMemo(
    () => getRiskMatrixRows(selectedWell),
    [selectedWell]
  );

  const handleSelectWell = useCallback((well: Well) => {
    setSelectedWell(well);
    const newSignals = getRiskSignals(well);
    setSelectedSignalId(newSignals[0]?.id || "sig-torque");
    setSelectedCategory("ALL");
  }, []);

  const handleOpenEvidenceForSignal = (sig: RiskSignalItem) => {
    if (evidenceRecords.length > 0) {
      setActiveEvidenceRecord(evidenceRecords[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#0D1B24] font-sans pb-10">
      <div className="max-w-[1360px] mx-auto px-3 sm:px-5 lg:px-6 pt-3 sm:pt-4 space-y-3.5 sm:space-y-4">
        {/* 1. Page Header */}
        <RiskHeader />

        {/* 2. Well / Operational Context Selector Bar */}
        <RiskWellContextBar
          selectedWell={selectedWell}
          onSelectWell={handleSelectWell}
          currentDepthM={currentDepthM}
          activity="Drilling Ahead"
          holeSection={'8½"'}
        />

        {/* 3. Top Risk Summary Metrics Strip */}
        <RiskSummaryMetrics signals={allSignals} />

        {/* 4. Risk Category Filter Pills */}
        <RiskCategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          signalCountsByCategory={signalCountsByCategory}
        />

        {/* 5. Main 2-Column Content Grid (~65% Left / ~35% Right on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-start">
          {/* LEFT COLUMN (~65%): Signals Ranking, Why This Signal, Historical Evidence, Offset Wells */}
          <div className="lg:col-span-8 space-y-3.5 sm:space-y-4">
            {/* Primary Ranked Early-Warning Signals List */}
            <RiskSignalsList
              signals={filteredSignals}
              selectedSignalId={selectedSignalId}
              onSelectSignal={(sig) => setSelectedSignalId(sig.id)}
              onOpenEvidence={handleOpenEvidenceForSignal}
            />

            {/* Why This Signal? Explainable Reasoning Chain */}
            {activeSignal && (
              <WhyThisSignalPanel
                signal={activeSignal}
                formation={selectedWell.formation || "Jurassic T13"}
                onOpenEvidence={() => handleOpenEvidenceForSignal(activeSignal)}
              />
            )}

            {/* Historical Evidence Records List */}
            <HistoricalEvidenceList
              records={evidenceRecords}
              onSelectRecord={(rec) => setActiveEvidenceRecord(rec)}
            />

            {/* Similar Offset Wells Comparison Benchmark */}
            <OffsetWellsRiskComparison offsets={offsetComparisons} />
          </div>

          {/* RIGHT COLUMN (~35%): Depth Map, Pattern Match, Interpretation, Mitigation, Timeline, Matrix */}
          <div className="lg:col-span-4 space-y-3.5 sm:space-y-4">
            {/* Depth-Based Risk Rail */}
            <DepthRiskMap
              events={depthRailEvents}
              currentDepthM={currentDepthM}
              targetTdM={selectedWell.depthM || 3240}
            />

            {/* Historical Pattern Match */}
            <HistoricalPatternMatch
              well={selectedWell}
              currentDepthM={currentDepthM}
            />

            {/* Engineering Interpretation & Checklist */}
            <EngineeringInterpretation
              wellId={selectedWell.id}
              formation={selectedWell.formation || "Jurassic T13"}
            />

            {/* Historical Mitigation Practices */}
            <MitigationPractices practices={mitigationPractices} />

            {/* Signal Progression Timeline */}
            <SignalHistoryTimeline events={signalHistoryEvents} />

            {/* Compact Attention Matrix */}
            <CompactRiskMatrix rows={riskMatrixRows} />
          </div>
        </div>

        {/* 6. Engineer Actions Bar */}
        <RiskActionsBar wellId={selectedWell.id} />
      </div>

      {/* Evidence Source Preview Modal */}
      {activeEvidenceRecord && (
        <EvidenceDocumentModal
          document={activeEvidenceRecord}
          currentDepthM={currentDepthM}
          onClose={() => setActiveEvidenceRecord(null)}
        />
      )}
    </div>
  );
}

"use client";

import React, { useState, useTransition, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SYNTHETIC_WELLS, Well } from "@/components/dashboard/data/wells";
import { KnowledgeHeader } from "./KnowledgeHeader";
import { KnowledgeWellContextBar } from "./KnowledgeWellContextBar";
import { KnowledgeSearchArea } from "./KnowledgeSearchArea";
import { FieldIntelligenceAnswer } from "./FieldIntelligenceAnswer";
import { EvidenceSummaryCard } from "./EvidenceSummaryCard";
import { SupportingEvidenceList } from "./SupportingEvidenceList";
import { HistoricalPatternMatchCard } from "./HistoricalPatternMatchCard";
import { OffsetExperienceTable } from "./OffsetExperienceTable";
import { HistoricalMitigationCard } from "./HistoricalMitigationCard";
import { DocumentIntelligencePipeline } from "./DocumentIntelligencePipeline";
import { KnowledgeRepositoryBrowser } from "./KnowledgeRepositoryBrowser";
import { RecentInvestigations } from "./RecentInvestigations";
import { SourceViewerModal } from "./SourceViewerModal";
import {
  KnowledgeAnswer,
  KnowledgeEvidenceItem,
  KnowledgeFilterState,
} from "./types";
import {
  syntheticSearchKnowledge,
  DEFAULT_ANSWER,
} from "./knowledgeEngineData";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export const KnowledgeWorkspaceView: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Selected Well State derived from URL search parameter
  const wellParam = searchParams.get("well") || "NHK-124";
  const [localWellId, setLocalWellId] = useState<string>(wellParam);

  const selectedWell = useMemo(() => {
    return SYNTHETIC_WELLS.find((w: Well) => w.id === localWellId) || SYNTHETIC_WELLS[0];
  }, [localWellId]);

  // Query and Search State
  const initialQuery =
    searchParams.get("q") ||
    (searchParams.get("topic")
      ? `What historical ${searchParams.get("topic")} problems occurred in offset wells?`
      : "Have drilling problems been reported around 3,000–3,200 m in nearby wells?");

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeAnswer, setActiveAnswer] = useState<KnowledgeAnswer | null>(DEFAULT_ANSWER);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);

  // Filters State
  const [filters, setFilters] = useState<KnowledgeFilterState>({
    wellFilter: "All Wells",
    depthRange: "3000-3300m",
    formationFilter: "All Formations",
    eventType: "All Events",
    sourceType: "All Sources",
  });

  // Modal State
  const [activeEvidenceModalItem, setActiveEvidenceModalItem] = useState<KnowledgeEvidenceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Execute Search Function
  const handleExecuteSearch = (queryToSearch: string) => {
    if (!queryToSearch.trim()) return;

    setSearchQuery(queryToSearch);
    setIsLoading(true);
    setLoadingStage(1);

    // Staged realistic RAG simulation stages
    setTimeout(() => setLoadingStage(2), 150);
    setTimeout(() => setLoadingStage(3), 350);
    setTimeout(() => setLoadingStage(4), 550);

    setTimeout(() => {
      const result = syntheticSearchKnowledge(queryToSearch, selectedWell.id, filters);
      setActiveAnswer(result);
      setIsLoading(false);
      setLoadingStage(0);
    }, 750);
  };

  const handleSelectWell = (well: Well) => {
    setLocalWellId(well.id);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("well", well.id);
      router.replace(`/knowledge?${params.toString()}`);
    });
  };

  const handleOpenSourceModal = (item: KnowledgeEvidenceItem) => {
    setActiveEvidenceModalItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveEvidenceModalItem(null);
  };

  const currentDepthM = selectedWell.depthM ? Math.round(selectedWell.depthM - 60) : 3180;
  const currentFormation = selectedWell.formation || "Jurassic T3";

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#142B3A] pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-5 space-y-3.5 sm:space-y-4">
        {/* 1. Page Header */}
        <KnowledgeHeader />

        {/* 2. Selected Well Context Bar */}
        <KnowledgeWellContextBar
          selectedWell={selectedWell}
          onSelectWell={handleSelectWell}
          currentDepthM={currentDepthM}
          activity="Drilling Ahead"
        />

        {/* 3. Question / Search Area with Suggested Investigations Chips */}
        <KnowledgeSearchArea
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onSubmit={handleExecuteSearch}
          isLoading={isLoading}
          filterState={filters}
          onFilterChange={setFilters}
        />

        {/* 4. Loading State with 5-Stage RAG Pipeline Steps */}
        {isLoading && (
          <div className="bg-[#FAF7F2] border-2 border-[#DDD2C0] rounded-xl p-5 text-center space-y-3 shadow-xs animate-in fade-in duration-150">
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full border-3 border-[#245463] border-t-transparent animate-spin flex items-center justify-center text-[#245463]" />
            </div>

            <div className="space-y-0.5">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#142B3A] font-mono">
                SYNTHESIZING HISTORICAL DRILLING EVIDENCE
              </h3>
              <p className="text-[11px] text-[#5A6572] font-mono">
                Querying PostgreSQL pgvector dense index + FTS lexical index...
              </p>
            </div>

            {/* 5-Stage Step Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 max-w-2xl mx-auto text-[10px] font-mono">
              <span
                className={`px-2 py-0.5 rounded border transition-colors ${
                  loadingStage >= 1
                    ? "bg-[#2F8068] text-white border-[#2F8068]"
                    : "bg-[#E4DDD0] text-[#6B7280] border-[#DDD2C0]"
                }`}
              >
                1. UNDERSTANDING QUERY
              </span>
              <span className="text-[#DDD2C0]">→</span>
              <span
                className={`px-2 py-0.5 rounded border transition-colors ${
                  loadingStage >= 2
                    ? "bg-[#2F8068] text-white border-[#2F8068]"
                    : "bg-[#E4DDD0] text-[#6B7280] border-[#DDD2C0]"
                }`}
              >
                2. SEARCHING HISTORICAL RECORDS
              </span>
              <span className="text-[#DDD2C0]">→</span>
              <span
                className={`px-2 py-0.5 rounded border transition-colors ${
                  loadingStage >= 3
                    ? "bg-[#2F8068] text-white border-[#2F8068]"
                    : "bg-[#E4DDD0] text-[#6B7280] border-[#DDD2C0]"
                }`}
              >
                3. MATCHING OFFSET WELLS
              </span>
              <span className="text-[#DDD2C0]">→</span>
              <span
                className={`px-2 py-0.5 rounded border transition-colors ${
                  loadingStage >= 4
                    ? "bg-[#2F8068] text-white border-[#2F8068]"
                    : "bg-[#E4DDD0] text-[#6B7280] border-[#DDD2C0]"
                }`}
              >
                4. RETRIEVING EVIDENCE
              </span>
            </div>
          </div>
        )}

        {/* 5. Answer Workspace (When Answer is Found) */}
        {!isLoading && activeAnswer && (
          <div className="space-y-3.5 sm:space-y-4">
            {/* Top 2-Column Split: Field Intelligence (Visual Hero ~68%) & Simplified Evidence Summary (~32%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-start">
              <div className="lg:col-span-8">
                <FieldIntelligenceAnswer
                  answer={activeAnswer}
                  onOpenEvidence={handleOpenSourceModal}
                  onFollowUpQuery={(q: string) => handleExecuteSearch(q)}
                  currentWellId={selectedWell.id}
                  currentDepthM={currentDepthM}
                  formation={currentFormation}
                />
              </div>

              <div className="lg:col-span-4">
                <EvidenceSummaryCard
                  answer={activeAnswer}
                />
              </div>
            </div>

            {/* HISTORICAL PATTERN MATCH — Directly below Field Intelligence */}
            <HistoricalPatternMatchCard
              well={selectedWell}
              currentDepth={currentDepthM}
              formation={currentFormation}
              historicalMatchesCount={activeAnswer.offsetWellsCount}
              depthMatch={activeAnswer.depthMatchLevel}
              formationMatch={activeAnswer.formationMatchLevel}
              patternDescription={activeAnswer.historicalPattern}
              topic={searchQuery}
            />

            {/* SUPPORTING EVIDENCE — Scannable Layout */}
            <SupportingEvidenceList
              evidenceItems={activeAnswer.evidenceItems}
              onViewSource={handleOpenSourceModal}
            />

            {/* WHAT WORKED IN PREVIOUS WELLS */}
            <HistoricalMitigationCard
              historicalEvent={activeAnswer.historicalPattern}
              historicalResponse={activeAnswer.historicalResponse}
              usedInWellsCount={activeAnswer.mitigationUsedInWells}
              evidenceRecordsCount={activeAnswer.evidenceRecordsCount}
              historicalOutcome={activeAnswer.historicalOutcome}
              topSourceRef="NHK-119 • DDR • 3,120 m"
            />

            {/* RELEVANT OFFSET WELL EXPERIENCE */}
            <OffsetExperienceTable />

            {/* HOW THIS ANSWER WAS BUILT (Compact Expandable Pipeline) */}
            <DocumentIntelligencePipeline />

            {/* INDEXED KNOWLEDGE REPOSITORY */}
            <KnowledgeRepositoryBrowser
              onViewDocument={handleOpenSourceModal}
            />

            {/* RECENT INVESTIGATIONS (Compact Strip) */}
            <RecentInvestigations
              onSelectQuery={handleExecuteSearch}
            />
          </div>
        )}

        {/* 6. No-Result Error State */}
        {!isLoading && !activeAnswer && (
          <div className="bg-[#FAF7F2] border-2 border-[#DDD2C0] rounded-xl p-8 text-center space-y-3.5 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#D96B3B]/10 border border-[#D96B3B]/30 flex items-center justify-center mx-auto text-[#D96B3B]">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#142B3A] uppercase tracking-wide">
                NO STRONG HISTORICAL MATCH FOUND
              </h3>
              <p className="text-xs text-[#5A6572] max-w-md mx-auto">
                No sufficiently relevant evidence was found for this query in the current demonstration dataset.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <button
                onClick={() => handleExecuteSearch("Have drilling problems been reported around 3,000–3,200 m in nearby wells?")}
                className="px-4 py-2 rounded-lg bg-[#142B3A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#245463] transition-colors cursor-pointer"
              >
                RESET QUERY
              </button>
              <Link
                href="/nearby-wells"
                className="px-4 py-2 rounded-lg bg-white border border-[#DDD2C0] hover:border-[#245463] text-xs font-bold text-[#142B3A] transition-colors"
              >
                VIEW OFFSET WELLS
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Synthetic Disclaimer Footer */}
        <div className="text-center py-3 border-t border-[#DDD2C0]/60">
          <p className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider">
            SYNTHETIC DEMONSTRATION DATA — NOT VERIFIED OIL ASSET OR OPERATIONAL DATA
          </p>
        </div>
      </div>

      {/* Source Viewer Modal / Slide-in */}
      <SourceViewerModal
        item={activeEvidenceModalItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

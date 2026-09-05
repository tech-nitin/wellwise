"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileSpreadsheet,
  Compass,
  Layers,
  AlertTriangle,
  Shield,
  Calendar,
  Printer,
  ChevronRight,
  GitCompare,
  Sparkles,
  ShieldAlert,
  Info,
  Droplets,
  FileText,
  MapPin,
  CheckCircle2,
  Clock,
  Activity,
  Eye,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import { SYNTHETIC_WELLS, Well } from "@/components/dashboard/data/wells";
import {
  getWellStratigraphy,
  getWellCasingProgram,
  getWellNPTEvents,
  getWellMudWeightProfile,
  getWellDailyDrillingRecords,
  getWellNPTSummary,
  getWellEvidenceItems,
  enrichWellWithCalculations,
} from "@/components/wells/wellEngineeringData";
import { FormationDepth } from "@/components/wells/FormationDepth";
import { WellComparisonModal } from "@/components/wells/WellComparisonModal";
import { OffsetReportExportModal } from "@/components/wells/OffsetReportExportModal";
import { EvidenceDocumentModal } from "@/components/wells/EvidenceDocumentModal";
import { DossierTabId, EvidenceDocumentItem } from "@/components/wells/types";
import { cn } from "@/lib/utils";

interface WellDossierClientProps {
  wellId: string;
}

export function WellDossierClient({ wellId }: WellDossierClientProps) {
  const [activeTab, setActiveTab] = useState<DossierTabId>("overview");
  const [showExportModal, setShowExportModal] = useState(false);
  const [comparisonTarget, setComparisonTarget] = useState<Well | null>(null);
  const [viewingDocument, setViewingDocument] = useState<EvidenceDocumentItem | null>(null);

  // Find well by ID (case-insensitive)
  const well = SYNTHETIC_WELLS.find(
    (w) => w.id.toLowerCase() === wellId.toLowerCase()
  );

  // Graceful empty state
  if (!well) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-center font-sans select-none bg-[#F5F0E6]">
        <div className="h-16 w-16 rounded-3xl bg-[#DDD2C0]/40 border border-[#DDD2C0] flex items-center justify-center text-[#142B3A] mb-4">
          <Compass className="h-8 w-8 text-[#D96B3B]" />
        </div>
        <h2 className="text-xl font-bold font-mono text-[#0D1B24]">
          WELL NOT FOUND
        </h2>
        <p className="text-sm text-[#142B3A]/70 max-w-md mt-2 font-sans leading-relaxed">
          No engineering dossier is available for well identifier{" "}
          <strong className="text-[#D96B3B] font-mono">{wellId}</strong> in the current dataset.
        </p>
        <Link
          href="/nearby-wells"
          className="mt-6 px-5 py-2.5 rounded-2xl bg-[#142B3A] text-white font-mono text-xs font-bold hover:bg-[#245463] transition-colors inline-flex items-center gap-2 shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>BACK TO NEARBY WELLS</span>
        </Link>
      </div>
    );
  }

  // Engineering Data calculations
  const totalDepth = well.depthM || 3200;
  const currentDepth = Math.round(totalDepth - 60);
  const remainingDepth = Math.max(0, totalDepth - currentDepth);
  const depthPercentage = Math.min(100, Math.round((currentDepth / totalDepth) * 100));

  const stratigraphy = getWellStratigraphy(well);
  const casingProgram = getWellCasingProgram(well);
  const nptEvents = getWellNPTEvents(well);
  const nptSummary = getWellNPTSummary(well);
  const mudProfiles = getWellMudWeightProfile(well);
  const dailyRecords = getWellDailyDrillingRecords(well);
  const evidenceItems = getWellEvidenceItems(well);

  // Regional offset wells with dynamic Haversine distance relative to this well
  const regionalOffsets = SYNTHETIC_WELLS.filter(
    (w) => w.id !== well.id && (w.regionId === well.regionId || w.basin === well.basin)
  ).map((offset) => enrichWellWithCalculations(offset, well));

  const closestOffset = [...regionalOffsets].sort(
    (a, b) => a.calculatedDistanceKm - b.calculatedDistanceKm
  )[0];

  const bestMatchOffset = [...regionalOffsets].sort(
    (a, b) => (b.historicalMatch || 0) - (a.historicalMatch || 0)
  )[0];

  const highestRiskOffset = [...regionalOffsets].sort(
    (a, b) => (b.riskScore || 0) - (a.riskScore || 0)
  )[0];

  const targetStratum =
    stratigraphy.find((s) => s.isTargetZone) || stratigraphy[stratigraphy.length - 1];

  const formationTop = targetStratum?.topDepthM || Math.round(totalDepth * 0.88);
  const formationBase = targetStratum?.baseDepthM || totalDepth;
  const formationGrossThickness = Math.max(1, formationBase - formationTop);
  const penetratedInFormation = Math.max(0, currentDepth - formationTop);
  const formationProgressPct = Math.min(
    100,
    Math.max(5, Math.round((penetratedInFormation / formationGrossThickness) * 100))
  );

  // NPT Distribution calculations
  const totalNpt = nptSummary.totalNptHours || 32.5;

  const getStatusBadge = (status: Well["status"]) => {
    switch (status) {
      case "active":
        return "bg-[#2F8068]/15 text-[#2F8068] border-[#2F8068]/40";
      case "warning":
        return "bg-[#D96B3B]/20 text-[#A9533D] border-[#D96B3B]/50";
      case "critical":
        return "bg-[#843D35]/15 text-[#843D35] border-[#843D35]/40";
      case "historical":
        return "bg-[#245463]/15 text-[#245463] border-[#245463]/40";
      default:
        return "bg-[#2F8068]/15 text-[#2F8068] border-[#2F8068]/40";
    }
  };

  const getEarlyWarningLabel = () => {
    const score = well.riskScore ?? 72;
    if (score > 75) return { text: "CRITICAL", sub: "High historical offset hazard density", color: "text-[#843D35]" };
    if (score > 60) return { text: "WATCH", sub: "Elevated historical risk", color: "text-[#D96B3B]" };
    if (score > 40) return { text: "ADVISORY", sub: "Moderate offset variance noted", color: "text-[#245463]" };
    return { text: "NORMAL", sub: "Baseline operational conditions", color: "text-[#2F8068]" };
  };

  const warningLabel = getEarlyWarningLabel();

  // Drilling telemetry chart data
  const depthProgressionData = [
    { day: "27-Feb", depth: currentDepth - 330, planned: currentDepth - 340, rop: 18.2 },
    { day: "28-Feb", depth: currentDepth - 270, planned: currentDepth - 260, rop: 9.8 },
    { day: "01-Mar", depth: currentDepth - 195, planned: currentDepth - 180, rop: 15.0 },
    { day: "02-Mar", depth: currentDepth - 120, planned: currentDepth - 100, rop: 16.5 },
    { day: "03-Mar", depth: currentDepth - 55, planned: currentDepth - 40, rop: 12.4 },
    { day: "04-Mar", depth: currentDepth, planned: currentDepth, rop: 14.8 },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F5F0E6] text-[#0D1B24] font-sans pb-20">
      {/* 1. BREADCRUMB & QUIET ACTION BAR */}
      <nav
        aria-label="Breadcrumb and Toolbar"
        className="bg-[#FAF8F5]/90 backdrop-blur-xs border-b border-[#DDD2C0] sticky top-[65px] z-30 px-4 sm:px-8 py-2.5 print:hidden"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          {/* Breadcrumb links */}
          <div className="flex items-center gap-2 text-xs text-[#142B3A]/70 font-sans">
            <Link
              href="/nearby-wells"
              className="hover:text-[#D96B3B] transition-colors flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Nearby Wells</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-[#DDD2C0]" />
            <span className="text-[#142B3A]/80">Well Intelligence</span>
            <ChevronRight className="h-3 w-3 text-[#DDD2C0]" />
            <span className="font-mono font-bold text-[#0D1B24]">{well.id}</span>
          </div>

          {/* Quiet Secondary Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/nearby-wells"
              className="px-3 py-1.5 rounded-xl bg-white/80 border border-[#DDD2C0] hover:border-[#142B3A] text-xs font-sans font-semibold text-[#0D1B24] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#142B3A]/70" />
              <span className="hidden sm:inline">BACK TO NEARBY WELLS</span>
            </Link>

            <button
              onClick={() => setComparisonTarget(closestOffset || regionalOffsets[0] || well)}
              className="px-3 py-1.5 rounded-xl bg-white/80 border border-[#DDD2C0] hover:border-[#142B3A] text-xs font-sans font-semibold text-[#0D1B24] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <GitCompare className="h-3.5 w-3.5 text-[#D96B3B]" />
              <span>COMPARE OFFSETS</span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/80 border border-[#DDD2C0] hover:border-[#142B3A] text-xs font-sans font-semibold text-[#0D1B24] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-[#245463]" />
              <span>EXPORT SUMMARY</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-[#D96B3B] hover:bg-[#c45a2c] text-white font-sans text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>PRINT DOSSIER</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-8">
        {/* 2. WELL IDENTITY HEADER — EDITORIAL LAYOUT */}
        <section className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-mono font-black text-[#0D1B24] tracking-tight">
                  {well.id}
                </h1>
                <span
                  className={`text-xs font-mono font-bold uppercase px-3 py-1 rounded-full border flex items-center gap-1.5 ${getStatusBadge(
                    well.status
                  )}`}
                >
                  <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                  <span>{well.status === "active" ? "ACTIVE WELL" : well.status.toUpperCase()}</span>
                </span>
                <span className="text-xs font-mono text-[#142B3A]/70 bg-[#DDD2C0]/40 px-3 py-1 rounded-full font-semibold">
                  Block {well.leaseBlock || "OIL-NAH-04"}
                </span>
              </div>
              <p className="text-sm font-sans text-[#142B3A]/80 mt-1.5">
                {well.basin || "Upper Assam Basin"} &bull; {well.field || "Nahorkatiya Main"} &bull; {well.state}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#DDD2C0]/35 border border-[#DDD2C0] text-sm text-[#0D1B24]">
                <Zap className="h-4 w-4 text-[#D96B3B]" />
                <span className="font-sans font-medium">
                  Currently drilling at{" "}
                  <strong className="font-mono font-bold text-[#D96B3B]">{currentDepth.toLocaleString()} m</strong> in{" "}
                  <strong className="font-sans font-bold text-[#0D1B24]">{well.formation}</strong>
                </span>
              </div>
            </div>

            {/* 4 Important Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Total Depth */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] min-w-[125px]">
                <span className="text-[10px] uppercase font-bold text-[#142B3A]/60 font-mono tracking-wider block">
                  Total Depth
                </span>
                <span className="text-xl sm:text-2xl font-mono font-bold text-[#0D1B24] block mt-0.5">
                  {totalDepth.toLocaleString()} m
                </span>
                <span className="text-[11px] text-[#142B3A]/70 font-sans block mt-0.5">Planned TD</span>
              </div>

              {/* Remaining */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] min-w-[125px]">
                <span className="text-[10px] uppercase font-bold text-[#142B3A]/60 font-mono tracking-wider block">
                  Remaining
                </span>
                <span className="text-xl sm:text-2xl font-mono font-bold text-[#D96B3B] block mt-0.5">
                  {remainingDepth.toLocaleString()} m
                </span>
                <span className="text-[11px] text-[#142B3A]/70 font-sans block mt-0.5">To target TD</span>
              </div>

              {/* Early-Warning Status */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] min-w-[145px]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#142B3A]/60 font-mono tracking-wider block">
                    Early-Warning
                  </span>
                  <span className="text-[10px] font-mono text-[#843D35] bg-[#843D35]/10 px-1.5 py-0.2 rounded font-bold">
                    {well.riskScore ?? 72}/100
                  </span>
                </div>
                <span className={`text-xl sm:text-2xl font-mono font-extrabold block mt-0.5 ${warningLabel.color}`}>
                  {warningLabel.text}
                </span>
                <span className="text-[11px] text-[#142B3A]/75 font-sans block mt-0.5 truncate" title={warningLabel.sub}>
                  {warningLabel.sub}
                </span>
              </div>

              {/* Evidence Match */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] min-w-[135px]">
                <span className="text-[10px] uppercase font-bold text-[#142B3A]/60 font-mono tracking-wider block">
                  Evidence Match
                </span>
                <span className="text-xl sm:text-2xl font-mono font-bold text-[#245463] block mt-0.5">
                  {well.historicalMatch ?? 92}%
                </span>
                <span className="text-[11px] text-[#142B3A]/70 font-sans block mt-0.5">4 offset wells</span>
              </div>
            </div>
          </div>

          {/* Subtle Horizontal Depth Progress Indicator */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#142B3A]/80">
              <span className="font-bold text-[#0D1B24]">0 m (Surface Ground)</span>
              <span className="font-bold text-[#D96B3B] flex items-center gap-1.5">
                <span>Current Depth: <strong>{currentDepth.toLocaleString()} m</strong></span>
                <span className="text-[10px] bg-[#D96B3B]/15 px-2 py-0.5 rounded-full font-bold">
                  {depthPercentage}% Drilled
                </span>
              </span>
              <span className="font-bold text-[#0D1B24]">{totalDepth.toLocaleString()} m (TD)</span>
            </div>

            <div className="relative w-full h-3 bg-[#DDD2C0]/40 rounded-full overflow-hidden p-0.5 border border-[#DDD2C0]">
              <div
                className="h-full bg-linear-to-r from-[#245463] via-[#D96B3B] to-[#843D35] rounded-full transition-all duration-500"
                style={{ width: `${depthPercentage}%` }}
              />
            </div>
          </div>

          {/* 3. "AT A GLANCE" ENGINEERING SUMMARY STRIP */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#DDD2C0]/60">
              <span className="text-xs font-mono uppercase font-extrabold text-[#0D1B24] tracking-wider flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-[#D96B3B]" />
                <span>AT A GLANCE</span>
              </span>
              <span className="text-[10px] font-sans text-[#142B3A]/60">
                Rig allocation & concession specifications
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 text-xs font-sans">
              <div title="Start of drilling date">
                <span className="text-[10px] text-[#142B3A]/60 block font-mono font-bold uppercase">Spud Date</span>
                <strong className="text-[#0D1B24] font-mono block truncate">14 Jan 2025</strong>
              </div>
              <div title="Active drilling rig identifier">
                <span className="text-[10px] text-[#142B3A]/60 block font-mono font-bold uppercase">Rig</span>
                <strong className="text-[#0D1B24] font-mono block truncate">RIG-OIL-{well.id.slice(-3) || "124"}</strong>
              </div>
              <div title="MSL: Mean Sea Level ground elevation">
                <span className="text-[10px] text-[#142B3A]/60 block font-mono font-bold uppercase">Elevation (MSL)</span>
                <strong className="text-[#0D1B24] font-mono block truncate">112 m MSL</strong>
              </div>
              <div title="TD: Total Depth planned for wellbore">
                <span className="text-[10px] text-[#142B3A]/60 block font-mono font-bold uppercase">Total Depth (TD)</span>
                <strong className="text-[#0D1B24] font-mono block truncate">{totalDepth.toLocaleString()} m</strong>
              </div>
              <div title="Current measured depth (MD)">
                <span className="text-[10px] text-[#142B3A]/60 block font-mono font-bold uppercase">Current Depth</span>
                <strong className="text-[#D96B3B] font-mono block truncate">{currentDepth.toLocaleString()} m</strong>
              </div>
              <div title="Current active bit & hole section">
                <span className="text-[10px] text-[#142B3A]/60 block font-mono font-bold uppercase">Hole Section</span>
                <strong className="text-[#0D1B24] font-mono block truncate">{'8½"'}</strong>
              </div>
              <div title="Target geological formation">
                <span className="text-[10px] text-[#142B3A]/60 block font-mono font-bold uppercase">Formation</span>
                <strong className="text-[#0D1B24] font-sans block truncate" title={well.formation}>
                  {well.formation}
                </strong>
              </div>
              <div title="Field operating concessionaire">
                <span className="text-[10px] text-[#142B3A]/60 block font-mono font-bold uppercase">Operator</span>
                <strong className="text-[#0D1B24] font-sans block truncate">Oil India Limited</strong>
              </div>
            </div>
          </div>
        </section>

        {/* 4. TAB NAVIGATION — STICKY ON DESKTOP, SCROLLABLE ON MOBILE */}
        <div className="sticky top-[115px] z-20 bg-[#F5F0E6] pt-2 pb-1 border-b border-[#DDD2C0] flex items-center gap-2 overflow-x-auto scrollbar-none font-sans text-xs print:hidden">
          {[
            { id: "overview", label: "Overview", icon: Compass },
            { id: "geology", label: "Geological Tops", icon: Layers },
            { id: "hazards", label: "Hazards & Incidents", icon: AlertTriangle },
            { id: "casing", label: "Casing Program", icon: Shield },
            { id: "offsets", label: `Offset Proximity (${regionalOffsets.length})`, icon: MapPin },
            { id: "drilling", label: "Daily Drilling", icon: Calendar },
            { id: "evidence", label: "Evidence & Traceability", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DossierTabId)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-semibold transition-all cursor-pointer whitespace-nowrap",
                  isActive
                    ? "bg-[#FAF8F5] text-[#D96B3B] border border-[#DDD2C0] shadow-2xs font-bold"
                    : "text-[#142B3A]/70 hover:text-[#0D1B24] hover:bg-[#FAF8F5]/60"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-[#D96B3B]" : "text-[#142B3A]/60")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 5. TAB CONTENT PANELS */}

        {/* ==================================================================== */}
        {/* TAB 1: OVERVIEW — ASYMMETRIC 12-COLUMN WORKSPACE */}
        {/* ==================================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Section 4 & 5: Current Drilling Status + What Matters Now */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (8 cols): Current Drilling Horizon & What Matters Now */}
              <div className="lg:col-span-8 space-y-6">
                {/* 4. CURRENT DRILLING STATUS */}
                <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C0]">
                    <div>
                      <span className="text-xs font-mono uppercase font-bold text-[#A9533D] block">
                        ACTIVE DRILLING HORIZON
                      </span>
                      <h2 className="text-lg font-sans font-bold text-[#0D1B24]">
                        Current Drilling Position
                      </h2>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#2F8068] bg-[#2F8068]/10 px-2.5 py-1 rounded-full border border-[#2F8068]/30">
                      Penetrated {penetratedInFormation} m into pay zone
                    </span>
                  </div>

                  {/* Horizontal Formation Visualizer */}
                  <div className="p-4 rounded-2xl bg-white border border-[#DDD2C0] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#142B3A]/60 uppercase font-bold block">
                          Current Formation
                        </span>
                        <h3 className="text-lg font-sans font-extrabold text-[#D96B3B]">
                          {targetStratum?.name || well.formation}
                        </h3>
                      </div>
                      <div className="text-right font-mono text-xs">
                        <span className="text-[#142B3A]/70">Formation Top: <strong>{formationTop} m</strong></span>
                        <span className="text-[#142B3A]/70 block">Formation Base: <strong>{formationBase} m</strong></span>
                      </div>
                    </div>

                    {/* Progress Horizon Bar */}
                    <div className="space-y-1.5 pt-1 font-mono text-xs">
                      <div className="flex justify-between text-[11px] text-[#142B3A]/70">
                        <span>Top: {formationTop} m</span>
                        <span className="font-bold text-[#D96B3B]">
                          Current: {currentDepth} m ({formationProgressPct}% into formation)
                        </span>
                        <span>Base: {formationBase} m</span>
                      </div>

                      <div className="relative w-full h-4 bg-[#DDD2C0]/40 rounded-full overflow-hidden p-0.5 border border-[#DDD2C0]">
                        <div
                          className="h-full bg-linear-to-r from-[#245463] to-[#D96B3B] rounded-full transition-all duration-500"
                          style={{ width: `${formationProgressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Horizon Key Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
                    <div className="p-3 rounded-xl bg-white border border-[#DDD2C0]">
                      <span className="text-[10px] font-mono text-[#142B3A]/60 uppercase font-bold block">Top Depth</span>
                      <strong className="text-sm font-mono text-[#0D1B24]">{formationTop} m</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#DDD2C0]">
                      <span className="text-[10px] font-mono text-[#142B3A]/60 uppercase font-bold block">Base Depth</span>
                      <strong className="text-sm font-mono text-[#0D1B24]">{formationBase} m</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#DDD2C0]">
                      <span className="text-[10px] font-mono text-[#142B3A]/60 uppercase font-bold block">Gross Thickness</span>
                      <strong className="text-sm font-mono text-[#0D1B24]">{formationGrossThickness} m</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#DDD2C0]">
                      <span className="text-[10px] font-mono text-[#142B3A]/60 uppercase font-bold block">Penetrated</span>
                      <strong className="text-sm font-mono text-[#D96B3B]">{penetratedInFormation} m</strong>
                    </div>
                  </div>
                </div>

                {/* 5. "WHAT MATTERS NOW" — CORE INTELLIGENCE SECTION */}
                <div className="p-6 rounded-3xl bg-[#FAF8F5] border-2 border-[#D96B3B]/40 space-y-4 shadow-xs">
                  <div className="flex items-start justify-between flex-wrap gap-2 pb-2 border-b border-[#DDD2C0]">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-[#D96B3B]" />
                        <h2 className="text-lg font-sans font-extrabold text-[#0D1B24]">
                          WHAT MATTERS NOW
                        </h2>
                      </div>
                      <p className="text-xs text-[#142B3A]/80 font-sans mt-0.5">
                        Historical evidence that deserves attention at the current depth ({currentDepth} m MD)
                      </p>
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#A9533D] bg-[#D96B3B]/15 px-2.5 py-1 rounded-full">
                      Early-Warning Indicators
                    </span>
                  </div>

                  {/* 3 Intelligence Insights */}
                  <div className="space-y-3 font-sans">
                    {/* Insight 1: Lost Circulation */}
                    <div className="p-4 rounded-2xl bg-white border-l-4 border-l-[#843D35] border border-[#DDD2C0] space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#843D35]/15 text-[#843D35] border border-[#843D35]/30">
                            HIGH ATTENTION
                          </span>
                          <h4 className="font-bold text-sm text-[#0D1B24]">
                            Lost Circulation
                          </h4>
                        </div>
                        <span className="text-xs font-mono text-[#142B3A]/70">
                          Evidence: <strong>4 offset wells &bull; 7 historical records</strong>
                        </span>
                      </div>

                      <p className="text-xs text-[#142B3A]/85 leading-relaxed">
                        Offset wells recorded circulation losses around 3,100–3,200 m. The current well is at{" "}
                        <strong className="font-mono text-[#0D1B24]">{currentDepth} m</strong> and is entering the same historical interval.
                      </p>

                      <div className="p-2.5 rounded-xl bg-[#DDD2C0]/25 text-xs text-[#0D1B24] flex items-center justify-between flex-wrap gap-2">
                        <span><strong>Suggested action:</strong> Review returns and LCM response plan.</span>
                        <button
                          onClick={() => setActiveTab("evidence")}
                          className="text-[#D96B3B] font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Inspect 7 records</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Insight 2: Torque / Drag */}
                    <div className="p-4 rounded-2xl bg-white border-l-4 border-l-[#D96B3B] border border-[#DDD2C0] space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#D96B3B]/15 text-[#A9533D] border border-[#D96B3B]/30">
                            WATCH
                          </span>
                          <h4 className="font-bold text-sm text-[#0D1B24]">
                            Torque / Drag
                          </h4>
                        </div>
                        <span className="text-xs font-mono text-[#142B3A]/70">
                          Evidence: <strong>3 offset wells</strong>
                        </span>
                      </div>

                      <p className="text-xs text-[#142B3A]/85 leading-relaxed">
                        Historical torque spikes were recorded between 3,050–3,200 m while drilling through the sandstone interval.
                      </p>

                      <div className="p-2.5 rounded-xl bg-[#DDD2C0]/25 text-xs text-[#0D1B24] flex items-center justify-between flex-wrap gap-2">
                        <span><strong>Suggested action:</strong> Monitor torque trend and review RPM/WOB response.</span>
                        <button
                          onClick={() => setActiveTab("drilling")}
                          className="text-[#D96B3B] font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>View torque log</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Insight 3: Mud Weight */}
                    <div className="p-4 rounded-2xl bg-white border-l-4 border-l-[#245463] border border-[#DDD2C0] space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#245463]/15 text-[#245463] border border-[#245463]/30">
                            REVIEW
                          </span>
                          <h4 className="font-bold text-sm text-[#0D1B24]">
                            Mud Weight Envelope
                          </h4>
                        </div>
                        <span className="text-xs font-mono text-[#142B3A]/70">
                          Evidence: <strong>Offset baseline 10.8 ppg vs Plan 11.2 ppg</strong>
                        </span>
                      </div>

                      <p className="text-xs text-[#142B3A]/85 leading-relaxed">
                        Planned mud weight is above the historical offset baseline. Review ECD surge pressure assumptions on connections.
                      </p>

                      <div className="p-2.5 rounded-xl bg-[#DDD2C0]/25 text-xs text-[#0D1B24]">
                        <strong>Suggested action:</strong> Review pressure window assumptions and trip tank volume gauges.
                      </div>
                    </div>
                  </div>

                  {/* WHY IS THIS FLAGGED? EXPLAINABLE TRANSPARENCY BOX */}
                  <div className="p-4 rounded-2xl bg-[#DDD2C0]/35 border border-[#DDD2C0] space-y-1.5 font-sans text-xs text-[#142B3A]">
                    <div className="flex items-center gap-1.5 font-bold text-[#0D1B24]">
                      <Info className="h-4 w-4 text-[#D96B3B]" />
                      <span>WHY IS THIS FLAGGED?</span>
                    </div>
                    <p className="leading-relaxed text-[#142B3A]/90">
                      3 nearby offset wells ({closestOffset?.id || "NHK-119"}, {bestMatchOffset?.id || "NHK-128"}, {highestRiskOffset?.id || "NHK-105"}) reported circulation losses between 3,080 m and 3,220 m. The current depth is <strong>{currentDepth} m</strong>.
                    </p>
                    <p className="text-[11px] text-[#142B3A]/70 pt-1 font-mono">
                      Early-Warning Risk Indicators are pattern-based historical correlations, not validated probabilities.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols): Compact Well & Location + Proportional Column */}
              <div className="lg:col-span-4 space-y-6">
                {/* 7. COMPACT WELL & LOCATION INFORMATION BLOCK */}
                <div className="p-5 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C0]">
                    <h3 className="font-mono font-bold text-xs text-[#0D1B24] uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="h-4 w-4 text-[#D96B3B]" />
                      <span>WELL & LOCATION SPECIFICATIONS</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-[#A9533D] font-bold uppercase block">Well Details</span>
                      <div>
                        <span className="text-[10px] text-[#142B3A]/60 block">Identifier</span>
                        <strong className="text-[#0D1B24] font-mono">{well.id}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#142B3A]/60 block">Operator</span>
                        <strong className="text-[#0D1B24]">Oil India Limited</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#142B3A]/60 block">Field / Sector</span>
                        <strong className="text-[#0D1B24]">{well.field || "Nahorkatiya"}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#142B3A]/60 block">Basin</span>
                        <strong className="text-[#0D1B24]">{well.basin || "Upper Assam"}</strong>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-[#A9533D] font-bold uppercase block">Location</span>
                      <div>
                        <span className="text-[10px] text-[#142B3A]/60 block">Latitude</span>
                        <strong className="text-[#0D1B24] font-mono">{well.latitude.toFixed(4)}° N</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#142B3A]/60 block">Longitude</span>
                        <strong className="text-[#0D1B24] font-mono">{well.longitude.toFixed(4)}° E</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#142B3A]/60 block">Elevation</span>
                        <strong className="text-[#0D1B24] font-mono">112.4 m MSL</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#142B3A]/60 block">Lease Block</span>
                        <strong className="text-[#0D1B24] font-mono">{well.leaseBlock || "OIL-NAH-04"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-[10px] text-[#142B3A]/60 font-sans border-t border-[#DDD2C0]/50 flex items-center gap-1.5">
                    <Info className="h-3 w-3 text-[#D96B3B] shrink-0" />
                    <span>Synthetic demo coordinates — structured for SIH26121 GIS evaluation.</span>
                  </div>
                </div>

                {/* Vertical Stratigraphic Column Thumbnail */}
                <FormationDepth well={well} currentDepth={currentDepth} />

                {/* 10. NPT VISUAL DISTRIBUTION */}
                <div className="p-5 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C0]">
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase text-[#0D1B24] flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-[#843D35]" />
                        <span>NON-PRODUCTIVE TIME (NPT)</span>
                      </h3>
                      <span className="text-[11px] text-[#142B3A]/70 font-sans">
                        Operational delay breakdown
                      </span>
                    </div>
                    <span className="text-base font-mono font-bold text-[#843D35]">
                      {totalNpt} hr total
                    </span>
                  </div>

                  {/* Horizontal Distribution Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#DDD2C0]/40 border border-[#DDD2C0]">
                      <div className="bg-[#843D35] h-full" style={{ width: "55%" }} title="Lost circulation: 18.0 hr (55%)" />
                      <div className="bg-[#D96B3B] h-full" style={{ width: "26%" }} title="Mud adjustment: 8.5 hr (26%)" />
                      <div className="bg-[#245463] h-full" style={{ width: "19%" }} title="Torque / drag: 6.0 hr (19%)" />
                    </div>

                    <div className="space-y-1 text-xs font-sans">
                      <div className="flex justify-between items-center text-xs">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-[#843D35]" />
                          <span>Lost circulation</span>
                        </span>
                        <strong className="font-mono">18.0 hr (55%)</strong>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-[#D96B3B]" />
                          <span>Mud adjustment</span>
                        </span>
                        <strong className="font-mono">8.5 hr (26%)</strong>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-[#245463]" />
                          <span>Torque / drag</span>
                        </span>
                        <strong className="font-mono">6.0 hr (19%)</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#DDD2C0]/50 text-[11px] text-[#142B3A]/75 font-sans">
                    3 incidents &bull; Longest event: <strong>18 hr</strong> &bull; Primary: <strong>Lost circulation</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: GEOLOGICAL TOPS */}
        {/* ==================================================================== */}
        {activeTab === "geology" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Proportional Depth Tree (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-4 font-sans">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C0]">
                    <h3 className="text-sm font-bold text-[#0D1B24] uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-[#D96B3B]" />
                      <span>DEPTH-COMMUNICATING SUCCESSION</span>
                    </h3>
                  </div>

                  {/* Geological Tree Hierarchy */}
                  <div className="space-y-3 font-mono text-xs text-[#0D1B24]">
                    <div className="p-2.5 rounded-xl bg-[#DDD2C0]/25 flex items-center justify-between">
                      <span className="font-bold flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#142B3A]" />
                        Surface
                      </span>
                      <span>0 m</span>
                    </div>

                    <div className="pl-4 border-l-2 border-[#DDD2C0] space-y-3">
                      {stratigraphy.map((st, i) => {
                        const isCurrent =
                          currentDepth >= st.topDepthM && currentDepth <= st.baseDepthM;

                        return (
                          <div
                            key={i}
                            className={cn(
                              "p-3 rounded-2xl border transition-all",
                              isCurrent
                                ? "bg-[#D96B3B]/10 border-[#D96B3B] shadow-2xs"
                                : "bg-white border-[#DDD2C0]"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm font-sans text-[#0D1B24]">{st.name}</span>
                              <span className="font-mono text-xs text-[#142B3A]/70">
                                {st.topDepthM.toLocaleString()}–{st.baseDepthM.toLocaleString()} m
                              </span>
                            </div>
                            <p className="text-xs font-sans text-[#142B3A]/75 mt-1">{st.lithology}</p>

                            {isCurrent && (
                              <div className="mt-2 pt-2 border-t border-[#D96B3B]/30 flex items-center justify-between text-xs text-[#D96B3B] font-bold">
                                <span className="flex items-center gap-1">
                                  <span>▲ Current Position</span>
                                </span>
                                <span>{currentDepth.toLocaleString()} m MD</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Correlation Panel & Table (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Correlation Panel against Best Match */}
                <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C0]">
                    <div>
                      <h3 className="text-sm font-bold text-[#0D1B24] uppercase tracking-wider font-mono">
                        STRATIGRAPHIC CORRELATION: {well.id} vs {closestOffset?.id || "NHK-119"}
                      </h3>
                      <span className="text-xs text-[#142B3A]/70 font-sans">
                        Structural dip and vertical thickness delta (&Delta;Z)
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#2F8068] bg-[#2F8068]/10 px-2.5 py-1 rounded-full">
                      Offset Distance: {closestOffset?.calculatedDistanceKm.toFixed(2) || "2.40"} km
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-sans text-xs">
                    <div className="p-3.5 rounded-2xl bg-white border border-[#DDD2C0]">
                      <span className="text-[10px] font-mono text-[#142B3A]/60 uppercase font-bold block">
                        Formation Top Correlation
                      </span>
                      <div className="mt-1 flex justify-between font-mono text-xs">
                        <span>Target: <strong>{formationTop} m</strong></span>
                        <span>Offset: <strong>{Math.round(formationTop * 0.994)} m</strong></span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#A9533D] block mt-1">
                        &Delta;Z: +16 m (Dipping)
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-[#DDD2C0]">
                      <span className="text-[10px] font-mono text-[#142B3A]/60 uppercase font-bold block">
                        Formation Base Correlation
                      </span>
                      <div className="mt-1 flex justify-between font-mono text-xs">
                        <span>Target: <strong>{formationBase} m</strong></span>
                        <span>Offset: <strong>{Math.round(formationBase * 0.992)} m</strong></span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#A9533D] block mt-1">
                        &Delta;Z: +25 m (Dipping)
                      </span>
                    </div>
                  </div>

                  {/* Tops Correlation Table */}
                  <div className="border border-[#DDD2C0] rounded-2xl overflow-hidden shadow-2xs font-sans text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#EFE9DC] border-b border-[#DDD2C0] text-[10px] uppercase font-bold font-mono text-[#142B3A]">
                        <tr>
                          <th className="py-2.5 px-3">Formation</th>
                          <th className="py-2.5 px-3">Target ({well.id})</th>
                          <th className="py-2.5 px-3">Offset ({closestOffset?.id || "NHK-119"})</th>
                          <th className="py-2.5 px-3">&Delta;Z</th>
                          <th className="py-2.5 px-3">Correlation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DDD2C0] font-mono text-xs">
                        {stratigraphy.map((st, i) => {
                          const offsetTop = Math.round(st.topDepthM * 0.985);
                          const delta = offsetTop - st.topDepthM;
                          return (
                            <tr key={i} className="hover:bg-[#DDD2C0]/20">
                              <td className="py-2.5 px-3 font-sans font-bold text-[#0D1B24]">{st.name}</td>
                              <td className="py-2.5 px-3">{st.topDepthM} m</td>
                              <td className="py-2.5 px-3">{offsetTop} m</td>
                              <td className="py-2.5 px-3 font-bold">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] ${
                                    delta < 0 ? "bg-[#245463]/15 text-[#245463]" : "bg-[#A9533D]/15 text-[#A9533D]"
                                  }`}
                                >
                                  {delta < 0 ? `${delta} m` : `+${delta} m`}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-sans font-bold text-[#2F8068]">94% Match</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: HAZARDS & INCIDENTS — VERTICAL DEPTH TIMELINE */}
        {/* ==================================================================== */}
        {activeTab === "hazards" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-6 font-sans">
              <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C0]">
                <div>
                  <h3 className="text-sm font-bold text-[#0D1B24] uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-[#843D35]" />
                    <span>DEPTH-BASED OPERATIONAL HAZARDS TIMELINE</span>
                  </h3>
                  <p className="text-xs text-[#142B3A]/70 mt-0.5">
                    Historical drilling anomalies mapped against wellbore depth trajectory
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#843D35] bg-[#843D35]/10 px-2.5 py-1 rounded-full">
                  {nptEvents.length} Recorded Anomaly Events
                </span>
              </div>

              {/* Vertical Depth Timeline */}
              <div className="relative pl-6 border-l-2 border-[#DDD2C0] space-y-6">
                {nptEvents.map((ev, idx) => (
                  <div key={idx} className="relative space-y-2">
                    {/* Depth Pin Marker on Timeline */}
                    <div className="absolute -left-[31px] top-1 h-5 w-5 rounded-full bg-[#FAF8F5] border-2 border-[#843D35] flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-[#843D35]" />
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-[#DDD2C0] space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#0D1B24]">{ev.depthM.toLocaleString()} m MD</span>
                          <span className="text-[#DDD2C0]">&bull;</span>
                          <span className="font-bold text-sm text-[#0D1B24]">{ev.event}</span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#843D35]/15 text-[#843D35]">
                            {ev.category}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#D96B3B] bg-[#D96B3B]/10 px-2 py-0.5 rounded">
                          {ev.durationHours} hr NPT logged
                        </span>
                      </div>

                      <p className="text-xs text-[#142B3A]/85 leading-relaxed">{ev.description}</p>

                      <div className="p-3 rounded-xl bg-[#DDD2C0]/25 text-xs flex items-center justify-between flex-wrap gap-2">
                        <span><strong>Historical response:</strong> {ev.mitigation}</span>
                        <span className="text-[10px] font-mono text-[#142B3A]/70">
                          Source: DDR-{well.id.slice(-3) || "119"} &bull; {ev.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: CASING PROGRAM */}
        {/* ==================================================================== */}
        {activeTab === "casing" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-4 font-sans text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C0]">
                <div>
                  <h3 className="text-sm font-bold text-[#0D1B24] uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-[#D96B3B]" />
                    <span>WELLBORE CASING ARCHITECTURE & PRESSURE INTEGRITY</span>
                  </h3>
                  <span className="text-xs text-[#142B3A]/70">API Spec 5CT compliant mechanical string specs</span>
                </div>
              </div>

              <div className="border border-[#DDD2C0] rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#EFE9DC] border-b border-[#DDD2C0] text-[10px] uppercase font-bold font-mono text-[#142B3A]">
                    <tr>
                      <th className="py-3 px-4">String Component</th>
                      <th className="py-3 px-3">Hole Size</th>
                      <th className="py-3 px-3">Casing OD</th>
                      <th className="py-3 px-3">Shoe Depth (MD)</th>
                      <th className="py-3 px-3">Weight & Grade</th>
                      <th className="py-3 px-3">Cement Top</th>
                      <th className="py-3 px-4 text-right">Test Pressure</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD2C0] font-mono text-xs">
                    {casingProgram.map((cs, i) => {
                      const holeSize =
                        cs.type === "Conductor"
                          ? '26"'
                          : cs.type === "Surface"
                          ? '17½"'
                          : cs.type === "Intermediate"
                          ? '12¼"'
                          : '8½"';

                      return (
                        <tr key={i} className="hover:bg-[#DDD2C0]/20 font-sans">
                          <td className="py-3 px-4 font-bold text-[#0D1B24]">{cs.type} Casing</td>
                          <td className="py-3 px-3 font-mono">{holeSize}</td>
                          <td className="py-3 px-3 font-mono font-bold text-[#D96B3B]">{cs.outerDiameterInch}</td>
                          <td className="py-3 px-3 font-mono">{cs.settingDepthMD.toLocaleString()} m</td>
                          <td className="py-3 px-3 font-mono">{cs.weightLbPerFt}# {cs.grade}</td>
                          <td className="py-3 px-3 font-mono text-[#2F8068] font-bold">
                            {cs.cementTopM === 0 ? "Surface" : `${cs.cementTopM} m`}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#0D1B24]">
                            {cs.testPressurePsi?.toLocaleString()} psi
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: OFFSET PROXIMITY */}
        {/* ==================================================================== */}
        {activeTab === "offsets" && (
          <div className="space-y-6 font-sans">
            {/* 3 Highlighted Offset Wells */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-1">
                <span className="text-[10px] font-mono text-[#142B3A]/60 uppercase font-bold block">CLOSEST OFFSET</span>
                <strong className="text-xl font-mono text-[#D96B3B] block">{closestOffset?.id || "None"}</strong>
                <span className="text-xs text-[#142B3A]/80 font-sans block">
                  {closestOffset?.calculatedDistanceKm.toFixed(2)} km away &bull; {closestOffset?.bearingFormatted}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-1">
                <span className="text-[10px] font-mono text-[#142B3A]/60 uppercase font-bold block">BEST HISTORICAL MATCH</span>
                <strong className="text-xl font-mono text-[#245463] block">{bestMatchOffset?.id || "None"}</strong>
                <span className="text-xs text-[#142B3A]/80 font-sans block">
                  {bestMatchOffset?.historicalMatch}% evidence match &bull; Lithological analog
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-1">
                <span className="text-[10px] font-mono text-[#142B3A]/60 uppercase font-bold block">HIGHEST RISK HISTORY</span>
                <strong className="text-xl font-mono text-[#843D35] block">{highestRiskOffset?.id || "None"}</strong>
                <span className="text-xs text-[#142B3A]/80 font-sans block">
                  Risk Score: {highestRiskOffset?.riskScore}/100 &bull; 3 major incidents logged
                </span>
              </div>
            </div>

            {/* Offset Wells Table */}
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-4">
              <h3 className="text-sm font-bold text-[#0D1B24] uppercase tracking-wider font-mono">
                REGIONAL OFFSET WELLS INVENTORY
              </h3>

              <div className="border border-[#DDD2C0] rounded-2xl overflow-hidden shadow-2xs text-xs font-sans">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#EFE9DC] border-b border-[#DDD2C0] text-[10px] uppercase font-bold font-mono text-[#142B3A]">
                    <tr>
                      <th className="py-3 px-4">Well</th>
                      <th className="py-3 px-3">Distance</th>
                      <th className="py-3 px-3">Formation Match</th>
                      <th className="py-3 px-3">Incidents</th>
                      <th className="py-3 px-3">NPT</th>
                      <th className="py-3 px-3">Risk Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD2C0]">
                    {regionalOffsets.map((off) => (
                      <tr key={off.id} className="hover:bg-[#DDD2C0]/20">
                        <td className="py-3 px-4">
                          <strong className="font-mono text-sm text-[#0D1B24] block">{off.id}</strong>
                          <span className="text-[11px] text-[#142B3A]/60">{off.field}</span>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <strong className="text-[#D96B3B]">{off.calculatedDistanceKm.toFixed(2)} km</strong>
                          <span className="text-[10px] text-[#142B3A]/70 block">{off.bearingFormatted}</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-[#245463]">
                          {off.historicalMatch ?? 88}%
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {off.events?.length || 0} events
                        </td>
                        <td className="py-3 px-3 font-mono text-[#843D35] font-bold">
                          {off.nptHistory?.reduce((acc, e) => acc + (e.durationHours || 0), 0) || (off.events?.length || 1) * 12} hr
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                              (off.riskScore || 0) > 70
                                ? "bg-[#843D35]/15 text-[#843D35]"
                                : "bg-[#2F8068]/15 text-[#2F8068]"
                            }`}
                          >
                            {off.riskScore ?? 45}/100
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 font-sans">
                            <Link
                              href="/nearby-wells"
                              title="Locate on Map"
                              className="px-2.5 py-1 rounded-lg bg-white border border-[#DDD2C0] hover:border-[#142B3A] text-xs font-semibold text-[#142B3A]"
                            >
                              LOCATE
                            </Link>
                            <button
                              onClick={() => setComparisonTarget(off)}
                              className="px-2.5 py-1 rounded-lg bg-[#D96B3B] text-white hover:bg-[#c45a2c] text-xs font-semibold cursor-pointer"
                            >
                              COMPARE
                            </button>
                            <Link
                              href={`/wells/${off.id}`}
                              className="px-2.5 py-1 rounded-lg bg-[#142B3A] text-white hover:bg-[#245463] text-xs font-semibold"
                            >
                              OPEN DOSSIER
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 6: DAILY DRILLING — VISUAL ANALYTICS */}
        {/* ==================================================================== */}
        {activeTab === "drilling" && (
          <div className="space-y-6 font-sans">
            {/* Depth Progression Chart */}
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C0]">
                <div>
                  <h3 className="text-sm font-bold text-[#0D1B24] uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-[#D96B3B]" />
                    <span>DEPTH PROGRESSION (MD vs DATE)</span>
                  </h3>
                  <span className="text-xs text-[#142B3A]/70">Planned vs Actual borehole penetration trajectory</span>
                </div>
                <span className="text-[10px] font-mono text-[#142B3A]/60 font-bold bg-[#DDD2C0]/40 px-2 py-0.5 rounded">
                  Synthetic demo drilling telemetry
                </span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={depthProgressionData}>
                    <defs>
                      <linearGradient id="depthGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D96B3B" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#D96B3B" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DDD2C0" opacity={0.6} />
                    <XAxis dataKey="day" stroke="#142B3A" fontSize={11} fontFamily="monospace" />
                    <YAxis
                      reversed
                      domain={["dataMin - 100", "dataMax + 50"]}
                      stroke="#142B3A"
                      fontSize={11}
                      fontFamily="monospace"
                      unit=" m"
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#FAF8F5",
                        borderColor: "#DDD2C0",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontFamily: "monospace",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="depth"
                      stroke="#D96B3B"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#depthGradient)"
                      name="Actual Depth (m)"
                    />
                    <Line
                      type="monotone"
                      dataKey="planned"
                      stroke="#245463"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      dot={false}
                      name="Planned Trajectory (m)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Drilling Performance Telemetry Cards */}
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-4">
              <h3 className="text-sm font-bold text-[#0D1B24] uppercase tracking-wider font-mono">
                DRILLING PERFORMANCE METRICS
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-[#DDD2C0]">
                  <span className="text-[10px] font-mono text-[#142B3A]/60 uppercase font-bold block">ROP</span>
                  <strong className="text-xl font-mono text-[#D96B3B] block">14.8 m/h</strong>
                  <span className="text-[11px] text-[#142B3A]/70">Rate of Penetration</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#DDD2C0]">
                  <span className="text-[10px] font-mono text-[#142B3A]/60 uppercase font-bold block">WOB</span>
                  <strong className="text-xl font-mono text-[#0D1B24] block">23.5 klbf</strong>
                  <span className="text-[11px] text-[#142B3A]/70">Weight on Bit</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#DDD2C0]">
                  <span className="text-[10px] font-mono text-[#142B3A]/60 uppercase font-bold block">RPM</span>
                  <strong className="text-xl font-mono text-[#0D1B24] block">105</strong>
                  <span className="text-[11px] text-[#142B3A]/70">Rotary Speed</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#DDD2C0]">
                  <span className="text-[10px] font-mono text-[#142B3A]/60 uppercase font-bold block">Torque</span>
                  <strong className="text-xl font-mono text-[#D96B3B] block">8.9 kft-lbf</strong>
                  <span className="text-[11px] text-[#142B3A]/70">Surface Torque</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#DDD2C0]">
                  <span className="text-[10px] font-mono text-[#142B3A]/60 uppercase font-bold block">SPP</span>
                  <strong className="text-xl font-mono text-[#245463] block">2,850 psi</strong>
                  <span className="text-[11px] text-[#142B3A]/70">Standpipe Pressure</span>
                </div>
              </div>

              {/* DDR Table */}
              <div className="border border-[#DDD2C0] rounded-2xl overflow-hidden shadow-2xs text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#EFE9DC] border-b border-[#DDD2C0] text-[10px] uppercase font-bold font-mono text-[#142B3A]">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Depth (MD)</th>
                      <th className="py-2.5 px-3">ROP (m/h)</th>
                      <th className="py-2.5 px-3">WOB (klbf)</th>
                      <th className="py-2.5 px-3">RPM</th>
                      <th className="py-2.5 px-3">Torque</th>
                      <th className="py-2.5 px-3">Mud Wt</th>
                      <th className="py-2.5 px-3">NPT</th>
                      <th className="py-2.5 px-4">Activity Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD2C0] font-mono">
                    {dailyRecords.map((dr, idx) => (
                      <tr key={idx} className="hover:bg-[#DDD2C0]/20">
                        <td className="py-2 px-3 font-bold">{dr.date}</td>
                        <td className="py-2 px-3 text-[#D96B3B] font-bold">{dr.depthM.toLocaleString()} m</td>
                        <td className="py-2 px-3">{dr.ropMh}</td>
                        <td className="py-2 px-3">{dr.wobKlbf}</td>
                        <td className="py-2 px-3">{dr.rpm}</td>
                        <td className="py-2 px-3">{dr.torqueKftLbf}</td>
                        <td className="py-2 px-3 text-[#2F8068] font-bold">{dr.mudWeightPpg} ppg</td>
                        <td className="py-2 px-3 font-bold text-[#843D35]">{dr.nptHours > 0 ? `${dr.nptHours}h` : "—"}</td>
                        <td className="py-2 px-4 font-sans text-xs text-[#142B3A]/80 truncate max-w-[240px]">
                          {dr.activitySummary}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mud Weight vs Depth Window */}
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-3">
              <h3 className="text-sm font-bold text-[#0D1B24] uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-[#DDD2C0]">
                <Droplets className="h-4 w-4 text-[#2F8068]" />
                <span>MUD WEIGHT vs DEPTH (HYDRAULIC OPERATING WINDOW)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white border border-[#DDD2C0] space-y-2">
                  <span className="font-bold text-[#2F8068] uppercase block font-mono">
                    Planned Well Hydraulic Program ({well.id})
                  </span>
                  {mudProfiles.map((mp, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded-xl bg-[#DDD2C0]/20 font-mono">
                      <span>{mp.fromDepthM}–{mp.toDepthM} m</span>
                      <strong className="text-[#2F8068]">{mp.mudWeightPpg} ppg</strong>
                      <span className="text-[10px] text-[#142B3A]/60">ECD: {mp.ecdEstimatedPpg} ppg</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#DDD2C0] space-y-2">
                  <span className="font-bold text-[#D96B3B] uppercase block font-mono">
                    Historical Offset Benchmark ({closestOffset?.id || "NHK-119"})
                  </span>
                  <div className="p-2 rounded-xl bg-[#DDD2C0]/20 font-mono flex justify-between">
                    <span>0–850 m (Surface)</span>
                    <strong className="text-[#D96B3B]">9.2 ppg</strong>
                    <span className="text-[10px] text-[#142B3A]/60">Spud Mud</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#DDD2C0]/20 font-mono flex justify-between">
                    <span>850–2,420 m (Intermediate)</span>
                    <strong className="text-[#D96B3B]">10.4 ppg</strong>
                    <span className="text-[10px] text-[#142B3A]/60">PHPA Polymer</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#DDD2C0]/20 font-mono flex justify-between">
                    <span>2,420–3,240 m (Pay Zone)</span>
                    <strong className="text-[#843D35]">11.8 ppg</strong>
                    <span className="text-[10px] text-[#142B3A]/60">Elevated ECD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 7: EVIDENCE & TRACEABILITY */}
        {/* ==================================================================== */}
        {activeTab === "evidence" && (
          <div className="space-y-6 font-sans">
            {/* WHY SHOULD I TRUST THIS? */}
            <div className="p-6 rounded-3xl bg-[#142B3A] text-white space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#D96B3B]" />
                  <h3 className="font-mono font-bold text-sm text-[#D96B3B] tracking-wider uppercase">
                    WHY SHOULD I TRUST THIS?
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold bg-[#D96B3B] text-white px-3 py-1 rounded-full">
                  {well.historicalMatch ?? 92}% Evidence Match
                </span>
              </div>

              <p className="text-sm text-white/90 leading-relaxed font-sans">
                Three nearby historical offset wells show consistent drilling anomalies around the current formation interval.
                The strongest recurring pattern is lost circulation between approximately 3,100–3,180 m, verified by OCR-indexed Daily Drilling Reports from {closestOffset?.id || "NHK-119"}.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-white/80">
                <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                  <strong className="text-base text-white block">4 Supporting Wells</strong>
                  <span className="text-[11px] text-white/60">Within 5 km radius</span>
                </div>
                <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                  <strong className="text-base text-white block">7 Historical Records</strong>
                  <span className="text-[11px] text-white/60">DDRs & Mud Recaps</span>
                </div>
                <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                  <strong className="text-base text-white block">3 Event Categories</strong>
                  <span className="text-[11px] text-white/60">Loss, Torque, Hydraulic</span>
                </div>
              </div>
            </div>

            {/* Traceable Document Items List */}
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-4">
              <h3 className="text-sm font-bold text-[#0D1B24] uppercase tracking-wider font-mono">
                SUPPORTING ARCHIVAL DOCUMENTS & EVIDENCE CITATIONS
              </h3>

              <div className="space-y-4">
                {evidenceItems.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-5 rounded-2xl bg-white border border-[#DDD2C0] space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#142B3A] text-white uppercase">
                          {doc.sourceType}
                        </span>
                        <strong className="text-sm text-[#0D1B24] font-mono">{doc.documentTitle}</strong>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#2F8068] bg-[#2F8068]/10 px-2.5 py-0.5 rounded-full border border-[#2F8068]/30">
                        {doc.relevanceScore}% Relevance Match
                      </span>
                    </div>

                    <div className="text-xs text-[#142B3A]/70 flex items-center gap-3 font-mono">
                      <span>Origin: <strong>{doc.wellId}</strong></span>
                      <span>&bull;</span>
                      <span>Interval: <strong>{doc.depthIntervalM}</strong></span>
                      <span>&bull;</span>
                      <span>Logged: {doc.dateLogged}</span>
                    </div>

                    <p className="text-xs font-sans text-[#142B3A]/90 italic bg-[#FAF8F5] p-3.5 rounded-xl border border-[#DDD2C0]/60 leading-relaxed">
                      &ldquo;{doc.snippetExcerpt}&rdquo;
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-[#2F8068] font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Source Traceable &bull; OCR Verified</span>
                      </span>
                      <button
                        onClick={() => setViewingDocument(doc)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#D96B3B] text-white hover:bg-[#c45a2c] text-xs font-bold font-sans transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>VIEW SOURCE</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. SYNTHETIC DATA TRANSPARENCY DISCLAIMER FOOTER */}
        <footer className="pt-6 border-t border-[#DDD2C0] text-xs font-mono text-[#142B3A]/60 flex items-center justify-between flex-wrap gap-3">
          <span>SYNTHETIC DEMO DATA — NOT VERIFIED OIL ASSET OR OPERATIONAL DATA (SIH26121)</span>
          <span>WellWise Engineering Intelligence Workspace &bull; Oil India Limited</span>
        </footer>
      </div>

      {/* 7. MODALS */}

      {/* A. Comparison Modal */}
      {comparisonTarget && (
        <WellComparisonModal
          targetWell={well}
          offsetWell={comparisonTarget}
          allWells={regionalOffsets}
          onSelectOffsetWell={(w) => setComparisonTarget(w)}
          onClose={() => setComparisonTarget(null)}
        />
      )}

      {/* B. Export Pre-Spud Summary Modal */}
      {showExportModal && (
        <OffsetReportExportModal
          targetWell={well}
          offsetWells={regionalOffsets}
          locationName={well.basin || well.field}
          radiusKm={5}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* C. Evidence Document Viewer Modal */}
      {viewingDocument && (
        <EvidenceDocumentModal
          document={viewingDocument}
          onClose={() => setViewingDocument(null)}
        />
      )}
    </div>
  );
}

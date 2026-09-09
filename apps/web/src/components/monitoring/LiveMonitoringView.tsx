"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { SYNTHETIC_WELLS, Well } from "@/components/dashboard/data/wells";
import { getWellEvidenceItems } from "@/components/wells/wellEngineeringData";
import { EvidenceDocumentItem } from "@/components/wells/types";
import {
  LiveTelemetryPoint,
  EarlyWarningSignal,
  WhatChangedItem,
  DepthEvent,
  OperationalContextData,
  ActiveAlertItem,
  TelemetryParameterKey,
  StreamState,
} from "./types";
import {
  generateInitialTelemetry,
  generateNextTickPoint,
  getWellBaselineParameters,
  getEarlyWarningSignals,
  getWhatChangedTimeline,
  getDepthEvents,
  getOperationalContext,
  getActiveAlerts,
} from "./telemetryEngine";

import { LiveMonitoringHeader } from "./LiveMonitoringHeader";
import { MonitoringWellSelector } from "./MonitoringWellSelector";
import { TopStatusBar } from "./TopStatusBar";
import { LiveDepthStatus } from "./LiveDepthStatus";
import { LiveTelemetryChart } from "./LiveTelemetryChart";
import { EarlyWarningSignals } from "./EarlyWarningSignals";
import { WhatChangedTimeline } from "./WhatChangedTimeline";
import { LiveSignalHistoricalContext } from "./LiveSignalHistoricalContext";
import { DepthEventTrack } from "./DepthEventTrack";
import { MudPressurePanel } from "./MudPressurePanel";
import { ActiveAlerts } from "./ActiveAlerts";
import { EngineerActions } from "./EngineerActions";
import { EvidenceModal } from "./EvidenceModal";

interface LiveMonitoringViewProps {
  initialWellId?: string;
}

export function LiveMonitoringView({ initialWellId }: LiveMonitoringViewProps) {
  // 1. Selected Well state
  const [selectedWell, setSelectedWell] = useState<Well>(() => {
    if (initialWellId) {
      const found = SYNTHETIC_WELLS.find(
        (w) => w.id.toLowerCase() === initialWellId.toLowerCase()
      );
      if (found) return found;
    }
    return SYNTHETIC_WELLS.find((w) => w.id === "NHK-124") || SYNTHETIC_WELLS[0];
  });

  // 2. Telemetry series state (45 rolling points)
  const [telemetryPoints, setTelemetryPoints] = useState<LiveTelemetryPoint[]>(() =>
    generateInitialTelemetry(selectedWell, 45)
  );

  // 3. Playback Stream state
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 5>(1);
  const [lastUpdatedSecondsAgo, setLastUpdatedSecondsAgo] = useState(0);
  const [tickCount, setTickCount] = useState(0);

  // 4. Active parameter tab for main chart (Torque prioritized as warning)
  const [activeParameter, setActiveParameter] = useState<TelemetryParameterKey>("torque");

  // 5. Highlighted timestamp from What Changed clicks
  const [highlightedTimestampMs, setHighlightedTimestampMs] = useState<number | null>(null);
  const [selectedTimelineItemId, setSelectedTimelineItemId] = useState<string | null>(null);

  // 6. Evidence modal state
  const [activeEvidenceDoc, setActiveEvidenceDoc] = useState<EvidenceDocumentItem | null>(null);

  const tickIndexRef = useRef(0);

  // Reset telemetry series when well changes
  const handleSelectWell = useCallback((well: Well) => {
    setSelectedWell(well);
    const initialPoints = generateInitialTelemetry(well, 45);
    setTelemetryPoints(initialPoints);
    setHighlightedTimestampMs(null);
    setSelectedTimelineItemId(null);
    setLastUpdatedSecondsAgo(0);
    tickIndexRef.current = 0;
  }, []);

  const baseline = useMemo(() => {
    return getWellBaselineParameters(selectedWell);
  }, [selectedWell]);

  const currentPoint = useMemo(() => {
    return (
      telemetryPoints[telemetryPoints.length - 1] ||
      generateInitialTelemetry(selectedWell, 1)[0]
    );
  }, [telemetryPoints, selectedWell]);

  const earlyWarningSignals = useMemo(() => {
    return getEarlyWarningSignals(selectedWell, currentPoint);
  }, [selectedWell, currentPoint]);

  const whatChangedItems = useMemo(() => {
    return getWhatChangedTimeline(selectedWell, telemetryPoints);
  }, [selectedWell, telemetryPoints]);

  const depthEvents = useMemo(() => {
    return getDepthEvents(selectedWell, currentPoint.depthM);
  }, [selectedWell, currentPoint.depthM]);

  const operationalContext = useMemo(() => {
    return getOperationalContext(selectedWell, currentPoint);
  }, [selectedWell, currentPoint]);

  const activeAlerts = useMemo(() => {
    return getActiveAlerts(selectedWell, currentPoint);
  }, [selectedWell, currentPoint]);

  const evidenceDocs = useMemo(() => {
    return getWellEvidenceItems(selectedWell);
  }, [selectedWell]);

  const streamState: StreamState = useMemo(() => ({
    isConnected: true,
    isPaused,
    speed,
    lastUpdatedSecondsAgo,
    connectionStatus: isPaused ? "PAUSED" : "CONNECTED",
    packetRateHz: speed,
    lastTimestampMs: currentPoint.timestamp,
  }), [isPaused, speed, lastUpdatedSecondsAgo, currentPoint.timestamp]);

  // Stream ticker simulation effect
  useEffect(() => {
    if (isPaused) return;

    const tickIntervalMs = Math.max(400, 2000 / speed);

    const intervalId = setInterval(() => {
      tickIndexRef.current += 1;
      setTickCount((prev) => prev + 1);

      setTelemetryPoints((prevPoints) => {
        const nextPoint = generateNextTickPoint(
          prevPoints,
          selectedWell,
          tickIndexRef.current
        );
        const updated = [...prevPoints.slice(-44), nextPoint];
        return updated;
      });

      setLastUpdatedSecondsAgo(0);
    }, tickIntervalMs);

    return () => clearInterval(intervalId);
  }, [isPaused, speed, selectedWell]);

  // Second-by-second ticker
  useEffect(() => {
    const secondTimer = setInterval(() => {
      setLastUpdatedSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(secondTimer);
  }, []);

  const handleSelectTimelineItem = (item: WhatChangedItem) => {
    setSelectedTimelineItemId(item.id);
    setHighlightedTimestampMs(item.timestampMs);
    setActiveParameter(item.parameter);
  };

  const handleOpenEvidence = () => {
    if (evidenceDocs.length > 0) {
      setActiveEvidenceDoc(evidenceDocs[0]);
    }
  };

  const rigId = `RIG-OIL-${selectedWell.id.replace(/[^0-9]/g, "") || "124"}`;

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#0D1B24] font-sans pb-10">
      <div className="max-w-[1360px] mx-auto px-3 sm:px-5 lg:px-6 pt-3 sm:pt-4 space-y-3.5 sm:space-y-4">
        {/* 1. Compact Page Header */}
        <LiveMonitoringHeader
          streamState={streamState}
          onTogglePlayPause={() => setIsPaused((prev) => !prev)}
          onSelectSpeed={(s) => setSpeed(s)}
        />

        {/* 2. Selected Well Header */}
        <MonitoringWellSelector
          selectedWell={selectedWell}
          onSelectWell={handleSelectWell}
          currentDepthM={currentPoint.depthM}
          drillingActivity={operationalContext.activity}
        />

        {/* 3. Key Metrics: Single Compact Strip */}
        <TopStatusBar
          currentPoint={currentPoint}
          baseline={baseline}
          onSelectParameterTab={(paramKey) => setActiveParameter(paramKey)}
          activeParameter={activeParameter}
        />

        {/* 4. Combined Drilling Status & Operational Context (Left: Depth Rail, Right: Rig Specs) */}
        <LiveDepthStatus
          currentDepthM={currentPoint.depthM}
          targetTdM={operationalContext.targetTdM}
          formation={selectedWell.formation || "Jurassic T13"}
          drillingState={currentPoint.drillingState}
          operationalContext={operationalContext}
          rigId={rigId}
        />

        {/* 5. Main 2-Column Layout (Desktop: ~68% / ~32%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-start">
          {/* Left ~68% Column: Live Telemetry + What Changed */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-3.5">
            {/* Main Interactive Live Telemetry Chart */}
            <LiveTelemetryChart
              points={telemetryPoints}
              activeParameter={activeParameter}
              onSelectParameter={(param) => setActiveParameter(param)}
              baseline={baseline}
              highlightedTimestampMs={highlightedTimestampMs}
            />

            {/* What Changed Timeline (Directly below chart) */}
            <WhatChangedTimeline
              items={whatChangedItems}
              selectedItemId={selectedTimelineItemId}
              onSelectItem={handleSelectTimelineItem}
            />
          </div>

          {/* Right ~32% Column: Early-Warning Signals + Active Alerts */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-3.5">
            {/* Early-Warning Signals */}
            <EarlyWarningSignals
              signals={earlyWarningSignals}
              onOpenEvidence={handleOpenEvidence}
            />

            {/* Active Alerts */}
            <ActiveAlerts alerts={activeAlerts} />
          </div>
        </div>

        {/* 6. Bottom 2-Column Layout: Historical Context + Mud Pressure & Depth Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-start">
          {/* Left Column (~50%): Live Signal + Historical Evidence & Mud Pressure */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-3.5">
            {/* Live Signal + Historical Evidence Card */}
            <LiveSignalHistoricalContext
              well={selectedWell}
              currentPoint={currentPoint}
              onOpenEvidenceModal={handleOpenEvidence}
            />

            {/* Compact Mud & Pressure Strip */}
            <MudPressurePanel
              currentPoint={currentPoint}
              baseline={baseline}
            />
          </div>

          {/* Right Column (~50%): Depth Event Track */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-3.5">
            {/* Compact Depth Rail Milestones */}
            <DepthEventTrack
              events={depthEvents}
              currentDepthM={currentPoint.depthM}
              targetTdM={operationalContext.targetTdM}
            />
          </div>
        </div>

        {/* 7. Compact Engineer Actions Bar */}
        <EngineerActions wellId={selectedWell.id} />
      </div>

      {/* Evidence Document Modal */}
      {activeEvidenceDoc && (
        <EvidenceModal
          document={activeEvidenceDoc}
          currentDepthM={currentPoint.depthM}
          onClose={() => setActiveEvidenceDoc(null)}
        />
      )}
    </div>
  );
}

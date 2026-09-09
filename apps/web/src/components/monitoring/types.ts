import { Well, WellStatus } from "@/components/dashboard/data/wells";
import { EvidenceDocumentItem } from "@/components/wells/types";

export type DrillingState = "DRILLING" | "CONNECTION" | "SLIDING" | "CIRCULATION";

export type TelemetryParameterKey =
  | "rop"
  | "wob"
  | "rpm"
  | "torque"
  | "flowRate"
  | "spp"
  | "mudWeight"
  | "ecd"
  | "gas";

export interface TelemetryParameterConfig {
  key: TelemetryParameterKey;
  label: string;
  shortLabel: string;
  fullName: string;
  unit: string;
  decimals: number;
  color: string;
  baselineKey: string;
  demoThresholdMax?: number;
  demoThresholdMin?: number;
  thresholdLabel?: string;
  description: string;
}

export interface LiveTelemetryPoint {
  timestamp: number; // unix timestamp ms
  timeLabel: string; // HH:mm:ss
  minuteLabel: string; // HH:mm
  depthM: number;
  ropMh: number;
  wobKlbf: number;
  rpm: number;
  torqueKftLb: number;
  flowRateGpm: number;
  sppPsi: number;
  mudWeightPpg: number;
  ecdPpg: number;
  gasPct: number;
  drillingState: DrillingState;
  isAnomalyPoint?: boolean;
}

export type SignalSeverity = "NORMAL" | "ADVISORY" | "WATCH" | "CRITICAL";

export interface EarlyWarningSignal {
  id: string;
  name: string;
  status: SignalSeverity;
  signalStrengthPct: number;
  reason: string;
  parameterKey: TelemetryParameterKey;
  currentValue: number;
  baselineValue: number;
  unit: string;
  detectedTimeAgo: string;
  evidenceReference?: string;
  historicalOffsetWellId?: string;
  explanation: string;
}

export interface WhatChangedItem {
  id: string;
  timestampMs: number;
  timestampLabel: string; // e.g. "11:26"
  relativeTime: string; // e.g. "14 min ago"
  parameter: TelemetryParameterKey;
  parameterName: string;
  changeSummary: string; // e.g. "Torque increased"
  deltaValue: string; // e.g. "+9%"
  deltaPercent: number;
  direction: "up" | "down" | "neutral";
  severity: "low" | "medium" | "high";
  currentValueFormatted: string;
  baselineValueFormatted: string;
}

export interface DepthEvent {
  depthM: number;
  title: string;
  type: "surface" | "formation" | "casing" | "hazard" | "current" | "target";
  severity?: "low" | "medium" | "high" | "critical";
  description: string;
  source?: string;
  isOffsetIncident?: boolean;
  offsetWellName?: string;
}

export interface OperationalContextData {
  activity: string;
  drillingState: DrillingState;
  holeSection: string;
  formation: string;
  bitDepthM: number;
  targetTdM: number;
  remainingM: number;
  progressPercent: number;
  bitModel: string;
  bitNo: string;
  elapsedDrilling: string;
  pumpStatus: string;
  circulationStatus: string;
  pumpStrokesSpm: number;
  rotaryTableRpm: number;
  tripTankLevelBbl: number;
}

export interface ActiveAlertItem {
  id: string;
  severity: "WATCH" | "INFO" | "HISTORICAL" | "ADVISORY";
  title: string;
  timestampAgo: string;
  explanation: string;
  context: string;
  parameterKey?: TelemetryParameterKey;
}

export interface StreamState {
  isConnected: boolean;
  isPaused: boolean;
  speed: 1 | 2 | 5;
  lastUpdatedSecondsAgo: number;
  connectionStatus: "CONNECTED" | "PAUSED" | "RECONNECTING";
  packetRateHz: number;
  lastTimestampMs: number;
}

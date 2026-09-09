import { Well } from "@/components/dashboard/data/wells";
import { EvidenceDocumentItem } from "@/components/wells/types";

export type RiskAttentionLevel = "NORMAL" | "ADVISORY" | "WATCH" | "CRITICAL";

export type RiskCategory =
  | "ALL"
  | "WELL CONTROL"
  | "LOST CIRCULATION"
  | "STUCK PIPE"
  | "TORQUE / DRAG"
  | "PRESSURE"
  | "CEMENTING"
  | "NPT"
  | "DRILLING PERFORMANCE";

export interface RiskSignalItem {
  id: string;
  rank: number;
  name: string;
  category: RiskCategory;
  attentionLevel: RiskAttentionLevel;
  signalStrength: number; // 0 - 100
  currentValueFormatted: string;
  baselineValueFormatted: string;
  deviationFormatted: string;
  deviationPercent: number;
  depthM: number;
  unit: string;
  whyFlagged: string;
  historicalMatchLevel: "STRONG" | "MODERATE" | "LOW";
  historicalSummary: string;
  matchedOffsetCount: number;
  evidenceRecordCount: number;
  relevantParameters: string[];
  patternDescription: string;
  mitigationSummary: string;
}

export interface RiskEvidenceRecord {
  id: string;
  sourceType: "Daily Drilling Report" | "Incident Report" | "Mud Engineer Recap" | "End of Well Report" | "Lessons Learned";
  documentTitle: string;
  offsetWellId: string;
  offsetWellName: string;
  depthIntervalM: string;
  eventDescription: string;
  relevance: "HIGH" | "MEDIUM" | "LOW";
  relevanceScore: number;
  snippetExcerpt: string;
  dateLogged: string;
  mitigationReferenced: string;
}

export interface OffsetWellComparisonItem {
  wellId: string;
  wellName: string;
  distanceKm: number;
  formationMatchPct: number;
  riskMatchLevel: "Strong" | "Moderate" | "Low";
  historicalEvent: string;
  evidenceRecordCount: number;
  formation: string;
}

export interface DepthRiskRailEvent {
  depthM: number;
  label: string;
  type: "surface" | "formation" | "incident" | "signal" | "current" | "target";
  isCurrentDepth?: boolean;
  severity?: "low" | "medium" | "high" | "critical";
  description: string;
  source?: string;
}

export interface SignalHistoryEvent {
  timeLabel: string;
  signalName: string;
  status: RiskAttentionLevel;
  summary: string;
  valueFormatted: string;
}

export interface MitigationPracticeItem {
  id: string;
  practiceTitle: string;
  description: string;
  usedInOffsetCount: number;
  evidenceRecordCount: number;
  outcomeSummary: string;
  primaryOffsetWellId: string;
}

export interface RiskMatrixRow {
  hazardName: string;
  level: "LOW" | "MEDIUM" | "HIGH";
  attentionLevel: RiskAttentionLevel;
  signalStrength: number;
}

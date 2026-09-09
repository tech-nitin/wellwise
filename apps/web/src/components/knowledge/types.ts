import { Well } from "@/components/dashboard/data/wells";

export type KnowledgeSourceType =
  | "Daily Drilling Report"
  | "Incident Report"
  | "Mud Engineer Recap"
  | "End of Well Report"
  | "Lessons Learned"
  | "BHA & Bit Record"
  | "Casing Report";

export interface ExtractedEntity {
  label: string;
  value: string;
  category: "well" | "depth" | "event" | "formation" | "mitigation" | "parameter";
}

export interface KnowledgeEvidenceItem {
  id: string;
  sourceType: KnowledgeSourceType;
  documentTitle: string;
  offsetWellId: string;
  offsetWellName: string;
  depthIntervalM: string;
  formation: string;
  eventSummary: string;
  relevanceScore: number;
  relevanceLevel: "HIGH" | "MEDIUM" | "LOW";
  matchLevel: "STRONG" | "MODERATE" | "LOW";
  dateLogged: string;
  snippetExcerpt: string;
  highlightedPhrase: string;
  mitigationReferenced: string;
  extractedEntities: ExtractedEntity[];
}

export interface KnowledgeAnswer {
  query: string;
  directAnswer: string;
  keyFindings: string[];
  depthContext: string;
  formationContext: string;
  historicalPattern: string;
  evidenceItems: KnowledgeEvidenceItem[];
  offsetWellsCount: number;
  evidenceRecordsCount: number;
  depthMatchLevel: "Strong" | "Moderate" | "Low";
  formationMatchLevel: "Strong" | "Moderate" | "Low";
  sourceTypes: string[];
  investigateNext: string[];
  historicalResponse: string;
  historicalOutcome: string;
  mitigationUsedInWells: number;
}

export interface DocumentRepositoryItem {
  id: string;
  documentTitle: string;
  wellId: string;
  depthIntervalM: string;
  type: KnowledgeSourceType;
  shortType: string;
  status: "Indexed" | "Pending OCR" | "Verified";
  eventsCount: number;
  dateLogged: string;
  summary: string;
  fileSize: string;
  snippetExcerpt: string;
  extractedEntities: ExtractedEntity[];
}

export interface RecentInvestigationItem {
  id: string;
  query: string;
  timestampLabel: string;
  wellId: string;
  topic: string;
}

export interface KnowledgeFilterState {
  wellFilter: string;
  depthRange: string;
  formationFilter: string;
  eventType: string;
  sourceType: string;
}

/**
 * Domain types for Drilling Documents, DDRs, and OCR extraction.
 */

export type DocumentType =
  | "DAILY_DRILLING_REPORT"
  | "MUD_LOG"
  | "WELL_COMPLETION_REPORT"
  | "GEOLOGICAL_FORMATION_SUMMARY"
  | "CASING_TALLY"
  | "BIT_RECORD";

export type DocumentProcessingStatus =
  | "PENDING"
  | "PROCESSING"
  | "OCR_COMPLETED"
  | "EMBEDDING_INDEXED"
  | "FAILED";

export interface DrillingDocument {
  id: string;
  wellId: string;
  title: string;
  fileName: string;
  fileSizeBytes: number;
  type: DocumentType;
  status: DocumentProcessingStatus;
  uploadedAt: string;
  pagesCount?: number;
  extractedKeywords?: string[];
  summary?: string;
  author?: string;
}

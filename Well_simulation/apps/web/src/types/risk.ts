import { RiskSeverity } from "@/lib/constants";

export type RiskCategory =
  | "KICK_HAZARD"
  | "STUCK_PIPE"
  | "LOST_CIRCULATION"
  | "WELLBORE_INSTABILITY"
  | "ABNORMAL_PRESSURE"
  | "EQUIPMENT_VIBRATION";

export interface RiskAlert {
  id: string;
  wellId: string;
  severity: RiskSeverity;
  category: RiskCategory;
  title: string;
  description: string;
  predictedDepthMD: number;
  currentDepthMD: number;
  confidenceScore: number; // 0.0 - 1.0
  offsetPrecedentWellId?: string;
  offsetPrecedentWellName?: string;
  suggestedMitigation: string;
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
  createdAt: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface RiskMatrixSummary {
  lowCount: number;
  mediumCount: number;
  highCount: number;
  criticalCount: number;
  activeCount: number;
  lastEvaluatedAt: string;
}

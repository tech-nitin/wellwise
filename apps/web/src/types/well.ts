/**
 * Domain types for Wells and Offset Wells (Oil India Limited).
 */

export type WellStatus =
  | "ACTIVE_DRILLING"
  | "COMPLETED"
  | "SUSPENDED"
  | "PLANNED"
  | "ABANDONED";

export type WellType =
  | "EXPLORATORY"
  | "DEVELOPMENT"
  | "APPRAISAL"
  | "INJECTION";

export interface WellCoordinates {
  latitude: number;
  longitude: number;
  elevationMeters?: number;
}

export interface WellFormation {
  name: string;
  topDepthMD: number;
  bottomDepthMD: number;
  lithology: string;
  hydrocarbonPotential?: "GAS" | "OIL" | "WATER" | "NONE";
}

export interface Well {
  id: string;
  name: string;
  uwi: string; // Unique Well Identifier
  field: string;
  basin: string;
  operator: string;
  rigId?: string;
  status: WellStatus;
  type: WellType;
  coordinates: WellCoordinates;
  spudDate?: string;
  targetDepthMD: number; // Measured Depth
  targetDepthTVD: number; // True Vertical Depth
  currentDepthMD?: number;
  formations?: WellFormation[];
  distanceFromActiveMeters?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OffsetWellSummary {
  wellId: string;
  name: string;
  distanceKm: number;
  similarityScore: number;
  primaryRiskExperience: string[];
  formationMatch: string;
  status: WellStatus;
}

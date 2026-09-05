import { Well, WellStatus } from "@/components/dashboard/data/wells";
import { LocationNode } from "@/components/dashboard/data/locations";

export type WellFilterType =
  | "ALL"
  | "ACTIVE"
  | "NEARBY"
  | "HIGH_RISK"
  | "HISTORICAL_MATCH";

export type RadiusKm = 1 | 3 | 5 | 10 | 20;

export type MapPerspectiveMode = "2D" | "3D";

export type BasemapStyleId = "streets" | "satellite" | "dark" | "topo";

export type NearbyViewMode = "map" | "split" | "table";

export interface MeasurePoint {
  lng: number;
  lat: number;
  wellId?: string;
  label?: string;
}

export interface ComparisonState {
  open: boolean;
  targetWellId: string;
  compareWellId?: string;
}

export interface FormationStratum {
  name: string;
  topDepthM: number;
  baseDepthM: number;
  lithology: string;
  isTargetZone?: boolean;
  hazardRisk?: "none" | "low" | "medium" | "high" | "critical";
  description?: string;
}

export interface HistoricalIncident {
  id?: string;
  depthM: number;
  event: string;
  category:
    | "Lost Circulation"
    | "Kick"
    | "Stuck Pipe"
    | "Differential Sticking"
    | "Gas Influx"
    | "Cementing"
    | "Torque/Drag"
    | "Other";
  severity: "low" | "medium" | "high" | "critical";
  mitigationApplied?: string;
  nptHours?: number;
  dateLogged?: string;
}

export interface MudWeightInterval {
  fromDepthM: number;
  toDepthM: number;
  mudWeightPpg: number;
  mudType: string;
  ecdEstimatedPpg?: number;
  porePressureEquivalentPpg?: number;
}

export interface CasingSection {
  type: "Conductor" | "Surface" | "Intermediate" | "Production" | "Liner";
  outerDiameterInch: string;
  settingDepthMD: number;
  settingDepthTVD?: number;
  weightLbPerFt?: number;
  grade?: string;
  cementTopM?: number;
  testPressurePsi?: number;
}

export interface NPTEvent {
  id: string;
  date: string;
  depthM: number;
  event: string;
  category: string;
  durationHours: number;
  description: string;
  mitigation: string;
}

export type DossierTabId =
  | "overview"
  | "geology"
  | "hazards"
  | "casing"
  | "offsets"
  | "drilling"
  | "evidence";

export interface DailyDrillingRecord {
  date: string;
  depthM: number;
  ropMh: number;
  wobKlbf: number;
  rpm: number;
  torqueKftLbf: number;
  mudWeightPpg: number;
  flowRateGpm: number;
  sppPsi: number;
  nptHours: number;
  activitySummary: string;
}

export interface EvidenceDocumentItem {
  id: string;
  sourceType: "Daily Drilling Report" | "Mud Engineer Recap" | "BHA & Bit Record" | "Geological End-of-Well Report";
  documentTitle: string;
  wellId: string;
  eventSummary: string;
  depthIntervalM: string;
  relevanceScore: number;
  snippetExcerpt: string;
  dateLogged: string;
  mitigationReferenced: string;
}

export interface EarlyWarningSignals {
  riskScore: number;
  category: "NORMAL" | "ADVISORY" | "WATCH" | "CRITICAL";
  mudLossSignalPercent: number;
  torqueAnomalySignalPercent: number;
  incidentSimilarityPercent: number;
  porePressureRampPercent: number;
  explanation: string;
  supportingEvidenceSummary: string[];
  operationalConsideration: string;
}

/**
 * An offset well with dynamically calculated spherical distance & bearing
 * relative to the currently active target well.
 */
export interface OffsetWellCalculated extends Well {
  calculatedDistanceKm: number;
  calculatedBearingDeg: number;
  bearingFormatted: string;
  stratigraphy?: FormationStratum[];
  casingProgram?: CasingSection[];
  mudWeightProfile?: MudWeightInterval[];
  nptHistory?: NPTEvent[];
  spudDate?: string;
  rigId?: string;
  elevationM?: number;
  operator?: string;
}

export interface NearbyWellsState {
  selectedLocation: LocationNode;
  activeTargetWell: Well;
  selectedWell: Well | null;
  activeFilter: WellFilterType;
  radiusKm: RadiusKm;
  perspectiveMode: MapPerspectiveMode;
  basemapStyle: BasemapStyleId;
  viewMode: NearbyViewMode;
  searchQuery: string;
  rangeRingsVisible: boolean;
  labelsVisible: boolean;
  measuringActive: boolean;
  measureStart: MeasurePoint | null;
  measureEnd: MeasurePoint | null;
}

export type { Well, WellStatus, LocationNode };

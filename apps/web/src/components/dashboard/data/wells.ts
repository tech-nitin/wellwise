/**
 * WellWise — Verified Indian Well Catalog derived strictly from real_india_wells.json
 * Supported Basins:
 * - Upper Assam Basin (Baghjan, Balimara, Lakwagaon, Dumduma, Naharkatiya)
 * - Cambay Basin (Ankleshwar)
 *
 * All well coordinates, depths, formation tops, incident histories, and engineering mitigations
 * are strictly sourced from verified Indian field operations data (OIL & ONGC).
 */

export type WellStatus =
  | "active"
  | "healthy"
  | "warning"
  | "critical"
  | "historical";

export interface WellEvent {
  depthM: number;
  event: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface SimilarWell {
  id: string;
  name: string;
  matchPercent: number;
}

export interface Well {
  id: string;
  name: string;
  type: "active" | "offset" | "historical";
  latitude: number;
  longitude: number;
  status: WellStatus;
  distanceKm: number;
  depthM: number;
  formation: string;
  formationInterval: string;
  riskScore: number;
  historicalMatch: number;
  events: WellEvent[];
  similarWells: SimilarWell[];
  recommendedAction: string;
  leaseBlock: string;
  field: string;
  state: string;
  basin?: string;
  regionId: string; // matches LocationNode.id
  hazardType?: "KICK" | "MUD_LOSS" | "STUCK_PIPE" | "WELLBORE_INSTABILITY" | "NONE";
  narrative?: string;
  mitigation?: string;
  tops?: Record<string, number>;
  isDemo?: boolean;
}

export const REAL_INDIA_WELLS: Well[] = [
  {
    id: "OIL-BGN-05",
    name: "Baghjan-5 (Blowout Precedent)",
    type: "active",
    latitude: 27.59626,
    longitude: 95.38042,
    status: "critical",
    hazardType: "KICK",
    narrative: "B-Annulus pressure surged to 4400 psi during Langpar workover, causing uncontrolled blowout.",
    mitigation: "Dynamic kill modeling, heavy brine weighting (11.6 ppg+), and relief well intercept planning.",
    tops: { Tipam: 2144, Barail: 2401, Kopili: 3178, Prang: 3541, Narpuh: 3632, Lakadong_Therria: 3720, Langpar: 3847, Basement: 3898 },
    distanceKm: 0,
    depthM: 3871,
    formation: "Langpar",
    formationInterval: "3,847–3,898 m",
    riskScore: 95,
    historicalMatch: 98,
    events: [
      { depthM: 3870, event: "B-Annulus Pressure Surge to 4400 psi — Uncontrolled Kick & Blowout", severity: "critical" },
      { depthM: 3720, event: "High Pressure Gas Influx in Lakadong-Therria", severity: "high" },
    ],
    similarWells: [
      { id: "OIL-BGN-01", name: "Baghjan-1", matchPercent: 94 },
      { id: "OIL-NDBN-301", name: "NDBN-301", matchPercent: 88 },
      { id: "OIL-BLM-01", name: "Balimara-1", matchPercent: 82 },
    ],
    recommendedAction: "Dynamic kill modeling, heavy brine weighting (11.6 ppg+), and relief well intercept planning.",
    leaseBlock: "OIL-BGN-01",
    field: "Baghjan",
    state: "Assam",
    basin: "Upper Assam Basin",
    regionId: "assam-basin",
    isDemo: false,
  },
  {
    id: "OIL-BGN-01",
    name: "Baghjan-1",
    type: "offset",
    latitude: 27.58910,
    longitude: 95.37280,
    status: "warning",
    hazardType: "MUD_LOSS",
    narrative: "Complete mud circulation loss in coarse Tipam sandstone. Fluid level dropped below flowline.",
    mitigation: "Pumped 45 bbl medium-coarse Calcium Carbonate and mica LCM pill; reduced pump rate to 350 gpm.",
    tops: { Tipam: 2050, Barail: 2357, Kopili: 3099, Prang: 3413, Narpuh: 3466, Lakadong_Therria: 3576, Langpar: 3736, Basement: 3844 },
    distanceKm: 1.1,
    depthM: 3844,
    formation: "Tipam Sandstone",
    formationInterval: "2,050–2,357 m",
    riskScore: 78,
    historicalMatch: 94,
    events: [
      { depthM: 2050, event: "Complete Circulation Mud Loss in Coarse Tipam Sandstone", severity: "high" },
    ],
    similarWells: [
      { id: "OIL-BGN-05", name: "Baghjan-5", matchPercent: 94 },
      { id: "OIL-NDBN-308", name: "NDBN-308", matchPercent: 86 },
    ],
    recommendedAction: "Pump 45 bbl medium-coarse CaCO3 and mica LCM pill; reduce pump rate to 350 gpm.",
    leaseBlock: "OIL-BGN-01",
    field: "Baghjan",
    state: "Assam",
    basin: "Upper Assam Basin",
    regionId: "assam-basin",
    isDemo: false,
  },
  {
    id: "OIL-BLM-01",
    name: "Balimara-1",
    type: "offset",
    latitude: 27.35500,
    longitude: 95.40500,
    status: "warning",
    hazardType: "STUCK_PIPE",
    narrative: "Differential sticking in depleted Barail Arenaceous sandstone while making connection.",
    mitigation: "Spotted 40 bbl low-density organic surfactant freeing pill; worked string with 75 klbs jar overpull.",
    tops: { Girujan: 1747, Tipam: 2862, Barail_Argillaceous: 3706, Barail_Arenaceous: 4032, Kopili: 4571 },
    distanceKm: 27.0,
    depthM: 4571,
    formation: "Barail Arenaceous",
    formationInterval: "4,032–4,571 m",
    riskScore: 75,
    historicalMatch: 86,
    events: [
      { depthM: 4032, event: "Differential Sticking in Depleted Barail Arenaceous Sandstone", severity: "high" },
    ],
    similarWells: [
      { id: "OIL-BGN-05", name: "Baghjan-5", matchPercent: 82 },
      { id: "OIL-LKW-01", name: "Lakwagaon-1", matchPercent: 85 },
    ],
    recommendedAction: "Spot 40 bbl low-density organic surfactant freeing pill; work string with 75 klbs jar overpull.",
    leaseBlock: "OIL-BLM-01",
    field: "Balimara",
    state: "Assam",
    basin: "Upper Assam Basin",
    regionId: "assam-basin",
    isDemo: false,
  },
  {
    id: "OIL-LKW-01",
    name: "Lakwagaon-1",
    type: "offset",
    latitude: 27.32000,
    longitude: 94.95000,
    status: "warning",
    hazardType: "WELLBORE_INSTABILITY",
    narrative: "Severe splintery shale breakout and hole pack-off at Kopili boundary. Torque spiked to 32 kNm.",
    mitigation: "Dosed active mud pits with 4% Cloud Point Glycol and 2% Polyamine shale inhibitor; back-ream hole.",
    tops: { Namsang: 1637, Girujan: 2360, Tipam: 2568, Barail: 3238, Kopili: 3713, Prang: 4197, Narpuh: 4257, Lakadong_Therria: 4304, Langpar: 4373, Basement: 4426 },
    distanceKm: 52.0,
    depthM: 4426,
    formation: "Kopili Shale",
    formationInterval: "3,713–4,197 m",
    riskScore: 82,
    historicalMatch: 84,
    events: [
      { depthM: 3713, event: "Severe Splintery Shale Breakout & Hole Pack-Off at Kopili Boundary", severity: "high" },
    ],
    similarWells: [
      { id: "OIL-BLM-01", name: "Balimara-1", matchPercent: 85 },
      { id: "OIL-BGN-05", name: "Baghjan-5", matchPercent: 80 },
    ],
    recommendedAction: "Dose active mud pits with 4% Cloud Point Glycol and 2% Polyamine shale inhibitor; back-ream hole.",
    leaseBlock: "OIL-LKW-01",
    field: "Lakwagaon (Moran)",
    state: "Assam",
    basin: "Upper Assam Basin",
    regionId: "assam-basin",
    isDemo: false,
  },
  {
    id: "OIL-NDBN-301",
    name: "NDBN Location 301",
    type: "offset",
    latitude: 27.449117,
    longitude: 95.506053,
    status: "healthy",
    hazardType: "NONE",
    tops: { Tipam: 2100, Barail: 2650, Kopili: 3320, Basement: 3950 },
    distanceKm: 21.0,
    depthM: 3950,
    formation: "Basement",
    formationInterval: "3,320–3,950 m",
    riskScore: 28,
    historicalMatch: 88,
    events: [],
    similarWells: [
      { id: "OIL-BGN-05", name: "Baghjan-5", matchPercent: 88 },
      { id: "OIL-NDBN-308", name: "NDBN-308", matchPercent: 91 },
    ],
    recommendedAction: "Maintain controlled ROP in fractured basement; log for micro-fractures.",
    leaseBlock: "OIL-DUM-02",
    field: "Dumduma / Hugrijan",
    state: "Assam",
    basin: "Upper Assam Basin",
    regionId: "assam-basin",
    isDemo: false,
  },
  {
    id: "OIL-NDBN-308",
    name: "NDBN Location 308",
    type: "offset",
    latitude: 27.421167,
    longitude: 95.237844,
    status: "healthy",
    hazardType: "NONE",
    tops: { Tipam: 1950, Barail: 2550, Kopili: 3200, Basement: 3750 },
    distanceKm: 24.5,
    depthM: 3750,
    formation: "Basement",
    formationInterval: "3,200–3,750 m",
    riskScore: 24,
    historicalMatch: 86,
    events: [],
    similarWells: [
      { id: "OIL-NDBN-301", name: "NDBN-301", matchPercent: 91 },
      { id: "OIL-BGN-01", name: "Baghjan-1", matchPercent: 86 },
    ],
    recommendedAction: "Optimized hydraulics verified across Barail interval.",
    leaseBlock: "OIL-NAH-03",
    field: "Naharkatiya",
    state: "Assam",
    basin: "Upper Assam Basin",
    regionId: "assam-basin",
    isDemo: false,
  },
  {
    id: "ONGC-ANK-14",
    name: "ONGC Ankleshwar-14",
    type: "offset",
    latitude: 21.6250,
    longitude: 73.0120,
    status: "warning",
    hazardType: "WELLBORE_INSTABILITY",
    narrative: "Severe shale sloughing and pack-off in Cambay Shale.",
    mitigation: "Increased mud weight to 1.40 SG; optimized hole cleaning with high-viscosity polymer sweeps.",
    tops: { Ankleshwar_Sand: 1150, Cambay_Shale: 1650 },
    distanceKm: 0,
    depthM: 2200,
    formation: "Cambay Shale",
    formationInterval: "1,650–2,200 m",
    riskScore: 68,
    historicalMatch: 82,
    events: [
      { depthM: 1720, event: "Severe Shale Sloughing & Pack-Off in Cambay Shale", severity: "high" },
    ],
    similarWells: [],
    recommendedAction: "Increase mud weight to 1.40 SG; optimize hole cleaning with high-viscosity polymer sweeps.",
    leaseBlock: "ONGC-ANK-01",
    field: "Ankleshwar",
    state: "Gujarat",
    basin: "Cambay Basin",
    regionId: "cambay-basin",
    isDemo: false,
  },
];

export const SYNTHETIC_WELLS: Well[] = REAL_INDIA_WELLS;

/**
 * Filter wells by location id, state name, or basin name.
 */
export function getWellsByLocation(locationId: string): Well[] {
  if (!locationId || locationId === "india") {
    return SYNTHETIC_WELLS;
  }

  return SYNTHETIC_WELLS.filter(
    (w) =>
      w.regionId === locationId ||
      w.state.toLowerCase() === locationId.toLowerCase() ||
      (w.basin && w.basin.toLowerCase().includes(locationId.toLowerCase()))
  );
}

/**
 * Get count of wells in a specific location
 */
export function getLocationWellCount(locationId: string): number {
  return getWellsByLocation(locationId).length;
}

/**
 * GeoJSON FeatureCollection generation helper for PostGIS compliance
 */
export function wellsToGeoJSON(wells: Well[]) {
  return {
    type: "FeatureCollection" as const,
    features: wells.map((w) => ({
      type: "Feature" as const,
      id: w.id,
      geometry: {
        type: "Point" as const,
        coordinates: [w.longitude, w.latitude] as [number, number],
      },
      properties: {
        ...w,
      },
    })),
  };
}

/**
 * Circular polygon generation for GIS offset radius buffer
 * Approximates geodesics at arbitrary latitude
 */
export function createRadiusCircle(
  centerLng: number,
  centerLat: number,
  radiusKm: number,
  points = 64
) {
  const coords: [number, number][] = [];
  const kmPerLat = 110.574;
  const kmPerLng = 111.32 * Math.cos((centerLat * Math.PI) / 180);

  for (let i = 0; i <= points; i++) {
    const angle = (i * 2 * Math.PI) / points;
    const dx = radiusKm * Math.cos(angle);
    const dy = radiusKm * Math.sin(angle);
    const lat = centerLat + dy / kmPerLat;
    const lng = centerLng + dx / kmPerLng;
    coords.push([lng, lat]);
  }

  return {
    type: "Feature" as const,
    properties: { radiusKm },
    geometry: {
      type: "Polygon" as const,
      coordinates: [coords],
    },
  };
}

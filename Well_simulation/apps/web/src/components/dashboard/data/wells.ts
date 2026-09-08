/**
 * WellWise — Synthetic Demonstration Dataset for Multi-Basin Indian Well Intelligence
 * Supported Regions:
 * - Upper Assam Basin (Nahorkatiya / Duliajan)
 * - Cambay Basin (Gujarat)
 * - Barmer Basin (Rajasthan)
 * - Krishna-Godavari Basin (Andhra Pradesh)
 * - Cauvery Basin (Tamil Nadu)
 * - Mumbai Offshore (Maharashtra)
 * - Madhya Pradesh Demonstration Areas (Bhopal, Indore)
 *
 * NOTE: All coordinates, lithologies, logs, and parameters are SYNTHETIC DEMONSTRATION DATA
 * structured for SIH26121 to support future PostGIS & telemetry API ingestion.
 * Do not treat as factual Oil India Limited coordinates outside verified demonstration parameters.
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
  isDemo?: boolean;
}

export const SYNTHETIC_WELLS: Well[] = [
  // ==========================================================================
  // 1. ASSAM BASIN DEMO WELLS (Upper Assam Province)
  // ==========================================================================
  {
    id: "NHK-124",
    name: "Demo Well — NHK-124 (Active Target)",
    type: "active",
    latitude: 27.4700,
    longitude: 95.3600,
    status: "active",
    distanceKm: 0,
    depthM: 3240,
    formation: "JURASSIC T13",
    formationInterval: "3,120–3,280 m",
    riskScore: 72,
    historicalMatch: 92,
    events: [
      { depthM: 3120, event: "Lost Circulation (120 bbl)", severity: "high" },
      { depthM: 3180, event: "Torque Spike in Sandstone", severity: "medium" },
      { depthM: 3240, event: "Mud Weight Adjustment (11.2 ppg)", severity: "low" },
    ],
    similarWells: [
      { id: "NHK-119", name: "NHK-119", matchPercent: 91 },
      { id: "NHK-121", name: "NHK-121", matchPercent: 84 },
      { id: "NHK-117", name: "NHK-117", matchPercent: 78 },
    ],
    recommendedAction: "Maintain controlled RPM across permeable sand; monitor trip tank closely on connections.",
    leaseBlock: "OIL-NAH-04",
    field: "Nahorkatiya Main",
    state: "Assam",
    basin: "Upper Assam Basin",
    regionId: "assam-basin",
    isDemo: true,
  },
  {
    id: "NHK-119",
    name: "Demo Well — NHK-119",
    type: "offset",
    latitude: 27.4850,
    longitude: 95.3480,
    status: "critical",
    distanceKm: 2.4,
    depthM: 3180,
    formation: "JURASSIC T13",
    formationInterval: "3,120–3,280 m",
    riskScore: 88,
    historicalMatch: 91,
    events: [
      { depthM: 3120, event: "Lost Circulation to Depleted Zone", severity: "high" },
      { depthM: 3180, event: "Severe Torque Spike (Cyclic)", severity: "high" },
      { depthM: 3265, event: "Stuck Pipe (Differential Sticking)", severity: "critical" },
    ],
    similarWells: [
      { id: "NHK-124", name: "NHK-124", matchPercent: 91 },
      { id: "NHK-117", name: "NHK-117", matchPercent: 86 },
    ],
    recommendedAction: "Review mud properties; limit static connection times to <3 min and pre-spot liquid lubricant.",
    leaseBlock: "OIL-NAH-04",
    field: "Nahorkatiya North",
    state: "Assam",
    basin: "Upper Assam Basin",
    regionId: "assam-basin",
    isDemo: true,
  },
  {
    id: "NHK-121",
    name: "Demo Well — NHK-121",
    type: "offset",
    latitude: 27.4620,
    longitude: 95.3780,
    status: "warning",
    distanceKm: 2.8,
    depthM: 3310,
    formation: "Tipam Sandstone",
    formationInterval: "2,980–3,310 m",
    riskScore: 54,
    historicalMatch: 84,
    events: [
      { depthM: 3050, event: "Minor Gas Kick (0.3 ppg equivalent)", severity: "medium" },
      { depthM: 3290, event: "Bit Balling in Sticky Shale", severity: "medium" },
    ],
    similarWells: [
      { id: "NHK-124", name: "NHK-124", matchPercent: 84 },
      { id: "NHK-108", name: "NHK-108", matchPercent: 79 },
    ],
    recommendedAction: "Increase hydraulics and additive sweep to clear argillaceous cuttings in lower Tipam section.",
    leaseBlock: "OIL-NAH-04",
    field: "Nahorkatiya East",
    state: "Assam",
    basin: "Upper Assam Basin",
    regionId: "assam-basin",
    isDemo: true,
  },
  {
    id: "NHK-117",
    name: "Demo Well — NHK-117",
    type: "historical",
    latitude: 27.4530,
    longitude: 95.3350,
    status: "historical",
    distanceKm: 3.6,
    depthM: 3450,
    formation: "Barail Main",
    formationInterval: "3,300–3,450 m",
    riskScore: 38,
    historicalMatch: 78,
    events: [
      { depthM: 3340, event: "Normal Drilling Parameters Recorded", severity: "low" },
    ],
    similarWells: [
      { id: "NHK-119", name: "NHK-119", matchPercent: 86 },
    ],
    recommendedAction: "Benchmark formation evaluation tops against Barail Coal-Shale regional marker.",
    leaseBlock: "OIL-NAH-03",
    field: "Nahorkatiya South",
    state: "Assam",
    basin: "Upper Assam Basin",
    regionId: "assam-basin",
    isDemo: true,
  },
  {
    id: "NHK-108",
    name: "Demo Well — NHK-108",
    type: "historical",
    latitude: 27.4980,
    longitude: 95.3850,
    status: "healthy",
    distanceKm: 4.8,
    depthM: 3620,
    formation: "Kopili Shale",
    formationInterval: "3,420–3,620 m",
    riskScore: 19,
    historicalMatch: 74,
    events: [
      { depthM: 3450, event: "Casing Shoe Pressure Integrity Test Passed", severity: "low" },
    ],
    similarWells: [
      { id: "NHK-121", name: "NHK-121", matchPercent: 79 },
    ],
    recommendedAction: "Reference well for intact casing seat integrity in over-pressured Kopili section.",
    leaseBlock: "OIL-NAH-02",
    field: "Nahorkatiya Outlier",
    state: "Assam",
    basin: "Upper Assam Basin",
    regionId: "assam-basin",
    isDemo: true,
  },

  // ==========================================================================
  // 2. GUJARAT / CAMBAY BASIN DEMO WELLS
  // ==========================================================================
  {
    id: "CAM-DEMO-01",
    name: "Demo Well — Cambay Basin Target",
    type: "active",
    latitude: 21.7200,
    longitude: 72.8500,
    status: "active",
    distanceKm: 0,
    depthM: 2860,
    formation: "ANKLESHWAR FORMATION",
    formationInterval: "2,450–2,860 m",
    riskScore: 68,
    historicalMatch: 89,
    events: [
      { depthM: 2650, event: "Gas Influx Detected during Connection", severity: "medium" },
      { depthM: 2780, event: "Tight Hole Condition in Cambay Shale", severity: "high" },
    ],
    similarWells: [
      { id: "ANK-DEMO-04", name: "ANK-DEMO-04", matchPercent: 88 },
    ],
    recommendedAction: "Maintain mud density at 10.8 ppg; circulate bottoms-up prior to pulling out of hole.",
    leaseBlock: "ONGC-CAM-08",
    field: "Ankleshwar Extension",
    state: "Gujarat",
    basin: "Cambay Basin",
    regionId: "cambay-basin",
    isDemo: true,
  },
  {
    id: "ANK-DEMO-04",
    name: "Demo Well — Ankleshwar Offset",
    type: "offset",
    latitude: 21.7450,
    longitude: 72.8800,
    status: "warning",
    distanceKm: 4.2,
    depthM: 2950,
    formation: "ANKLESHWAR FORMATION",
    formationInterval: "2,500–2,950 m",
    riskScore: 58,
    historicalMatch: 88,
    events: [
      { depthM: 2720, event: "Shale Swelling & Pack-off Warning", severity: "medium" },
    ],
    similarWells: [
      { id: "CAM-DEMO-01", name: "CAM-DEMO-01", matchPercent: 88 },
    ],
    recommendedAction: "Use polymer-inhibitive drilling fluid system to stabilize reactive montmorillonite clay.",
    leaseBlock: "ONGC-CAM-08",
    field: "Ankleshwar North",
    state: "Gujarat",
    basin: "Cambay Basin",
    regionId: "cambay-basin",
    isDemo: true,
  },

  // ==========================================================================
  // 3. RAJASTHAN / BARMER BASIN DEMO WELLS
  // ==========================================================================
  {
    id: "BMR-DEMO-01",
    name: "Demo Well — Barmer Basin Target",
    type: "active",
    latitude: 25.7500,
    longitude: 71.4200,
    status: "active",
    distanceKm: 0,
    depthM: 1980,
    formation: "FATEHGARH SANDSTONE",
    formationInterval: "1,600–1,980 m",
    riskScore: 62,
    historicalMatch: 90,
    events: [
      { depthM: 1750, event: "Loss of Circulation in High-Perm Sand", severity: "high" },
      { depthM: 1920, event: "High Wax Crude Influx", severity: "medium" },
    ],
    similarWells: [
      { id: "MGL-DEMO-02", name: "MGL-DEMO-02", matchPercent: 87 },
    ],
    recommendedAction: "Maintain elevated circulating mud temperature to prevent paraffin deposition in string.",
    leaseBlock: "RJ-ON-90/1",
    field: "Mangala Sector",
    state: "Rajasthan",
    basin: "Barmer Basin",
    regionId: "barmer-basin",
    isDemo: true,
  },
  {
    id: "MGL-DEMO-02",
    name: "Demo Well — Mangala Offset",
    type: "offset",
    latitude: 25.7800,
    longitude: 71.4500,
    status: "critical",
    distanceKm: 4.6,
    depthM: 2040,
    formation: "FATEHGARH SANDSTONE",
    formationInterval: "1,620–2,040 m",
    riskScore: 82,
    historicalMatch: 87,
    events: [
      { depthM: 1840, event: "Severe Loss of Circulation (240 bbl)", severity: "critical" },
      { depthM: 2010, event: "Differential Sticking Incident", severity: "high" },
    ],
    similarWells: [
      { id: "BMR-DEMO-01", name: "BMR-DEMO-01", matchPercent: 87 },
    ],
    recommendedAction: "Pre-treat with sized calcium carbonate bridging agents before penetrating depleted sand interval.",
    leaseBlock: "RJ-ON-90/1",
    field: "Bhagyam Trend",
    state: "Rajasthan",
    basin: "Barmer Basin",
    regionId: "barmer-basin",
    isDemo: true,
  },

  // ==========================================================================
  // 4. ANDHRA PRADESH / KRISHNA-GODAVARI BASIN DEMO WELLS
  // ==========================================================================
  {
    id: "KGD-DEMO-01",
    name: "Demo Well — KG Basin Target",
    type: "active",
    latitude: 16.4800,
    longitude: 82.2800,
    status: "active",
    distanceKm: 0,
    depthM: 4150,
    formation: "PLIOCENE DEEPWATER CHANNEL",
    formationInterval: "3,800–4,150 m",
    riskScore: 76,
    historicalMatch: 86,
    events: [
      { depthM: 3910, event: "Shallow Gas Flow Detected at Mudline", severity: "high" },
      { depthM: 4080, event: "Abnormal Pressure Ramp (+1.8 ppg)", severity: "high" },
    ],
    similarWells: [
      { id: "KG-OFF-DEMO", name: "KG-OFF-DEMO", matchPercent: 85 },
    ],
    recommendedAction: "Execute dual-gradient mud weight monitoring and staged choke ramp.",
    leaseBlock: "KG-DWN-98/3",
    field: "D6 Deepwater Complex",
    state: "Andhra Pradesh",
    basin: "Krishna-Godavari Basin",
    regionId: "kg-basin",
    isDemo: true,
  },
  {
    id: "KG-OFF-DEMO",
    name: "Demo Well — KG Deepwater Offset",
    type: "offset",
    latitude: 16.4200,
    longitude: 82.3500,
    status: "warning",
    distanceKm: 9.8,
    depthM: 4320,
    formation: "MIOCENE TURBIDITE",
    formationInterval: "3,950–4,320 m",
    riskScore: 64,
    historicalMatch: 85,
    events: [
      { depthM: 4120, event: "Narrow Drilling Margin (Mud Weight vs Pore Pressure)", severity: "medium" },
    ],
    similarWells: [
      { id: "KGD-DEMO-01", name: "KGD-DEMO-01", matchPercent: 85 },
    ],
    recommendedAction: "Maintain MPD (Managed Pressure Drilling) surface backpressure envelope within ±25 psi.",
    leaseBlock: "KG-DWN-98/2",
    field: "Ravva Offshore",
    state: "Andhra Pradesh",
    basin: "Krishna-Godavari Basin",
    regionId: "kg-basin",
    isDemo: true,
  },

  // ==========================================================================
  // 5. TAMIL NADU / CAUVERY BASIN DEMO WELLS
  // ==========================================================================
  {
    id: "CAV-DEMO-01",
    name: "Demo Well — Cauvery Basin Target",
    type: "active",
    latitude: 10.8800,
    longitude: 79.8200,
    status: "active",
    distanceKm: 0,
    depthM: 3420,
    formation: "BHUVANAGIRI SANDSTONE",
    formationInterval: "3,100–3,420 m",
    riskScore: 59,
    historicalMatch: 83,
    events: [
      { depthM: 3200, event: "Minor Loss into Fractured Limestone", severity: "medium" },
    ],
    similarWells: [],
    recommendedAction: "Control ECD while circulating through tight limestone intercalations.",
    leaseBlock: "CY-ONN-2002/1",
    field: "Narimanam Field",
    state: "Tamil Nadu",
    basin: "Cauvery Basin",
    regionId: "cauvery-basin",
    isDemo: true,
  },

  // ==========================================================================
  // 6. MAHARASHTRA / MUMBAI OFFSHORE DEMO WELLS
  // ==========================================================================
  {
    id: "MUM-DEMO-01",
    name: "Demo Well — Mumbai Offshore Target",
    type: "active",
    latitude: 19.3800,
    longitude: 71.3500,
    status: "active",
    distanceKm: 0,
    depthM: 2150,
    formation: "L-III CARBONATE RESERVOIR",
    formationInterval: "1,850–2,150 m",
    riskScore: 65,
    historicalMatch: 91,
    events: [
      { depthM: 1950, event: "Total Loss in Vugular Limestone", severity: "high" },
      { depthM: 2100, event: "H2S Sour Gas Trace Detected (4 ppm)", severity: "medium" },
    ],
    similarWells: [],
    recommendedAction: "Equip rig crew with personal H2S detectors and circulate scavenging chemical treatment.",
    leaseBlock: "MH-OFF-01",
    field: "Mumbai High North",
    state: "Maharashtra",
    basin: "Mumbai Offshore",
    regionId: "mumbai-offshore",
    isDemo: true,
  },

  // ==========================================================================
  // 7. MADHYA PRADESH / BHOPAL DEMO WELLS
  // ==========================================================================
  {
    id: "BHP-DEMO-01",
    name: "Demo Well — Bhopal Target",
    type: "active",
    latitude: 23.2599,
    longitude: 77.4126,
    status: "active",
    distanceKm: 0,
    depthM: 1650,
    formation: "VINDHYAN SANDSTONE",
    formationInterval: "1,200–1,650 m",
    riskScore: 45,
    historicalMatch: 88,
    events: [
      { depthM: 1350, event: "Abrasive Quartzite Interval Drilling", severity: "low" },
      { depthM: 1520, event: "Mild Lost Circulation into Fractured Bedrock", severity: "medium" },
    ],
    similarWells: [
      { id: "BHP-DEMO-02", name: "BHP-DEMO-02", matchPercent: 86 },
    ],
    recommendedAction: "Select PDC cutters with enhanced thermal stability for abrasive Vindhyan quartzites.",
    leaseBlock: "DEMO-MP-BHP-01",
    field: "Bhopal Demo Sector",
    state: "Madhya Pradesh",
    regionId: "bhopal-city",
    isDemo: true,
  },
  {
    id: "BHP-DEMO-02",
    name: "Demo Well — Bhopal East Offset",
    type: "offset",
    latitude: 23.2750,
    longitude: 77.4450,
    status: "historical",
    distanceKm: 3.8,
    depthM: 1820,
    formation: "BHANDER GROUP",
    formationInterval: "1,300–1,820 m",
    riskScore: 32,
    historicalMatch: 86,
    events: [
      { depthM: 1480, event: "Stable Core Recovery (98%)", severity: "low" },
    ],
    similarWells: [
      { id: "BHP-DEMO-01", name: "BHP-DEMO-01", matchPercent: 86 },
    ],
    recommendedAction: "Use offset stratigraphic log for geophysical correlation across central Vindhyan basin.",
    leaseBlock: "DEMO-MP-BHP-01",
    field: "Bhopal Demo Sector",
    state: "Madhya Pradesh",
    regionId: "bhopal-city",
    isDemo: true,
  },

  // ==========================================================================
  // 8. MADHYA PRADESH / INDORE DEMO WELLS
  // ==========================================================================
  {
    id: "IND-DEMO-01",
    name: "Demo Well — Indore Target",
    type: "active",
    latitude: 22.7196,
    longitude: 75.8577,
    status: "active",
    distanceKm: 0,
    depthM: 1420,
    formation: "DECCAN TRAP BASALT",
    formationInterval: "850–1,420 m",
    riskScore: 52,
    historicalMatch: 85,
    events: [
      { depthM: 950, event: "Severe Vibrations in Hard Basalt Flow", severity: "medium" },
      { depthM: 1200, event: "Bit Ring-out & Wear Encountered", severity: "medium" },
    ],
    similarWells: [
      { id: "IND-DEMO-02", name: "IND-DEMO-02", matchPercent: 84 },
    ],
    recommendedAction: "Employ hybrid roller-cone / diamond impregnated bit to suppress torsional stick-slip vibrations.",
    leaseBlock: "DEMO-MP-IND-01",
    field: "Indore Demo Sector",
    state: "Madhya Pradesh",
    regionId: "indore-city",
    isDemo: true,
  },
  {
    id: "IND-DEMO-02",
    name: "Demo Well — Indore Pithampur Offset",
    type: "offset",
    latitude: 22.6850,
    longitude: 75.7900,
    status: "warning",
    distanceKm: 7.9,
    depthM: 1580,
    formation: "INTERTRAPPEAN CLAY BED",
    formationInterval: "1,100–1,580 m",
    riskScore: 61,
    historicalMatch: 84,
    events: [
      { depthM: 1250, event: "Borehole Sloughing in Intertrappean Sediment", severity: "medium" },
      { depthM: 1420, event: "Partial Mud Losses (45 bbl)", severity: "medium" },
    ],
    similarWells: [
      { id: "IND-DEMO-01", name: "IND-DEMO-01", matchPercent: 84 },
    ],
    recommendedAction: "Weight up mud slightly (+0.4 ppg) when transitioning from competent basalt into soft intertrappeans.",
    leaseBlock: "DEMO-MP-IND-01",
    field: "Indore Demo Sector",
    state: "Madhya Pradesh",
    regionId: "indore-city",
    isDemo: true,
  },
];

/**
 * Filter wells by location id, state name, or basin name.
 * If locationId is "india", returns all demo wells across the country.
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

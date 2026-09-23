/**
 * WellWise — Centralized Geographic Location Hierarchy for Real India Well Intelligence
 * Filtered strictly to verified petroleum basins from real_india_wells.json:
 * - Upper Assam Basin (Baghjan, Balimara, Lakwagaon, Dumduma, Naharkatiya)
 * - Cambay Basin (Ankleshwar)
 */

export type LocationType = "country" | "state" | "basin" | "city";

export interface LocationNode {
  id: string;
  name: string;
  type: LocationType;
  parentId?: string; // id of parent node
  stateName?: string;
  basinName?: string;
  cityName?: string;
  coordinates: [number, number]; // [longitude, latitude] for MapLibre
  zoom: number;
  description: string;
  hasDemoData: boolean;
  defaultWellId?: string;
}

export const INDIA_LOCATIONS: LocationNode[] = [
  // 1. National Level
  {
    id: "india",
    name: "India (National Overview)",
    type: "country",
    coordinates: [85.0000, 24.5000],
    zoom: 5.2,
    description: "Subcontinent overview of Indian verified oil & gas provinces (Upper Assam & Cambay Basins)",
    hasDemoData: true,
    defaultWellId: "OIL-BGN-05",
  },

  // 2. Assam & Upper Assam Basin
  {
    id: "assam-state",
    name: "Assam",
    type: "state",
    parentId: "india",
    stateName: "Assam",
    coordinates: [94.5000, 26.8000],
    zoom: 7.6,
    description: "Northeast India primary hydrocarbon province (OIL operational zone)",
    hasDemoData: true,
    defaultWellId: "OIL-BGN-05",
  },
  {
    id: "assam-basin",
    name: "Upper Assam Basin",
    type: "basin",
    parentId: "assam-state",
    stateName: "Assam",
    basinName: "Upper Assam Basin",
    coordinates: [95.38042, 27.59626],
    zoom: 10.4,
    description: "Upper Assam Shelf (Baghjan, Balimara, Lakwagaon, Dumduma fields)",
    hasDemoData: true,
    defaultWellId: "OIL-BGN-05",
  },

  // 3. Gujarat & Cambay Basin
  {
    id: "gujarat-state",
    name: "Gujarat",
    type: "state",
    parentId: "india",
    stateName: "Gujarat",
    coordinates: [72.2000, 22.0000],
    zoom: 7.2,
    description: "Western onshore petroleum province (ONGC operational zone)",
    hasDemoData: true,
    defaultWellId: "ONGC-ANK-14",
  },
  {
    id: "cambay-basin",
    name: "Cambay Basin",
    type: "basin",
    parentId: "gujarat-state",
    stateName: "Gujarat",
    basinName: "Cambay Basin",
    coordinates: [73.0120, 21.6250],
    zoom: 10.0,
    description: "Cambay Tertiary rift basin (Ankleshwar Field)",
    hasDemoData: true,
    defaultWellId: "ONGC-ANK-14",
  },
];

// Default to Upper Assam Basin where active verified well OIL-BGN-05 is situated
export const DEFAULT_LOCATION = INDIA_LOCATIONS[2]; // Upper Assam Basin


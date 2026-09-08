/**
 * WellWise — Centralized Geographic Location Hierarchy for India-Centric Intelligence
 * Supports National, State, Basin, and City levels.
 * Provides coordinates, zoom thresholds, and regional metadata for MapLibre camera control.
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
    coordinates: [78.9629, 22.0000],
    zoom: 4.6,
    description: "Subcontinent overview of Indian onshore & offshore sedimentary basins",
    hasDemoData: true,
  },

  // 2. Assam & Assam Basin
  {
    id: "assam-state",
    name: "Assam",
    type: "state",
    parentId: "india",
    stateName: "Assam",
    coordinates: [93.5000, 26.3000],
    zoom: 7.2,
    description: "Northeast India primary hydrocarbon province",
    hasDemoData: true,
  },
  {
    id: "assam-basin",
    name: "Assam Basin",
    type: "basin",
    parentId: "assam-state",
    stateName: "Assam",
    basinName: "Upper Assam Basin",
    coordinates: [95.3600, 27.4700],
    zoom: 10.2,
    description: "Upper Assam Shelf (Nahorkatiya, Duliajan, Moran fields)",
    hasDemoData: true,
    defaultWellId: "NHK-124",
  },

  // 3. Gujarat & Cambay Basin
  {
    id: "gujarat-state",
    name: "Gujarat",
    type: "state",
    parentId: "india",
    stateName: "Gujarat",
    coordinates: [71.8000, 22.2500],
    zoom: 7.0,
    description: "Western onshore & shallow offshore petroleum province",
    hasDemoData: true,
  },
  {
    id: "cambay-basin",
    name: "Cambay Basin",
    type: "basin",
    parentId: "gujarat-state",
    stateName: "Gujarat",
    basinName: "Cambay Basin",
    coordinates: [72.8500, 21.7200],
    zoom: 9.8,
    description: "Tertiary rift basin (Ankleshwar, Mehsana, Gandhar fields)",
    hasDemoData: true,
    defaultWellId: "CAM-DEMO-01",
  },

  // 4. Rajasthan & Barmer Basin
  {
    id: "rajasthan-state",
    name: "Rajasthan",
    type: "state",
    parentId: "india",
    stateName: "Rajasthan",
    coordinates: [72.5000, 26.5000],
    zoom: 6.8,
    description: "Northwestern desert onshore hydrocarbon province",
    hasDemoData: true,
  },
  {
    id: "barmer-basin",
    name: "Rajasthan / Barmer",
    type: "basin",
    parentId: "rajasthan-state",
    stateName: "Rajasthan",
    basinName: "Barmer Basin",
    coordinates: [71.4200, 25.7500],
    zoom: 9.6,
    description: "Barmer-Sanchor rift basin (Mangala, Bhagyam, Aishwariya fields)",
    hasDemoData: true,
    defaultWellId: "BMR-DEMO-01",
  },

  // 5. Andhra Pradesh & Krishna-Godavari Basin
  {
    id: "ap-state",
    name: "Andhra Pradesh",
    type: "state",
    parentId: "india",
    stateName: "Andhra Pradesh",
    coordinates: [81.5000, 16.5000],
    zoom: 7.0,
    description: "Eastern continental margin deepwater & shelf province",
    hasDemoData: true,
  },
  {
    id: "kg-basin",
    name: "Krishna-Godavari Basin",
    type: "basin",
    parentId: "ap-state",
    stateName: "Andhra Pradesh",
    basinName: "Krishna-Godavari Basin",
    coordinates: [82.2800, 16.4800],
    zoom: 9.5,
    description: "KG deepwater & deltaic petroleum system (KG-D6, Ravva fields)",
    hasDemoData: true,
    defaultWellId: "KGD-DEMO-01",
  },

  // 6. Tamil Nadu & Cauvery Basin
  {
    id: "tn-state",
    name: "Tamil Nadu",
    type: "state",
    parentId: "india",
    stateName: "Tamil Nadu",
    coordinates: [79.2000, 11.0000],
    zoom: 7.2,
    description: "Southern peri-cratonic passive margin basin",
    hasDemoData: true,
  },
  {
    id: "cauvery-basin",
    name: "Cauvery Basin",
    type: "basin",
    parentId: "tn-state",
    stateName: "Tamil Nadu",
    basinName: "Cauvery Basin",
    coordinates: [79.8200, 10.8800],
    zoom: 9.8,
    description: "Mesozoic-Tertiary coastal rift basin (Narimanam, Kamalapuram fields)",
    hasDemoData: true,
    defaultWellId: "CAV-DEMO-01",
  },

  // 7. Maharashtra & Mumbai Offshore
  {
    id: "maharashtra-state",
    name: "Maharashtra",
    type: "state",
    parentId: "india",
    stateName: "Maharashtra",
    coordinates: [73.5000, 19.2000],
    zoom: 7.0,
    description: "Western offshore continental shelf province",
    hasDemoData: true,
  },
  {
    id: "mumbai-offshore",
    name: "Mumbai Offshore",
    type: "basin",
    parentId: "maharashtra-state",
    stateName: "Maharashtra",
    basinName: "Mumbai Offshore Basin",
    coordinates: [71.3500, 19.3800],
    zoom: 9.2,
    description: "Western continental shelf carbonate reservoir complex (Mumbai High)",
    hasDemoData: true,
    defaultWellId: "MUM-DEMO-01",
  },

  // 8. Madhya Pradesh (Bhopal & Indore)
  {
    id: "mp-state",
    name: "Madhya Pradesh",
    type: "state",
    parentId: "india",
    stateName: "Madhya Pradesh",
    coordinates: [77.4000, 23.0000],
    zoom: 7.0,
    description: "Central India demonstration region & Vindhyan geological context",
    hasDemoData: true,
  },
  {
    id: "bhopal-city",
    name: "Bhopal",
    type: "city",
    parentId: "mp-state",
    stateName: "Madhya Pradesh",
    cityName: "Bhopal",
    coordinates: [77.4126, 23.2599],
    zoom: 11.2,
    description: "Bhopal demonstration sector — synthetic monitoring area",
    hasDemoData: true,
    defaultWellId: "BHP-DEMO-01",
  },
  {
    id: "indore-city",
    name: "Indore",
    type: "city",
    parentId: "mp-state",
    stateName: "Madhya Pradesh",
    cityName: "Indore",
    coordinates: [75.8577, 22.7196],
    zoom: 11.2,
    description: "Indore demonstration sector — synthetic monitoring area",
    hasDemoData: true,
    defaultWellId: "IND-DEMO-01",
  },
];

export const DEFAULT_LOCATION = INDIA_LOCATIONS[0]; // India (National Overview)

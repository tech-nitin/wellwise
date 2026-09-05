/**
 * GIS & Map constants for Oil India Limited (OIL) operational fields.
 */

export interface MapCoordinates {
  longitude: number;
  latitude: number;
}

// Operational hub: Oil India Limited Headquarters, Duliajan, Assam
export const DEFAULT_OIL_BASIN_CENTER: MapCoordinates = {
  longitude: 95.3218,
  latitude: 27.3582,
};

export const DEFAULT_MAP_ZOOM = 11;

export const OFFSET_WELL_RADIUS_OPTIONS = [
  { label: "1.0 km", value: 1000 },
  { label: "3.0 km", value: 3000 },
  { label: "5.0 km", value: 5000 },
  { label: "10.0 km", value: 10000 },
] as const;

/**
 * Calculates Haversine distance in kilometers between two geo-coordinates.
 */
export function calculateDistanceKm(
  coord1: MapCoordinates,
  coord2: MapCoordinates
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.latitude * Math.PI) / 180) *
      Math.cos((coord2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

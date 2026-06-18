const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Haversine distance between two lat/lon points in kilometers.
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Bearing from point 1 to point 2 in degrees from north (0-360).
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/**
 * Elevation angle from ground distance and altitude difference.
 * Returns degrees above the horizon.
 */
export function calculateElevationAngle(
  distanceKm: number,
  altitudeMeters: number,
  userAltitudeMeters: number
): number {
  const altDiff = altitudeMeters - userAltitudeMeters;
  const distanceMeters = distanceKm * 1000;
  return toDeg(Math.atan2(altDiff, distanceMeters));
}

/**
 * Convert feet to meters.
 */
export function feetToMeters(feet: number): number {
  return feet * 0.3048;
}

/**
 * Convert knots to km/h.
 */
export function knotsToKmh(knots: number): number {
  return knots * 1.852;
}

/**
 * Convert km to nautical miles.
 */
export function kmToNm(km: number): number {
  return km / 1.852;
}

/**
 * Convert nautical miles to km.
 */
export function nmToKm(nm: number): number {
  return nm * 1.852;
}

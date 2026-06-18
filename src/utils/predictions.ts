import { calculateBearing, haversineDistance, knotsToKmh } from './geo';

export interface IncomingPrediction {
  /** Minutes until aircraft enters the radius */
  etaMinutes: number;
  /** Component of velocity toward user in km/h */
  approachSpeed: number;
  /** Cardinal direction the aircraft is coming from */
  direction: string;
}

/**
 * Predict if an aircraft will enter the user's radius.
 * Returns null if the aircraft is not approaching.
 */
export function predictIncoming(
  userLat: number,
  userLon: number,
  acLat: number,
  acLon: number,
  acTrack: number,
  acSpeedKnots: number,
  radiusKm: number
): IncomingPrediction | null {
  const distance = haversineDistance(userLat, userLon, acLat, acLon);
  const bearingToUser = calculateBearing(acLat, acLon, userLat, userLon);

  // Component of velocity toward user
  const angleDiff = toRad(acTrack - bearingToUser);
  const speedKmh = knotsToKmh(acSpeedKnots);
  const approachSpeed = speedKmh * Math.cos(angleDiff);

  // Only show if actively approaching
  if (approachSpeed <= 0) return null;

  const distanceToEdge = distance - radiusKm;
  if (distanceToEdge <= 0) return null;

  const etaHours = distanceToEdge / approachSpeed;
  const etaMinutes = etaHours * 60;

  // Only show if ETA is within 30 minutes
  if (etaMinutes > 30) return null;

  const direction = bearingToCardinal(bearingToUser);

  return { etaMinutes, approachSpeed, direction };
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function bearingToCardinal(bearing: number): string {
  const arrows = ['↓', '↙', '←', '↖', '↑', '↗', '→', '↘'];
  const index = Math.round(bearing / 45) % 8;
  return arrows[index];
}

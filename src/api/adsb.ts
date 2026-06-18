import { Platform } from 'react-native';

// On web, route through the dev proxy to avoid CORS.
// On native, hit the API directly — no CORS restrictions.
const BASE_URL =
  Platform.OS === 'web' ? 'http://localhost:3001/api' : 'https://api.adsb.lol';

export interface Aircraft {
  hex: string;
  flight?: string;
  t?: string;
  desc?: string;
  ownOp?: string;
  category?: string;
  lat?: number;
  lon?: number;
  alt_baro?: number | 'ground';
  alt_geom?: number;
  gs?: number;
  track?: number;
  baro_rate?: number;
  nav_altitude_mcp?: number;
  nav_heading?: number;
  seen?: number;
  seen_pos?: number;
}

interface ADSBResponse {
  ac: Aircraft[] | null;
  msg: string;
  now: number;
  total: number;
  ctime: number;
  ptime: number;
}

/**
 * Fetch aircraft near a position within a given radius in nautical miles.
 */
export async function fetchNearbyAircraft(
  lat: number,
  lon: number,
  distNm: number
): Promise<Aircraft[]> {
  const url = `${BASE_URL}/v2/lat/${lat.toFixed(6)}/lon/${lon.toFixed(6)}/dist/${distNm}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`ADSB.lol API error: ${res.status}`);
  }
  const data: ADSBResponse = await res.json();
  return (data.ac ?? []).filter(
    (ac) => ac.lat != null && ac.lon != null
  );
}

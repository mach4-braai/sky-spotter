import { useCallback, useEffect, useRef, useState } from 'react';
import { Aircraft, fetchNearbyAircraft } from '../api/adsb';
import { haversineDistance, kmToNm } from '../utils/geo';
import { predictIncoming, IncomingPrediction } from '../utils/predictions';
import { UserLocation } from './useLocation';

export interface IncomingAircraft extends Aircraft {
  distanceKm: number;
  prediction: IncomingPrediction;
}

const POLL_INTERVAL = 15_000;
// Look for incoming flights up to 2x the user's radius
const SCAN_MULTIPLIER = 2;

export function useIncomingFlights(
  location: UserLocation | null,
  radiusKm: number
) {
  const [flights, setFlights] = useState<IncomingAircraft[]>([]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchFlights = useCallback(async () => {
    if (!location) return;

    try {
      setLoading(true);
      const scanRadius = radiusKm * SCAN_MULTIPLIER;
      const distNm = Math.ceil(kmToNm(scanRadius));
      const aircraft = await fetchNearbyAircraft(
        location.latitude,
        location.longitude,
        distNm
      );

      const incoming: IncomingAircraft[] = [];

      for (const ac of aircraft) {
        if (ac.lat == null || ac.lon == null || ac.track == null || ac.gs == null)
          continue;

        const dist = haversineDistance(
          location.latitude,
          location.longitude,
          ac.lat,
          ac.lon
        );

        // Skip aircraft already within radius
        if (dist <= radiusKm) continue;

        const prediction = predictIncoming(
          location.latitude,
          location.longitude,
          ac.lat,
          ac.lon,
          ac.track,
          ac.gs,
          radiusKm
        );

        if (prediction) {
          incoming.push({ ...ac, distanceKm: dist, prediction });
        }
      }

      incoming.sort((a, b) => a.prediction.etaMinutes - b.prediction.etaMinutes);
      setFlights(incoming);
    } catch {
      // Silent fail — incoming is supplementary
    } finally {
      setLoading(false);
    }
  }, [location, radiusKm]);

  useEffect(() => {
    fetchFlights();
    intervalRef.current = setInterval(fetchFlights, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchFlights]);

  return { flights, loading };
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { Aircraft, fetchNearbyAircraft } from '../api/adsb';
import { haversineDistance, kmToNm } from '../utils/geo';
import { UserLocation } from './useLocation';

export interface NearbyAircraft extends Aircraft {
  distanceKm: number;
}

const POLL_INTERVAL = 10_000;

export function useNearbyFlights(
  location: UserLocation | null,
  radiusKm: number
) {
  const [flights, setFlights] = useState<NearbyAircraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchFlights = useCallback(async () => {
    if (!location) return;

    try {
      setLoading(true);
      const distNm = Math.ceil(kmToNm(radiusKm));
      const aircraft = await fetchNearbyAircraft(
        location.latitude,
        location.longitude,
        distNm
      );

      const nearby = aircraft
        .map((ac) => ({
          ...ac,
          distanceKm: haversineDistance(
            location.latitude,
            location.longitude,
            ac.lat!,
            ac.lon!
          ),
        }))
        .filter((ac) => ac.distanceKm <= radiusKm)
        .sort((a, b) => a.distanceKm - b.distanceKm);

      setFlights(nearby);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch flights');
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

  return { flights, loading, error, refresh: fetchFlights };
}

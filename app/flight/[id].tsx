import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useLocation } from '@/src/hooks/useLocation';
import { useCompassPointer } from '@/src/hooks/useCompassPointer';
import { CompassArrow } from '@/src/components/CompassArrow';
import { FlightDetails } from '@/src/components/FlightDetails';
import { useSettings } from '@/src/store/settings';
import { calculateBearing, calculateElevationAngle, feetToMeters } from '@/src/utils/geo';
import type { Aircraft } from '@/src/api/adsb';

export default function FlightPointerScreen() {
  const params = useLocalSearchParams<{
    id: string;
    lat: string;
    lon: string;
    distanceKm: string;
    flight: string;
    alt: string;
    gs: string;
    track: string;
    t: string;
    desc: string;
    ownOp: string;
    category: string;
    baro_rate: string;
  }>();

  const { location } = useLocation();
  const { settings } = useSettings();

  const acLat = Number(params.lat);
  const acLon = Number(params.lon);
  const distanceKm = Number(params.distanceKm);
  const altBaro = params.alt && params.alt !== '' ? Number(params.alt) : undefined;

  const bearing = location
    ? calculateBearing(location.latitude, location.longitude, acLat, acLon)
    : 0;

  const { relativeBearing, available: compassAvailable } = useCompassPointer(bearing);

  const userAltitude = location?.altitude ?? 0;
  const acAltMeters = altBaro != null ? feetToMeters(altBaro) : 0;
  const elevationAngle = calculateElevationAngle(distanceKm, acAltMeters, userAltitude);

  const callsign = params.flight?.trim() || params.id.toUpperCase();

  const aircraft: Aircraft = {
    hex: params.id,
    flight: params.flight || undefined,
    t: params.t || undefined,
    desc: params.desc || undefined,
    ownOp: params.ownOp || undefined,
    category: params.category || undefined,
    lat: acLat,
    lon: acLon,
    alt_baro: altBaro,
    gs: params.gs ? Number(params.gs) : undefined,
    track: params.track ? Number(params.track) : undefined,
    baro_rate: params.baro_rate ? Number(params.baro_rate) : undefined,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pointerSection}>
        <Text style={styles.callsign}>{callsign}</Text>

        <View style={styles.compassContainer}>
          {compassAvailable ? (
            <CompassArrow rotation={relativeBearing} size={140} />
          ) : (
            <View style={styles.fallback}>
              <Text style={styles.fallbackBearing}>{Math.round(bearing)}°</Text>
              <Text style={styles.fallbackLabel}>bearing</Text>
            </View>
          )}
        </View>

        <View style={styles.elevationRow}>
          <Text style={styles.elevationLabel}>Look up</Text>
          <Text style={styles.elevationValue}>{elevationAngle.toFixed(1)}°</Text>
        </View>
      </View>

      <FlightDetails
        aircraft={aircraft}
        distanceKm={distanceKm}
        elevationAngle={elevationAngle}
        units={settings.units}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  pointerSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  callsign: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e0e0ff',
    marginBottom: 32,
  },
  compassContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#2a2a4e',
    backgroundColor: '#0f0f25',
  },
  fallback: {
    alignItems: 'center',
  },
  fallbackBearing: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4488ff',
  },
  fallbackLabel: {
    fontSize: 14,
    color: '#6666aa',
    marginTop: 4,
  },
  elevationRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 24,
  },
  elevationLabel: {
    fontSize: 14,
    color: '#8888cc',
  },
  elevationValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#e0e0ff',
  },
});

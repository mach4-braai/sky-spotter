import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NearbyAircraft } from '../hooks/useNearbyFlights';
import { feetToMeters } from '../utils/geo';
import type { Units } from '../store/settings';

interface Props {
  aircraft: NearbyAircraft;
  units: Units;
  onPress: () => void;
}

export function FlightCard({ aircraft, units, onPress }: Props) {
  const callsign = aircraft.flight?.trim() || aircraft.hex.toUpperCase();
  const altitude = formatAltitude(aircraft.alt_baro, units);
  const speed = formatSpeed(aircraft.gs, units);
  const distance = formatDistance(aircraft.distanceKm, units);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.callsign}>{callsign}</Text>
        <Text style={styles.distance}>{distance}</Text>
      </View>
      <View style={styles.details}>
        {aircraft.desc ? (
          <Text style={styles.detail}>{aircraft.desc}</Text>
        ) : aircraft.t ? (
          <Text style={styles.detail}>{aircraft.t}</Text>
        ) : null}
        <Text style={styles.detail}>{altitude}</Text>
        <Text style={styles.detail}>{speed}</Text>
      </View>
      {aircraft.ownOp && <Text style={styles.operator}>{aircraft.ownOp}</Text>}
    </Pressable>
  );
}

function formatAltitude(alt: number | 'ground' | undefined, units: Units): string {
  if (alt === 'ground') return 'On ground';
  if (alt == null) return 'Alt unknown';
  if (units === 'metric') return `${Math.round(feetToMeters(alt))}m`;
  return `${alt.toLocaleString()}ft`;
}

function formatSpeed(gs: number | undefined, units: Units): string {
  if (gs == null) return '';
  if (units === 'metric') return `${Math.round(gs * 1.852)} km/h`;
  return `${Math.round(gs)} kts`;
}

function formatDistance(km: number, units: Units): string {
  if (units === 'metric') return `${km.toFixed(1)} km`;
  return `${(km * 0.621371).toFixed(1)} mi`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#2a2a4e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  callsign: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e0e0ff',
  },
  distance: {
    fontSize: 14,
    color: '#8888cc',
    fontWeight: '600',
  },
  details: {
    flexDirection: 'row',
    gap: 12,
  },
  detail: {
    fontSize: 13,
    color: '#9999bb',
  },
  operator: {
    fontSize: 12,
    color: '#666688',
    marginTop: 4,
  },
});

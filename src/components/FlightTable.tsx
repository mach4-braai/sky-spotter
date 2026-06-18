import { StyleSheet, Text, View } from 'react-native';
import { IncomingAircraft } from '../hooks/useIncomingFlights';
import type { Units } from '../store/settings';
import { feetToMeters } from '../utils/geo';

interface Props {
  flights: IncomingAircraft[];
  units: Units;
}

export function FlightTable({ flights, units }: Props) {
  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.callsignCol]}>Flight</Text>
        <Text style={[styles.headerCell, styles.dirCol]}>From</Text>
        <Text style={[styles.headerCell, styles.altCol]}>Alt</Text>
        <Text style={[styles.headerCell, styles.etaCol]}>ETA</Text>
      </View>
      {flights.map((ac) => (
        <View key={ac.hex} style={styles.row}>
          <Text style={[styles.cell, styles.callsignCol]}>
            {ac.flight?.trim() || ac.hex.toUpperCase()}
          </Text>
          <Text style={[styles.cell, styles.dirCol]}>
            {ac.prediction.direction}
          </Text>
          <Text style={[styles.cell, styles.altCol]}>
            {formatAlt(ac.alt_baro, units)}
          </Text>
          <Text style={[styles.cell, styles.etaCol]}>
            {formatEta(ac.prediction.etaMinutes)}
          </Text>
        </View>
      ))}
    </View>
  );
}

function formatAlt(alt: number | 'ground' | undefined, units: Units): string {
  if (alt === 'ground' || alt == null) return '—';
  if (units === 'metric') return `${Math.round(feetToMeters(alt))}m`;
  return `${(alt / 1000).toFixed(1)}k`;
}

function formatEta(minutes: number): string {
  if (minutes < 1) return '<1 min';
  return `${Math.round(minutes)} min`;
}

const styles = StyleSheet.create({
  table: {
    marginHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4e',
    paddingBottom: 8,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1a1a2e',
  },
  headerCell: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6666aa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cell: {
    fontSize: 14,
    color: '#ccccee',
  },
  callsignCol: { flex: 2 },
  dirCol: { flex: 1, textAlign: 'center' },
  altCol: { flex: 1, textAlign: 'right' },
  etaCol: { flex: 1, textAlign: 'right' },
});

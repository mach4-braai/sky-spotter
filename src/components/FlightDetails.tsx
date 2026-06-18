import { StyleSheet, Text, View } from 'react-native';
import type { Aircraft } from '../api/adsb';
import type { Units } from '../store/settings';
import { feetToMeters } from '../utils/geo';

interface Props {
  aircraft: Aircraft;
  distanceKm: number;
  elevationAngle: number;
  units: Units;
}

export function FlightDetails({ aircraft, distanceKm, elevationAngle, units }: Props) {
  const rows: [string, string][] = [];

  if (aircraft.flight?.trim()) rows.push(['Callsign', aircraft.flight.trim()]);
  rows.push(['ICAO', aircraft.hex.toUpperCase()]);
  if (aircraft.ownOp) rows.push(['Operator', aircraft.ownOp]);
  if (aircraft.desc) rows.push(['Aircraft', aircraft.desc]);
  else if (aircraft.t) rows.push(['Type', aircraft.t]);
  if (aircraft.category) rows.push(['Category', aircraft.category]);

  if (aircraft.alt_baro != null && aircraft.alt_baro !== 'ground') {
    rows.push([
      'Altitude',
      units === 'metric'
        ? `${Math.round(feetToMeters(aircraft.alt_baro))} m`
        : `${aircraft.alt_baro.toLocaleString()} ft`,
    ]);
  } else if (aircraft.alt_baro === 'ground') {
    rows.push(['Altitude', 'On ground']);
  }

  if (aircraft.gs != null) {
    rows.push([
      'Speed',
      units === 'metric'
        ? `${Math.round(aircraft.gs * 1.852)} km/h`
        : `${Math.round(aircraft.gs)} kts`,
    ]);
  }

  if (aircraft.track != null) rows.push(['Heading', `${Math.round(aircraft.track)}°`]);
  if (aircraft.baro_rate != null) rows.push(['Vertical Rate', `${aircraft.baro_rate} ft/min`]);

  rows.push([
    'Distance',
    units === 'metric'
      ? `${distanceKm.toFixed(1)} km`
      : `${(distanceKm * 0.621371).toFixed(1)} mi`,
  ]);

  rows.push(['Look Up', `${elevationAngle.toFixed(1)}° above horizon`]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flight Details</Text>
      {rows.map(([label, value]) => (
        <View key={label} style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e0e0ff',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2a2a4e',
  },
  label: {
    fontSize: 14,
    color: '#8888bb',
  },
  value: {
    fontSize: 14,
    color: '#ccccee',
    fontWeight: '500',
  },
});

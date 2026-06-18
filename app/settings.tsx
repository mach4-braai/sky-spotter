import { StyleSheet, Text, View, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import { useSettings } from '@/src/store/settings';

export default function SettingsScreen() {
  const { settings, updateRadius, updateUnits } = useSettings();

  const isImperial = settings.units === 'imperial';

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Search Radius</Text>
        <Text style={styles.value}>
          {settings.radiusKm} km
          {isImperial && ` (${(settings.radiusKm * 0.621371).toFixed(0)} mi)`}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={5}
          maximumValue={100}
          step={5}
          value={settings.radiusKm}
          onSlidingComplete={updateRadius}
          minimumTrackTintColor="#4488ff"
          maximumTrackTintColor="#2a2a4e"
          thumbTintColor="#4488ff"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>5 km</Text>
          <Text style={styles.sliderLabel}>100 km</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Units</Text>
        <View style={styles.toggleRow}>
          <Text style={[styles.unitLabel, !isImperial && styles.activeLabel]}>
            Metric
          </Text>
          <Switch
            value={isImperial}
            onValueChange={(val) => updateUnits(val ? 'imperial' : 'metric')}
            trackColor={{ false: '#4488ff', true: '#4488ff' }}
            thumbColor="#e0e0ff"
          />
          <Text style={[styles.unitLabel, isImperial && styles.activeLabel]}>
            Imperial
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Source</Text>
        <Text style={styles.infoText}>ADSB.lol</Text>
        <Text style={styles.infoSubtext}>
          Real-time ADS-B data, ODbL 1.0 license
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
    padding: 16,
  },
  section: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6666aa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e0e0ff',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666688',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  unitLabel: {
    fontSize: 16,
    color: '#666688',
  },
  activeLabel: {
    color: '#e0e0ff',
    fontWeight: '600',
  },
  infoText: {
    fontSize: 16,
    color: '#ccccee',
    fontWeight: '500',
  },
  infoSubtext: {
    fontSize: 13,
    color: '#666688',
    marginTop: 4,
  },
});

import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocation } from '@/src/hooks/useLocation';
import { useIncomingFlights } from '@/src/hooks/useIncomingFlights';
import { useSettings } from '@/src/store/settings';
import { FlightTable } from '@/src/components/FlightTable';

export default function IncomingScreen() {
  const { location } = useLocation();
  const { settings } = useSettings();
  const { flights, loading } = useIncomingFlights(location, settings.radiusKm);

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4488ff" />
        <Text style={styles.loadingText}>Acquiring location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Flights approaching within {settings.radiusKm} km
        </Text>
      </View>
      <ScrollView contentContainerStyle={flights.length === 0 ? styles.emptyScroll : undefined}>
        {flights.length > 0 ? (
          <FlightTable flights={flights} units={settings.units} />
        ) : loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#4488ff" />
          </View>
        ) : (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No incoming flights</Text>
            <Text style={styles.emptySubtext}>
              Aircraft heading your way will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1a1a2e',
  },
  headerText: {
    color: '#8888cc',
    fontSize: 13,
  },
  loadingText: {
    color: '#8888cc',
    fontSize: 14,
    marginTop: 12,
  },
  emptyText: {
    color: '#8888cc',
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#666688',
    fontSize: 14,
    marginTop: 8,
  },
  emptyScroll: {
    flex: 1,
  },
});

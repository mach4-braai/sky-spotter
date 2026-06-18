import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useLocation } from '@/src/hooks/useLocation';
import { useNearbyFlights } from '@/src/hooks/useNearbyFlights';
import { useSettings } from '@/src/store/settings';
import { FlightCard } from '@/src/components/FlightCard';

export default function NearbyScreen() {
  const router = useRouter();
  const { location, error: locationError } = useLocation();
  const { settings } = useSettings();
  const { flights, loading, error } = useNearbyFlights(location, settings.radiusKm);

  if (locationError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{locationError}</Text>
      </View>
    );
  }

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
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          {flights.length} aircraft within {settings.radiusKm} km
        </Text>
        <Link href="/settings" style={styles.settingsLink}>
          <Text style={styles.settingsText}>Settings</Text>
        </Link>
      </View>
      {error && <Text style={styles.errorBanner}>{error}</Text>}
      <FlatList
        data={flights}
        keyExtractor={(item) => item.hex}
        renderItem={({ item }) => (
          <FlightCard
            aircraft={item}
            units={settings.units}
            onPress={() =>
              router.push({
                pathname: '/flight/[id]',
                params: {
                  id: item.hex,
                  lat: String(item.lat),
                  lon: String(item.lon),
                  distanceKm: String(item.distanceKm),
                  flight: item.flight ?? '',
                  alt: String(item.alt_baro ?? ''),
                  gs: String(item.gs ?? ''),
                  track: String(item.track ?? ''),
                  t: item.t ?? '',
                  desc: item.desc ?? '',
                  ownOp: item.ownOp ?? '',
                  category: item.category ?? '',
                  baro_rate: String(item.baro_rate ?? ''),
                },
              })
            }
          />
        )}
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.center}>
              <Text style={styles.emptyText}>No aircraft nearby</Text>
              <Text style={styles.emptySubtext}>
                Try increasing the radius in settings
              </Text>
            </View>
          )
        }
        contentContainerStyle={flights.length === 0 ? styles.emptyList : undefined}
      />
      {loading && flights.length === 0 && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4488ff" />
        </View>
      )}
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
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1a1a2e',
  },
  statusText: {
    color: '#8888cc',
    fontSize: 13,
  },
  settingsLink: {
    padding: 4,
  },
  settingsText: {
    color: '#4488ff',
    fontSize: 13,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff6666',
    fontSize: 16,
    textAlign: 'center',
  },
  errorBanner: {
    color: '#ff6666',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 8,
    backgroundColor: '#1a0a0a',
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
  emptyList: {
    flex: 1,
  },
});

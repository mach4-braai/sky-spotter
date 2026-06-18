import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const KEYS = {
  RADIUS_KM: 'settings:radiusKm',
  UNITS: 'settings:units',
} as const;

export type Units = 'metric' | 'imperial';

export interface Settings {
  radiusKm: number;
  units: Units;
}

const DEFAULTS: Settings = {
  radiusKm: 15,
  units: 'metric',
};

interface SettingsContextValue {
  settings: Settings;
  loaded: boolean;
  updateRadius: (km: number) => Promise<void>;
  updateUnits: (units: Units) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [radiusStr, unitsStr] = await Promise.all([
        AsyncStorage.getItem(KEYS.RADIUS_KM),
        AsyncStorage.getItem(KEYS.UNITS),
      ]);
      setSettings({
        radiusKm: radiusStr ? Number(radiusStr) : DEFAULTS.radiusKm,
        units: (unitsStr as Units) ?? DEFAULTS.units,
      });
      setLoaded(true);
    })();
  }, []);

  const updateRadius = async (km: number) => {
    setSettings((s) => ({ ...s, radiusKm: km }));
    await AsyncStorage.setItem(KEYS.RADIUS_KM, String(km));
  };

  const updateUnits = async (units: Units) => {
    setSettings((s) => ({ ...s, units }));
    await AsyncStorage.setItem(KEYS.UNITS, units);
  };

  return (
    <SettingsContext.Provider value={{ settings, loaded, updateRadius, updateUnits }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

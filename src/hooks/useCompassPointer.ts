import { useEffect, useState } from 'react';
import { Magnetometer, Accelerometer } from 'expo-sensors';

interface CompassData {
  /** Device heading in degrees from north (0-360) */
  heading: number;
  /** Relative bearing to target: how many degrees to rotate the arrow */
  relativeBearing: number;
  /** Whether sensor data is available */
  available: boolean;
}

export function useCompassPointer(targetBearing: number): CompassData {
  const [heading, setHeading] = useState(0);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let magSub: ReturnType<typeof Magnetometer.addListener> | null = null;

    (async () => {
      const isAvailable = await Magnetometer.isAvailableAsync();
      setAvailable(isAvailable);
      if (!isAvailable) return;

      Magnetometer.setUpdateInterval(100);
      magSub = Magnetometer.addListener((data) => {
        // Calculate heading from magnetometer data
        let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        // Normalize to 0-360
        angle = (angle + 360) % 360;
        // Magnetometer gives angle from east, convert to north
        angle = (360 - angle + 90) % 360;
        setHeading(angle);
      });
    })();

    return () => {
      magSub?.remove();
    };
  }, []);

  // How far to rotate the arrow: target bearing minus where device is pointing
  const relativeBearing = ((targetBearing - heading) + 360) % 360;

  return { heading, relativeBearing, available };
}

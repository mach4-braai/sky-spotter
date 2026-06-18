import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useDerivedValue,
} from 'react-native-reanimated';

interface Props {
  /** Degrees to rotate the arrow (0 = pointing up / north) */
  rotation: number;
  size?: number;
}

export function CompassArrow({ rotation, size = 120 }: Props) {
  const smoothRotation = useDerivedValue(() => {
    return withSpring(rotation, {
      damping: 20,
      stiffness: 90,
      mass: 1,
    });
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${smoothRotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[{ width: size, height: size }, animatedStyle]}>
        <View style={[styles.arrow, { width: size, height: size }]}>
          <View
            style={[
              styles.arrowHead,
              {
                borderLeftWidth: size * 0.25,
                borderRightWidth: size * 0.25,
                borderBottomWidth: size * 0.5,
              },
            ]}
          />
          <View
            style={[
              styles.arrowTail,
              {
                width: size * 0.12,
                height: size * 0.35,
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#4488ff',
    borderStyle: 'solid',
  },
  arrowTail: {
    backgroundColor: '#4488ff',
    borderRadius: 2,
    marginTop: -2,
  },
});

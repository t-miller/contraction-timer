import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { useContractions } from '../context/ContractionContext';
import { useTheme } from '../context/ThemeContext';
import { formatDuration } from '../utils/formatting';

export function TimerButton() {
  const { state, startContraction, endContraction } = useContractions();
  const { colors } = useTheme();
  const [elapsed, setElapsed] = useState(0);
  const isActive = state.activeContraction !== null;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!state.activeContraction) {
      setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsed(Date.now() - state.activeContraction!.startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [state.activeContraction]);

  useEffect(() => {
    if (isActive) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isActive, pulseAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (isActive) {
      endContraction();
    } else {
      startContraction();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <View style={[styles.outerRing, { borderColor: isActive ? colors.danger : colors.success, opacity: 0.2 }]} />
        <Animated.View
          style={[
            styles.buttonWrapper,
            {
              transform: [
                { scale: Animated.multiply(pulseAnim, scaleAnim) },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isActive ? colors.danger : colors.success,
                boxShadow: `0 8px 16px ${isActive ? colors.danger : colors.success}59`,
              },
            ]}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
            testID="timer-button"
          >
            <Text style={styles.buttonText} testID="timer-button-text">
              {isActive ? 'STOP' : 'START'}
            </Text>
            {isActive && (
              <Text style={styles.timerText} testID="timer-elapsed">{formatDuration(elapsed)}</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
      <Text style={[styles.hint, { color: colors.textSecondary }]} testID="timer-hint">
        {isActive ? 'Tap when contraction ends' : 'Tap when contraction starts'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 32,
  },
  buttonContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
  },
  buttonWrapper: {
    width: 180,
    height: 180,
  },
  button: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 2,
  },
  timerText: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 32,
    fontWeight: '300',
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  hint: {
    marginTop: 24,
    fontSize: 15,
    fontWeight: '500',
  },
});

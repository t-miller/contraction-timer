import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useContractions } from '../context/ContractionContext';
import { useTheme } from '../context/ThemeContext';
import { formatDuration } from '../utils/formatting';

export function TimerButton() {
  const { state, startContraction, endContraction } = useContractions();
  const { colors } = useTheme();
  const [elapsed, setElapsed] = useState(0);
  const isActive = state.activeContraction !== null;

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

  const handlePress = () => {
    if (isActive) {
      endContraction();
    } else {
      startContraction();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: colors.success, shadowColor: colors.shadow },
          isActive && { backgroundColor: colors.danger },
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {isActive ? 'STOP' : 'START'}
        </Text>
        {isActive && (
          <Text style={styles.timerText}>{formatDuration(elapsed)}</Text>
        )}
      </TouchableOpacity>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        {isActive ? 'Tap when contraction ends' : 'Tap when contraction starts'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 24,
  },
  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 24,
    marginTop: 8,
  },
  hint: {
    marginTop: 16,
    fontSize: 16,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useContractions } from '../context/ContractionContext';
import { useTheme } from '../context/ThemeContext';
import { formatDuration } from '../utils/formatting';

export function Statistics() {
  const { state } = useContractions();
  const { colors } = useTheme();
  const completedContractions = state.contractions.filter((c) => c.endTime !== null);

  const calculateAverageDuration = (): number => {
    if (completedContractions.length === 0) return 0;
    const totalDuration = completedContractions.reduce(
      (sum, c) => sum + (c.endTime! - c.startTime),
      0
    );
    return totalDuration / completedContractions.length;
  };

  const calculateAverageInterval = (): number => {
    if (completedContractions.length < 2) return 0;
    let totalInterval = 0;
    let intervalCount = 0;
    for (let i = 0; i < completedContractions.length - 1; i++) {
      const current = completedContractions[i];
      const previous = completedContractions[i + 1];
      totalInterval += current.startTime - (previous.endTime || previous.startTime);
      intervalCount++;
    }
    return intervalCount > 0 ? totalInterval / intervalCount : 0;
  };

  const avgDuration = calculateAverageDuration();
  const avgInterval = calculateAverageInterval();

  if (completedContractions.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.statsBackground }]}>
      <View style={styles.stat}>
        <Text style={[styles.value, { color: colors.statsText }]}>{completedContractions.length}</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Contractions</Text>
      </View>
      <View style={styles.stat}>
        <Text style={[styles.value, { color: colors.statsText }]}>{formatDuration(avgDuration)}</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Avg Duration</Text>
      </View>
      {avgInterval > 0 && (
        <View style={styles.stat}>
          <Text style={[styles.value, { color: colors.statsText }]}>{formatDuration(avgInterval)}</Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Avg Interval</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});

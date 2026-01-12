import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useContractions } from '../context/ContractionContext';
import { useTheme } from '../context/ThemeContext';
import { formatDuration } from '../utils/formatting';

interface StatCardProps {
  value: string | number;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

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

  const calculateTotalDuration = (): number => {
    if (completedContractions.length === 0) return 0;
    const firstContraction = completedContractions[completedContractions.length - 1];
    const lastContraction = completedContractions[0];
    return lastContraction.endTime! - firstContraction.startTime;
  };

  const avgDuration = calculateAverageDuration();
  const avgInterval = calculateAverageInterval();
  const totalDuration = calculateTotalDuration();

  if (completedContractions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Statistics</Text>
      <View style={styles.cardsRow}>
        <StatCard
          value={formatDuration(totalDuration)}
          label="Total Time"
        />
        <StatCard
          value={formatDuration(avgDuration)}
          label="Avg Duration"
        />
        {avgInterval > 0 && (
          <StatCard
            value={formatDuration(avgInterval)}
            label="Avg Interval"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    gap: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});

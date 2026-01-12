import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useContractions } from '../context/ContractionContext';
import { useTheme } from '../context/ThemeContext';
import { formatDuration } from '../utils/formatting';

interface StatCardProps {
  value: string | number;
  label: string;
  icon: string;
}

function StatCard({ value, label, icon }: StatCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.statsBackground }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
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

  const avgDuration = calculateAverageDuration();
  const avgInterval = calculateAverageInterval();

  if (completedContractions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Statistics</Text>
      <View style={styles.cardsRow}>
        <StatCard
          value={completedContractions.length}
          label="Total"
          icon="📊"
        />
        <StatCard
          value={formatDuration(avgDuration)}
          label="Avg Duration"
          icon="⏱"
        />
        {avgInterval > 0 && (
          <StatCard
            value={formatDuration(avgInterval)}
            label="Avg Interval"
            icon="↔️"
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
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 18,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});

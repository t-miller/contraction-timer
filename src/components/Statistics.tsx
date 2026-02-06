import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useContractions } from '../context/ContractionContext';
import { useTheme } from '../context/ThemeContext';
import { useStatistics } from '../hooks';
import { formatDuration, formatDurationHoursMinutes } from '../utils/formatting';

interface StatCardProps {
  value: string | number;
  label: string;
  isHighlighted?: boolean;
}

function StatCard({ value, label, isHighlighted }: StatCardProps) {
  const { colors } = useTheme();

  const backgroundColor = isHighlighted ? '#22c55e' : colors.surface;
  const textColor = isHighlighted ? '#ffffff' : colors.text;
  const labelColor = isHighlighted ? 'rgba(255, 255, 255, 0.85)' : colors.textSecondary;

  const testIdLabel = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <View style={[styles.card, { backgroundColor, boxShadow: `0 2px 8px ${colors.cardShadow}` }]} testID={`stat-card-${testIdLabel}`}>
      <Text style={[styles.value, { color: textColor }]} testID={`stat-value-${testIdLabel}`}>{value}</Text>
      <Text style={[styles.label, { color: labelColor }]} testID={`stat-label-${testIdLabel}`}>{label}</Text>
    </View>
  );
}

export function Statistics() {
  const { state } = useContractions();
  const { colors } = useTheme();
  const stats = useStatistics(state.contractions);

  const completedCount = state.contractions.filter((c) => c.endTime !== null).length;
  const { averageDuration: avgDuration, averageInterval: avgInterval, totalDuration } = stats;

  // 5-1-1 rule thresholds
  const FIVE_MINUTES = 5 * 60 * 1000;
  const ONE_MINUTE = 60 * 1000;
  const ONE_HOUR = 60 * 60 * 1000;

  const isIntervalMet = avgInterval > 0 && avgInterval <= FIVE_MINUTES;
  const isDurationMet = avgDuration >= ONE_MINUTE;
  const isTotalTimeMet = totalDuration >= ONE_HOUR;

  if (completedCount === 0) {
    return null;
  }

  return (
    <View style={styles.container} testID="statistics-container">
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]} testID="statistics-title">Statistics</Text>
      <View style={styles.cardsRow}>
        {avgInterval > 0 && (
          <StatCard
            value={formatDuration(avgInterval)}
            label="Avg Interval"
            isHighlighted={isIntervalMet}
          />
        )}
        <StatCard
          value={formatDuration(avgDuration)}
          label="Avg Duration"
          isHighlighted={isDurationMet}
        />
        <StatCard
          value={formatDurationHoursMinutes(totalDuration)}
          label="Total Time"
          isHighlighted={isTotalTimeMet}
        />
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
    elevation: 3,
    gap: 4,
  },
  value: {
    fontSize: 18,
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

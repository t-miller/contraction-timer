import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Contraction } from '../types';
import { useTheme } from '../context/ThemeContext';
import { formatDuration, formatTime } from '../utils/formatting';

interface ContractionItemProps {
  contraction: Contraction;
  intervalFromPrevious: number | null;
}

export function ContractionItem({ contraction, intervalFromPrevious }: ContractionItemProps) {
  const { colors } = useTheme();
  const duration = contraction.endTime
    ? contraction.endTime - contraction.startTime
    : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <View style={styles.timeColumn}>
        <Text style={[styles.label, { color: colors.textTertiary }]}>Time</Text>
        <Text style={[styles.value, { color: colors.text }]}>{formatTime(contraction.startTime)}</Text>
      </View>
      <View style={styles.column}>
        <Text style={[styles.label, { color: colors.textTertiary }]}>Duration</Text>
        <Text style={[styles.value, { color: colors.text }]}>{formatDuration(duration)}</Text>
      </View>
      <View style={styles.column}>
        <Text style={[styles.label, { color: colors.textTertiary }]}>Interval</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {intervalFromPrevious !== null ? formatDuration(intervalFromPrevious) : '-'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  timeColumn: {
    flex: 1,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
});

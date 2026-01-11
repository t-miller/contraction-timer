import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Contraction } from '../types';
import { formatDuration, formatTime } from '../utils/formatting';

interface ContractionItemProps {
  contraction: Contraction;
  intervalFromPrevious: number | null;
}

export function ContractionItem({ contraction, intervalFromPrevious }: ContractionItemProps) {
  const duration = contraction.endTime
    ? contraction.endTime - contraction.startTime
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.timeColumn}>
        <Text style={styles.label}>Time</Text>
        <Text style={styles.value}>{formatTime(contraction.startTime)}</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.label}>Duration</Text>
        <Text style={styles.value}>{formatDuration(duration)}</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.label}>Interval</Text>
        <Text style={styles.value}>
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
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
    color: '#888',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

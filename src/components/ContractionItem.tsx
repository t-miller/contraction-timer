import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Contraction } from '../types';
import { useTheme } from '../context/ThemeContext';
import { formatDuration, formatTime } from '../utils/formatting';

interface ContractionItemProps {
  contraction: Contraction;
  intervalFromPrevious: number | null;
  index: number;
}

export function ContractionItem({ contraction, intervalFromPrevious, index }: ContractionItemProps) {
  const { colors } = useTheme();
  const duration = contraction.endTime
    ? contraction.endTime - contraction.startTime
    : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]} testID={`contraction-item-${index}`}>
      <View style={[styles.indexBadge, { backgroundColor: colors.primaryLight }]}>
        <Text style={[styles.indexText, { color: colors.primary }]} testID={`contraction-index-${index}`}>{index}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={[styles.time, { color: colors.text }]} testID={`contraction-time-${index}`}>{formatTime(contraction.startTime)}</Text>
          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Text style={[styles.metricValue, { color: colors.text }]} testID={`contraction-duration-${index}`}>{formatDuration(duration)}</Text>
              <Text style={[styles.metricLabel, { color: colors.textTertiary }]}>duration</Text>
            </View>
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
            <View style={styles.metric}>
              <Text style={[styles.metricValue, { color: colors.text }]} testID={`contraction-interval-${index}`}>
                {intervalFromPrevious !== null ? formatDuration(intervalFromPrevious) : '—'}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textTertiary }]}>interval</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  indexBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  indexText: {
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
  },
  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metric: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginTop: 1,
  },
  separator: {
    width: 1,
    height: 24,
    marginHorizontal: 12,
  },
});

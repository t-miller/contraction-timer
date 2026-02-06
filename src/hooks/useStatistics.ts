import { useMemo } from 'react';
import { Contraction } from '../types';

export interface StatisticsResult {
  averageDuration: number;
  averageInterval: number;
  totalDuration: number;
  count: number;
}

export function useStatistics(contractions: Contraction[]): StatisticsResult {
  return useMemo(() => {
    const completedContractions = contractions.filter(
      (c) => c.endTime !== null
    );
    const count = contractions.length;

    if (completedContractions.length === 0) {
      return { averageDuration: 0, averageInterval: 0, totalDuration: 0, count };
    }

    // Average duration of completed contractions
    const totalDurationSum = completedContractions.reduce(
      (sum, c) => sum + (c.endTime! - c.startTime),
      0
    );
    const averageDuration = totalDurationSum / completedContractions.length;

    // Average interval (gap between end of one and start of next)
    // Contractions are stored newest-first
    let averageInterval = 0;
    if (completedContractions.length >= 2) {
      let totalInterval = 0;
      for (let i = 0; i < completedContractions.length - 1; i++) {
        const current = completedContractions[i];
        const previous = completedContractions[i + 1];
        totalInterval +=
          current.startTime - (previous.endTime || previous.startTime);
      }
      averageInterval = totalInterval / (completedContractions.length - 1);
    }

    // Total duration: span from first (oldest) start to last (newest) end
    const oldest = completedContractions[completedContractions.length - 1];
    const newest = completedContractions[0];
    const totalDuration = newest.endTime! - oldest.startTime;

    return { averageDuration, averageInterval, totalDuration, count };
  }, [contractions]);
}

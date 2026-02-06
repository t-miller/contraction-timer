import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useStatistics } from '../../src/hooks/useStatistics';
import { Contraction } from '../../src/types';

const createContraction = (
  startTime: number,
  endTime: number | null
): Contraction => ({
  id: `${startTime}`,
  startTime,
  endTime,
});

describe('useStatistics', () => {
  it('returns zero values for empty array', () => {
    const { result } = renderHook(() => useStatistics([]));

    expect(result.current.averageDuration).toBe(0);
    expect(result.current.averageInterval).toBe(0);
    expect(result.current.totalDuration).toBe(0);
    expect(result.current.count).toBe(0);
  });

  it('calculates average duration correctly', () => {
    // Two completed contractions: 60s each (newest first)
    const contractions = [
      createContraction(120000, 180000), // 60s
      createContraction(0, 60000), // 60s
    ];
    const { result } = renderHook(() => useStatistics(contractions));

    expect(result.current.averageDuration).toBe(60000);
  });

  it('calculates average interval as gap between contractions', () => {
    // Contractions stored newest-first
    // Interval = current.startTime - previous.endTime
    // = 120000 - 60000 = 60000
    const contractions = [
      createContraction(120000, 180000),
      createContraction(0, 60000),
    ];
    const { result } = renderHook(() => useStatistics(contractions));

    expect(result.current.averageInterval).toBe(60000);
  });

  it('returns zero interval for single contraction', () => {
    const contractions = [createContraction(0, 60000)];
    const { result } = renderHook(() => useStatistics(contractions));

    expect(result.current.averageInterval).toBe(0);
  });

  it('calculates total duration as span from first start to last end', () => {
    // Newest first: [0] is newest, [last] is oldest
    const contractions = [
      createContraction(120000, 180000),
      createContraction(0, 60000),
    ];
    const { result } = renderHook(() => useStatistics(contractions));

    // Total = contractions[0].endTime - contractions[last].startTime = 180000 - 0
    expect(result.current.totalDuration).toBe(180000);
  });

  it('returns count of all contractions including ongoing', () => {
    const contractions: Contraction[] = [
      createContraction(240000, 300000),
      createContraction(120000, 180000),
      { id: '0', startTime: 0, endTime: null },
    ];
    const { result } = renderHook(() => useStatistics(contractions));

    expect(result.current.count).toBe(3);
  });

  it('excludes ongoing contractions from duration calculation', () => {
    const contractions: Contraction[] = [
      { id: '1', startTime: 120000, endTime: null }, // ongoing
      createContraction(0, 60000),
    ];
    const { result } = renderHook(() => useStatistics(contractions));

    expect(result.current.averageDuration).toBe(60000);
  });

  it('only uses completed contractions for interval calculation', () => {
    // One completed + one ongoing = only 1 completed, so interval is 0
    const contractions: Contraction[] = [
      createContraction(120000, 180000),
      { id: '0', startTime: 0, endTime: null },
    ];
    const { result } = renderHook(() => useStatistics(contractions));

    expect(result.current.averageInterval).toBe(0);
  });

  it('memoizes results when contractions reference unchanged', () => {
    const contractions = [createContraction(0, 60000)];
    const { result, rerender } = renderHook(() => useStatistics(contractions));

    const firstResult = result.current;
    rerender();

    expect(result.current).toBe(firstResult); // Same reference
  });
});

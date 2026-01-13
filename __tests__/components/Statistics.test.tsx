import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Statistics } from '../../src/components/Statistics';
import { ContractionProvider } from '../../src/context/ContractionContext';
import { ThemeProvider } from '../../src/context/ThemeContext';
import { Contraction } from '../../src/types';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <ContractionProvider>{children}</ContractionProvider>
  </ThemeProvider>
);

describe('Statistics', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('renders statistics when contractions exist', async () => {
    const now = Date.now();
    const contractions: Contraction[] = [
      { id: '1', startTime: now - 120000, endTime: now - 60000 }, // 1 min duration
    ];
    await AsyncStorage.setItem('contractions', JSON.stringify(contractions));

    render(
      <TestWrapper>
        <Statistics />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('statistics-title').textContent).toBe('Statistics');
    });

    expect(screen.getByTestId('stat-label-avg-duration').textContent).toBe('Avg Duration');
    expect(screen.getByTestId('stat-label-total-time').textContent).toBe('Total Time');
  });

  it('calculates average duration correctly', async () => {
    const now = Date.now();
    const contractions: Contraction[] = [
      { id: '1', startTime: now - 180000, endTime: now - 120000 }, // 60s
      { id: '2', startTime: now - 90000, endTime: now - 60000 },   // 30s
    ];
    // Average: 45s = 0:45
    await AsyncStorage.setItem('contractions', JSON.stringify(contractions));

    render(
      <TestWrapper>
        <Statistics />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('stat-value-avg-duration').textContent).toBe('0:45');
    });
  });

  it('calculates average interval correctly', async () => {
    const now = Date.now();
    const contractions: Contraction[] = [
      { id: '2', startTime: now - 60000, endTime: now - 30000 },   // More recent
      { id: '1', startTime: now - 180000, endTime: now - 120000 }, // Older
    ];
    // Interval: (now - 60000) - (now - 120000) = 60000ms = 1:00
    await AsyncStorage.setItem('contractions', JSON.stringify(contractions));

    render(
      <TestWrapper>
        <Statistics />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('stat-label-avg-interval').textContent).toBe('Avg Interval');
      expect(screen.getByTestId('stat-value-avg-interval').textContent).toBe('1:00');
    });
  });

  it('does not show interval with only one contraction', async () => {
    const now = Date.now();
    const contractions: Contraction[] = [
      { id: '1', startTime: now - 120000, endTime: now - 60000 },
    ];
    await AsyncStorage.setItem('contractions', JSON.stringify(contractions));

    render(
      <TestWrapper>
        <Statistics />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('stat-label-avg-interval')).toBeNull();
    });
  });

  it('calculates total time correctly', async () => {
    const now = Date.now();
    const contractions: Contraction[] = [
      { id: '2', startTime: now - 60000, endTime: now },          // Latest
      { id: '1', startTime: now - 3660000, endTime: now - 3600000 }, // Earliest (1h 1min ago)
    ];
    // Total: now - (now - 3660000) = 3660000ms = 1h 01min
    await AsyncStorage.setItem('contractions', JSON.stringify(contractions));

    render(
      <TestWrapper>
        <Statistics />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('stat-value-total-time').textContent).toBe('1h 01min');
    });
  });

  it('ignores contractions with null endTime', async () => {
    const now = Date.now();
    const contractions: Contraction[] = [
      { id: '1', startTime: now - 120000, endTime: now - 60000 },
      { id: '2', startTime: now, endTime: null }, // Active contraction
    ];
    await AsyncStorage.setItem('contractions', JSON.stringify(contractions));

    render(
      <TestWrapper>
        <Statistics />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('statistics-title').textContent).toBe('Statistics');
    });

    // Should only count the completed contraction
    expect(screen.getByTestId('stat-value-avg-duration').textContent).toBe('1:00');
    expect(screen.queryByTestId('stat-label-avg-interval')).toBeNull(); // Only 1 completed
  });
});

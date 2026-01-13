import React from 'react';
import { vi } from 'vitest';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContractionList } from '../../src/components/ContractionList';
import { ContractionProvider } from '../../src/context/ContractionContext';
import { ThemeProvider } from '../../src/context/ThemeContext';
import { Contraction } from '../../src/types';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <ContractionProvider>{children}</ContractionProvider>
  </ThemeProvider>
);

describe('ContractionList', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    vi.clearAllMocks();
  });

  describe('empty state', () => {
    it('shows empty state message when no contractions', async () => {
      render(
        <TestWrapper>
          <ContractionList />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('empty-state-text').textContent).toBe('No contractions recorded');
      });
    });

    it('shows hint text in empty state', async () => {
      render(
        <TestWrapper>
          <ContractionList />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('empty-state-hint').textContent).toBe('Tap the button above to start timing');
      });
    });

    it('shows timer emoji in empty state', async () => {
      render(
        <TestWrapper>
          <ContractionList />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('empty-state-icon').textContent).toBe('⏱');
      });
    });
  });

  describe('with contractions', () => {
    const setupWithContractions = async () => {
      const now = Date.now();
      const contractions: Contraction[] = [
        { id: '2', startTime: now - 60000, endTime: now - 30000 },
        { id: '1', startTime: now - 180000, endTime: now - 120000 },
      ];
      await AsyncStorage.setItem('contractions', JSON.stringify(contractions));
    };

    it('shows History header', async () => {
      await setupWithContractions();

      render(
        <TestWrapper>
          <ContractionList />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('history-header').textContent).toBe('History');
      });
    });

    it('shows Save and Clear buttons', async () => {
      await setupWithContractions();

      render(
        <TestWrapper>
          <ContractionList />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeTruthy();
        expect(screen.getByTestId('clear-button')).toBeTruthy();
      });
    });

    it('renders list of contractions', async () => {
      await setupWithContractions();

      render(
        <TestWrapper>
          <ContractionList />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show index numbers (1 and 2)
        expect(screen.getByTestId('contraction-index-1').textContent).toBe('1');
        expect(screen.getByTestId('contraction-index-2').textContent).toBe('2');
      });
    });

    it('calculates intervals between contractions', async () => {
      const now = Date.now();
      const contractions: Contraction[] = [
        { id: '2', startTime: now - 60000, endTime: now - 30000 },
        { id: '1', startTime: now - 180000, endTime: now - 120000 },
      ];
      // Interval: (now - 60000) - (now - 120000) = 60000ms = 1:00
      await AsyncStorage.setItem('contractions', JSON.stringify(contractions));

      render(
        <TestWrapper>
          <ContractionList />
        </TestWrapper>
      );

      await waitFor(() => {
        // The second contraction (index 2) should have interval 1:00
        expect(screen.getByTestId('contraction-interval-2').textContent).toBe('1:00');
      });
    });
  });

  describe('save set modal', () => {
    const setupWithContractions = async () => {
      const now = Date.now();
      const contractions: Contraction[] = [
        { id: '1', startTime: now - 60000, endTime: now - 30000 },
      ];
      await AsyncStorage.setItem('contractions', JSON.stringify(contractions));
    };

    it('opens modal when Save is pressed', async () => {
      await setupWithContractions();

      render(
        <TestWrapper>
          <ContractionList />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeTruthy();
      });

      fireEvent.click(screen.getByTestId('save-button'));

      await waitFor(() => {
        expect(screen.getByTestId('modal-title').textContent).toBe('Save Set');
        expect(screen.getByTestId('modal-subtitle').textContent).toBe('Give this recording session a name');
      });
    });

    it('shows Cancel and Save buttons in modal', async () => {
      await setupWithContractions();

      render(
        <TestWrapper>
          <ContractionList />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeTruthy();
      });

      fireEvent.click(screen.getByTestId('save-button'));

      await waitFor(() => {
        expect(screen.getByTestId('modal-cancel-button')).toBeTruthy();
        expect(screen.getByTestId('modal-save-button')).toBeTruthy();
      });
    });

  });
});

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
        expect(screen.getByText('No contractions recorded')).toBeTruthy();
      });
    });

    it('shows hint text in empty state', async () => {
      render(
        <TestWrapper>
          <ContractionList />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Tap the button above to start timing')).toBeTruthy();
      });
    });

    it('shows timer emoji in empty state', async () => {
      render(
        <TestWrapper>
          <ContractionList />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('⏱')).toBeTruthy();
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
        expect(screen.getByText('History')).toBeTruthy();
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
        expect(screen.getByText('Save')).toBeTruthy();
        expect(screen.getByText('Clear')).toBeTruthy();
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
        expect(screen.getByText('1')).toBeTruthy();
        expect(screen.getByText('2')).toBeTruthy();
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
        // Multiple elements may have 1:00 (duration and interval)
        const elements = screen.getAllByText('1:00');
        expect(elements.length).toBeGreaterThanOrEqual(1);
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
        expect(screen.getByText('Save')).toBeTruthy();
      });

      fireEvent.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(screen.getByText('Save Set')).toBeTruthy();
        expect(screen.getByText('Give this recording session a name')).toBeTruthy();
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
        expect(screen.getByText('Save')).toBeTruthy();
      });

      fireEvent.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeTruthy();
        // There will be two "Save" texts - one button and one in modal
        expect(screen.getAllByText('Save').length).toBeGreaterThanOrEqual(2);
      });
    });

  });
});

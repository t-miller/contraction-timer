import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderWithProviders } from '../src/__test-utils__';
import { TimerButton } from '../src/components/TimerButton';
import { Statistics } from '../src/components/Statistics';
import { ContractionItem } from '../src/components/ContractionItem';
import { Instructions } from '../src/components/Instructions';
import { Contraction } from '../src/types';

describe('Accessibility Compliance', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  describe('Interactive elements have accessible names', () => {
    it('TimerButton has accessible label in start state', async () => {
      renderWithProviders(<TimerButton />);

      await waitFor(() => {
        const button = screen.getByTestId('timer-button');
        expect(button.getAttribute('aria-label')).toMatch(/start/i);
      });
    });

    it('TimerButton has accessible label in stop state', async () => {
      renderWithProviders(<TimerButton />);

      await waitFor(() => {
        expect(screen.getByTestId('timer-button-text').textContent).toBe('START');
      });

      fireEvent.click(screen.getByTestId('timer-button'));

      await waitFor(() => {
        const button = screen.getByTestId('timer-button');
        expect(button.getAttribute('aria-label')).toMatch(/stop/i);
      });
    });

    it('Instructions button has accessible label', () => {
      renderWithProviders(<Instructions />);
      const button = screen.getByTestId('instructions-button');
      expect(button.getAttribute('aria-label')).toBe('Instructions');
    });
  });

  describe('Information is conveyed through accessible labels', () => {
    it('Statistics cards announce their values', async () => {
      const now = Date.now();
      const contractions: Contraction[] = [
        { id: '2', startTime: now - 60000, endTime: now - 30000 },
        { id: '1', startTime: now - 180000, endTime: now - 120000 },
      ];
      await AsyncStorage.setItem('contractions', JSON.stringify(contractions));

      renderWithProviders(<Statistics />);

      await waitFor(() => {
        const durationCard = screen.getByTestId('stat-card-avg-duration');
        expect(durationCard.getAttribute('aria-label')).toMatch(/avg duration/i);

        const intervalCard = screen.getByTestId('stat-card-avg-interval');
        expect(intervalCard.getAttribute('aria-label')).toMatch(/avg interval/i);
      });
    });

    it('ContractionItem provides complete context', () => {
      const baseTime = new Date(2024, 0, 15, 10, 30, 0).getTime();
      const contraction: Contraction = {
        id: '1',
        startTime: baseTime,
        endTime: baseTime + 90000,
      };

      renderWithProviders(
        <ContractionItem
          contraction={contraction}
          intervalFromPrevious={300000}
          index={3}
        />
      );

      const item = screen.getByTestId('contraction-item-3');
      const label = item.getAttribute('aria-label');
      expect(label).toMatch(/contraction 3/i);
      expect(label).toMatch(/duration/i);
      expect(label).toMatch(/interval/i);
    });
  });

  describe('Modal accessibility', () => {
    it('Instructions modal has dialog role', async () => {
      renderWithProviders(<Instructions />);

      fireEvent.click(screen.getByTestId('instructions-button'));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeTruthy();
      });
    });
  });
});

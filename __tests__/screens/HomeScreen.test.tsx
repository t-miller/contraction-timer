import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeScreen } from '../../src/screens/HomeScreen';
import { ContractionProvider } from '../../src/context/ContractionContext';
import { ThemeProvider } from '../../src/context/ThemeContext';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <ContractionProvider>{children}</ContractionProvider>
  </ThemeProvider>
);

describe('HomeScreen', () => {
  it('renders without crashing', async () => {
    render(
      <TestWrapper>
        <HomeScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home-screen')).toBeTruthy();
    });
  });

  it('displays the app title', async () => {
    render(
      <TestWrapper>
        <HomeScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Contraction Timer')).toBeTruthy();
    });
  });

  it('displays the subtitle', async () => {
    render(
      <TestWrapper>
        <HomeScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Track and time your contractions')).toBeTruthy();
    });
  });

  it('displays the timer button', async () => {
    render(
      <TestWrapper>
        <HomeScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('timer-button')).toBeTruthy();
    });
  });

  it('displays empty state when no contractions', async () => {
    render(
      <TestWrapper>
        <HomeScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeTruthy();
      expect(screen.getByText('No contractions recorded')).toBeTruthy();
    });
  });

  it('displays instructions button', async () => {
    render(
      <TestWrapper>
        <HomeScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('instructions-button')).toBeTruthy();
    });
  });

  it('displays error banner when storage error occurs', async () => {
    await AsyncStorage.setItem('contractions', 'invalid json');

    render(
      <TestWrapper>
        <HomeScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load/)).toBeTruthy();
    });
  });

  it('dismisses error banner when dismiss button pressed', async () => {
    await AsyncStorage.setItem('contractions', 'invalid json');

    render(
      <TestWrapper>
        <HomeScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load/)).toBeTruthy();
    });

    fireEvent.click(screen.getByTestId('error-dismiss-button'));

    await waitFor(() => {
      expect(screen.queryByText(/Failed to load/)).toBeNull();
    });
  });
});

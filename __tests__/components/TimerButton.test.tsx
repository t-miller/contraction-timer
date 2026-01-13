import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { TimerButton } from '../../src/components/TimerButton';
import { ContractionProvider } from '../../src/context/ContractionContext';
import { ThemeProvider } from '../../src/context/ThemeContext';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <ContractionProvider>{children}</ContractionProvider>
  </ThemeProvider>
);

describe('TimerButton', () => {
  it('renders START button initially', async () => {
    render(
      <TestWrapper>
        <TimerButton />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('timer-button-text').textContent).toBe('START');
    });
  });

  it('displays hint text for starting', async () => {
    render(
      <TestWrapper>
        <TimerButton />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('timer-hint').textContent).toBe('Tap when contraction starts');
    });
  });

  it('changes to STOP button when pressed', async () => {
    render(
      <TestWrapper>
        <TimerButton />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('timer-button-text').textContent).toBe('START');
    });

    fireEvent.click(screen.getByTestId('timer-button'));

    await waitFor(() => {
      expect(screen.getByTestId('timer-button-text').textContent).toBe('STOP');
    });
  });

  it('displays hint text for stopping when active', async () => {
    render(
      <TestWrapper>
        <TimerButton />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('timer-button-text').textContent).toBe('START');
    });

    fireEvent.click(screen.getByTestId('timer-button'));

    await waitFor(() => {
      expect(screen.getByTestId('timer-hint').textContent).toBe('Tap when contraction ends');
    });
  });

  it('returns to START button after stopping', async () => {
    render(
      <TestWrapper>
        <TimerButton />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('timer-button-text').textContent).toBe('START');
    });

    // Start
    fireEvent.click(screen.getByTestId('timer-button'));

    await waitFor(() => {
      expect(screen.getByTestId('timer-button-text').textContent).toBe('STOP');
    });

    // Stop
    fireEvent.click(screen.getByTestId('timer-button'));

    await waitFor(() => {
      expect(screen.getByTestId('timer-button-text').textContent).toBe('START');
    });
  });

  it('displays elapsed time when active', async () => {
    render(
      <TestWrapper>
        <TimerButton />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('timer-button-text').textContent).toBe('START');
    });

    // No timer displayed initially
    expect(screen.queryByTestId('timer-elapsed')).toBeNull();

    fireEvent.click(screen.getByTestId('timer-button'));

    // Timer should be displayed when active (starts at 0:00)
    await waitFor(() => {
      expect(screen.getByTestId('timer-elapsed').textContent).toBe('0:00');
    });
  });
});

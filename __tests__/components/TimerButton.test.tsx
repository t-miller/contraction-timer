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
      expect(screen.getByText('START')).toBeTruthy();
    });
  });

  it('displays hint text for starting', async () => {
    render(
      <TestWrapper>
        <TimerButton />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Tap when contraction starts')).toBeTruthy();
    });
  });

  it('changes to STOP button when pressed', async () => {
    render(
      <TestWrapper>
        <TimerButton />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('START')).toBeTruthy();
    });

    fireEvent.click(screen.getByText('START'));

    await waitFor(() => {
      expect(screen.getByText('STOP')).toBeTruthy();
    });
  });

  it('displays hint text for stopping when active', async () => {
    render(
      <TestWrapper>
        <TimerButton />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('START')).toBeTruthy();
    });

    fireEvent.click(screen.getByText('START'));

    await waitFor(() => {
      expect(screen.getByText('Tap when contraction ends')).toBeTruthy();
    });
  });

  it('returns to START button after stopping', async () => {
    render(
      <TestWrapper>
        <TimerButton />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('START')).toBeTruthy();
    });

    // Start
    fireEvent.click(screen.getByText('START'));

    await waitFor(() => {
      expect(screen.getByText('STOP')).toBeTruthy();
    });

    // Stop
    fireEvent.click(screen.getByText('STOP'));

    await waitFor(() => {
      expect(screen.getByText('START')).toBeTruthy();
    });
  });

  it('displays elapsed time when active', async () => {
    render(
      <TestWrapper>
        <TimerButton />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('START')).toBeTruthy();
    });

    // No timer displayed initially
    expect(screen.queryByText('0:00')).toBeNull();

    fireEvent.click(screen.getByText('START'));

    // Timer should be displayed when active (starts at 0:00)
    await waitFor(() => {
      expect(screen.getByText('0:00')).toBeTruthy();
    });
  });
});

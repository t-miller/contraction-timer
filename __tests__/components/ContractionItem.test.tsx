import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContractionItem } from '../../src/components/ContractionItem';
import { ThemeProvider } from '../../src/context/ThemeContext';
import { Contraction } from '../../src/types';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ContractionItem', () => {
  const baseTime = new Date(2024, 0, 15, 10, 30, 0).getTime();

  it('renders the index badge', () => {
    const contraction: Contraction = {
      id: '1',
      startTime: baseTime,
      endTime: baseTime + 60000,
    };

    render(
      <TestWrapper>
        <ContractionItem
          contraction={contraction}
          intervalFromPrevious={null}
          index={1}
        />
      </TestWrapper>
    );

    const indexElement = screen.getByTestId('contraction-index-1');
    expect(indexElement.textContent).toBe('1');
  });

  it('renders the start time', () => {
    const contraction: Contraction = {
      id: '1',
      startTime: baseTime,
      endTime: baseTime + 60000,
    };

    render(
      <TestWrapper>
        <ContractionItem
          contraction={contraction}
          intervalFromPrevious={null}
          index={1}
        />
      </TestWrapper>
    );

    // Check that time is rendered (format like "10:30 AM")
    const timeElement = screen.getByTestId('contraction-time-1');
    expect(timeElement.textContent).toMatch(/10:30/);
  });

  it('renders duration correctly', () => {
    const contraction: Contraction = {
      id: '1',
      startTime: baseTime,
      endTime: baseTime + 90000, // 1 min 30 sec
    };

    render(
      <TestWrapper>
        <ContractionItem
          contraction={contraction}
          intervalFromPrevious={null}
          index={1}
        />
      </TestWrapper>
    );

    const durationElement = screen.getByTestId('contraction-duration-1');
    expect(durationElement.textContent).toBe('1:30');
  });

  it('renders interval when provided', () => {
    const contraction: Contraction = {
      id: '1',
      startTime: baseTime,
      endTime: baseTime + 60000,
    };

    render(
      <TestWrapper>
        <ContractionItem
          contraction={contraction}
          intervalFromPrevious={300000} // 5 minutes
          index={1}
        />
      </TestWrapper>
    );

    const intervalElement = screen.getByTestId('contraction-interval-1');
    expect(intervalElement.textContent).toBe('5:00');
  });

  it('renders dash for null interval', () => {
    const contraction: Contraction = {
      id: '1',
      startTime: baseTime,
      endTime: baseTime + 60000,
    };

    render(
      <TestWrapper>
        <ContractionItem
          contraction={contraction}
          intervalFromPrevious={null}
          index={1}
        />
      </TestWrapper>
    );

    const intervalElement = screen.getByTestId('contraction-interval-1');
    expect(intervalElement.textContent).toBe('—');
  });

  it('renders 0:00 duration for ongoing contraction', () => {
    const contraction: Contraction = {
      id: '1',
      startTime: baseTime,
      endTime: null, // Still ongoing
    };

    render(
      <TestWrapper>
        <ContractionItem
          contraction={contraction}
          intervalFromPrevious={null}
          index={1}
        />
      </TestWrapper>
    );

    const durationElement = screen.getByTestId('contraction-duration-1');
    expect(durationElement.textContent).toBe('0:00');
  });

  it('formats short durations correctly', () => {
    const contraction: Contraction = {
      id: '1',
      startTime: baseTime,
      endTime: baseTime + 5000, // 5 seconds
    };

    render(
      <TestWrapper>
        <ContractionItem
          contraction={contraction}
          intervalFromPrevious={null}
          index={1}
        />
      </TestWrapper>
    );

    const durationElement = screen.getByTestId('contraction-duration-1');
    expect(durationElement.textContent).toBe('0:05');
  });

  it('formats long durations correctly', () => {
    const contraction: Contraction = {
      id: '1',
      startTime: baseTime,
      endTime: baseTime + 600000, // 10 minutes
    };

    render(
      <TestWrapper>
        <ContractionItem
          contraction={contraction}
          intervalFromPrevious={null}
          index={1}
        />
      </TestWrapper>
    );

    const durationElement = screen.getByTestId('contraction-duration-1');
    expect(durationElement.textContent).toBe('10:00');
  });
});

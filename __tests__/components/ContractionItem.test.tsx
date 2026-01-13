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

    // Use getAllByText since '1' appears multiple times and check at least one exists
    const elements = screen.getAllByText('1');
    expect(elements.length).toBeGreaterThan(0);
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
    expect(screen.getByText(/10:30/)).toBeTruthy();
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

    expect(screen.getByText('1:30')).toBeTruthy();
    expect(screen.getByText('duration')).toBeTruthy();
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

    expect(screen.getByText('5:00')).toBeTruthy();
    expect(screen.getByText('interval')).toBeTruthy();
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

    expect(screen.getByText('—')).toBeTruthy();
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

    expect(screen.getByText('0:00')).toBeTruthy();
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

    expect(screen.getByText('0:05')).toBeTruthy();
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

    expect(screen.getByText('10:00')).toBeTruthy();
  });
});

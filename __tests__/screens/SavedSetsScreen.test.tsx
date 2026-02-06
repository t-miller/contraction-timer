import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SavedSetsScreen } from '../../src/screens/SavedSetsScreen';
import { ContractionProvider } from '../../src/context/ContractionContext';
import { ThemeProvider } from '../../src/context/ThemeContext';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <ContractionProvider>{children}</ContractionProvider>
  </ThemeProvider>
);

describe('SavedSetsScreen', () => {
  it('renders without crashing', async () => {
    render(
      <TestWrapper>
        <SavedSetsScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('saved-sets-screen')).toBeTruthy();
    });
  });

  it('displays the screen title', async () => {
    render(
      <TestWrapper>
        <SavedSetsScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Saved Sets')).toBeTruthy();
    });
  });

  it('shows empty state when no saved sets', async () => {
    render(
      <TestWrapper>
        <SavedSetsScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('No saved sets')).toBeTruthy();
    });
  });

  it('displays save count in subtitle', async () => {
    render(
      <TestWrapper>
        <SavedSetsScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('0 saved recordings')).toBeTruthy();
    });
  });

  it('shows helpful hint in empty state', async () => {
    render(
      <TestWrapper>
        <SavedSetsScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Save your contractions from the Home screen/)).toBeTruthy();
    });
  });
});

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { SettingsScreen } from '../../src/screens/SettingsScreen';
import { ContractionProvider } from '../../src/context/ContractionContext';
import { ThemeProvider } from '../../src/context/ThemeContext';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <ContractionProvider>{children}</ContractionProvider>
  </ThemeProvider>
);

describe('SettingsScreen', () => {
  it('renders without crashing', async () => {
    render(
      <TestWrapper>
        <SettingsScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('settings-screen')).toBeTruthy();
    });
  });

  it('displays the screen title', async () => {
    render(
      <TestWrapper>
        <SettingsScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeTruthy();
    });
  });

  it('displays the subtitle', async () => {
    render(
      <TestWrapper>
        <SettingsScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Customize your experience')).toBeTruthy();
    });
  });

  it('displays appearance section', async () => {
    render(
      <TestWrapper>
        <SettingsScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Appearance')).toBeTruthy();
    });
  });

  it('displays all theme options', async () => {
    render(
      <TestWrapper>
        <SettingsScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('System')).toBeTruthy();
      expect(screen.getByText('Light')).toBeTruthy();
      expect(screen.getByText('Dark')).toBeTruthy();
    });
  });

  it('displays theme option descriptions', async () => {
    render(
      <TestWrapper>
        <SettingsScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Match your device settings')).toBeTruthy();
      expect(screen.getByText('Always use light mode')).toBeTruthy();
      expect(screen.getByText('Always use dark mode')).toBeTruthy();
    });
  });

  it('displays app version', async () => {
    render(
      <TestWrapper>
        <SettingsScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Contraction Timer v/)).toBeTruthy();
    });
  });
});

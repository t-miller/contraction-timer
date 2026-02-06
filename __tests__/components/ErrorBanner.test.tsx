import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBanner } from '../../src/components/ErrorBanner';
import { ThemeProvider } from '../../src/context/ThemeContext';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ErrorBanner', () => {
  it('displays error message', () => {
    render(
      <TestWrapper>
        <ErrorBanner error={new Error('Something went wrong')} onDismiss={() => {}} />
      </TestWrapper>
    );
    expect(screen.getByText(/something went wrong/i)).toBeTruthy();
  });

  it('calls onDismiss when dismiss button clicked', () => {
    const onDismiss = vi.fn();
    render(
      <TestWrapper>
        <ErrorBanner error={new Error('test')} onDismiss={onDismiss} />
      </TestWrapper>
    );
    fireEvent.click(screen.getByTestId('error-dismiss-button'));
    expect(onDismiss).toHaveBeenCalled();
  });

  it('returns null when no error', () => {
    const { container } = render(
      <TestWrapper>
        <ErrorBanner error={null} onDismiss={() => {}} />
      </TestWrapper>
    );
    expect(container.textContent).toBe('');
  });
});

import React, { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { NavigationContainer } from '@react-navigation/native';
import { ContractionProvider } from '../context/ContractionContext';
import { ThemeProvider } from '../context/ThemeContext';

interface TestWrapperProps {
  children: ReactNode;
}

export function TestWrapper({ children }: TestWrapperProps) {
  return (
    <ThemeProvider>
      <ContractionProvider>
        <NavigationContainer>
          {children}
        </NavigationContainer>
      </ContractionProvider>
    </ThemeProvider>
  );
}

export function renderWithProviders(ui: React.ReactElement) {
  return render(ui, { wrapper: TestWrapper });
}

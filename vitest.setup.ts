import { vi } from 'vitest';
import React from 'react';

// Mock AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => {
  let store: Record<string, string> = {};
  return {
    default: {
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
        return Promise.resolve();
      }),
      getItem: vi.fn((key: string) => {
        return Promise.resolve(store[key] || null);
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
        return Promise.resolve();
      }),
      clear: vi.fn(() => {
        store = {};
        return Promise.resolve();
      }),
      getAllKeys: vi.fn(() => {
        return Promise.resolve(Object.keys(store));
      }),
      multiGet: vi.fn((keys: string[]) => {
        return Promise.resolve(keys.map((key) => [key, store[key] || null]));
      }),
      multiSet: vi.fn((pairs: [string, string][]) => {
        pairs.forEach(([key, value]) => {
          store[key] = value;
        });
        return Promise.resolve();
      }),
    },
  };
});

// Mock react-native-safe-area-context
vi.mock('react-native-safe-area-context', () => {
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaConsumer: ({
      children,
    }: {
      children: (insets: { top: number; right: number; bottom: number; left: number }) => React.ReactNode;
    }) => children({ top: 0, right: 0, bottom: 0, left: 0 }),
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

// Mock @react-navigation/native
vi.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: vi.fn(),
    goBack: vi.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock ThemeContext to avoid async loading issues in tests
vi.mock('./src/context/ThemeContext', () => {
  const lightColors = {
    background: '#FAFBFC',
    surface: '#FFFFFF',
    surfaceSecondary: '#F3F4F6',
    text: '#1F2937',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    border: '#E5E7EB',
    primary: '#6366F1',
    primaryLight: '#EEF2FF',
    success: '#10B981',
    successLight: '#D1FAE5',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    statsBackground: '#F0F9FF',
    statsText: '#0369A1',
    statsBorder: '#BAE6FD',
    disclaimerBackground: '#FFFBEB',
    disclaimerBorder: '#FDE68A',
    disclaimerText: '#B45309',
    shadow: '#000000',
    modalOverlay: 'rgba(0, 0, 0, 0.4)',
    inputBackground: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.08)',
    statusBar: 'dark-content',
  };

  const mockContextValue = {
    colors: lightColors,
    isDark: false,
    themeMode: 'light' as const,
    setThemeMode: vi.fn(),
  };

  return {
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
    useTheme: () => mockContextValue,
  };
});

// Global test timeout
vi.setConfig({ testTimeout: 10000 });

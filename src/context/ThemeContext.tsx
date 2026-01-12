import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = 'themePreference';

export type ThemeMode = 'system' | 'light' | 'dark';

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
  statusBar: 'dark-content' as const,
};

const darkColors = {
  background: '#0F172A',
  surface: '#1E293B',
  surfaceSecondary: '#334155',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  border: '#334155',
  primary: '#818CF8',
  primaryLight: '#312E81',
  success: '#34D399',
  successLight: '#064E3B',
  danger: '#F87171',
  dangerLight: '#7F1D1D',
  statsBackground: '#1E3A5F',
  statsText: '#7DD3FC',
  statsBorder: '#0369A1',
  disclaimerBackground: '#422006',
  disclaimerBorder: '#78350F',
  disclaimerText: '#FCD34D',
  shadow: '#000000',
  modalOverlay: 'rgba(0, 0, 0, 0.6)',
  inputBackground: '#1E293B',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
  statusBar: 'light-content' as const,
};

export type ThemeColors = typeof lightColors | typeof darkColors;

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setThemeModeState(stored);
      }
      setIsLoaded(true);
    });
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  };

  const isDark =
    themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ colors, isDark, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

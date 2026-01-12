import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = 'themePreference';

export type ThemeMode = 'system' | 'light' | 'dark';

const lightColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceSecondary: '#FAFAFA',
  text: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#E0E0E0',
  primary: '#2196F3',
  success: '#4CAF50',
  danger: '#F44336',
  statsBackground: '#E3F2FD',
  statsText: '#1976D2',
  disclaimerBackground: '#FFF3E0',
  disclaimerBorder: '#FFE0B2',
  disclaimerText: '#E65100',
  shadow: '#000000',
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
  inputBackground: '#FFFFFF',
  statusBar: 'dark-content' as const,
};

const darkColors = {
  background: '#121212',
  surface: '#1E1E1E',
  surfaceSecondary: '#2C2C2C',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',
  border: '#3D3D3D',
  primary: '#64B5F6',
  success: '#66BB6A',
  danger: '#EF5350',
  statsBackground: '#1A237E',
  statsText: '#90CAF9',
  disclaimerBackground: '#3E2723',
  disclaimerBorder: '#5D4037',
  disclaimerText: '#FFAB91',
  shadow: '#000000',
  modalOverlay: 'rgba(0, 0, 0, 0.7)',
  inputBackground: '#2C2C2C',
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

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useTheme, ThemeMode } from '../context/ThemeContext';

const themeOptions: { value: ThemeMode; label: string; icon: string; description: string }[] = [
  { value: 'system', label: 'System', icon: '📱', description: 'Match your device settings' },
  { value: 'light', label: 'Light', icon: '☀️', description: 'Always use light mode' },
  { value: 'dark', label: 'Dark', icon: '🌙', description: 'Always use dark mode' },
];

export function SettingsScreen() {
  const { colors, themeMode, setThemeMode } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: colors.textTertiary }]}>Customize your experience</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Appearance
        </Text>
        <View style={[styles.optionGroup, { backgroundColor: colors.surface, boxShadow: `0 2px 8px ${colors.cardShadow}` }]}>
          {themeOptions.map((option, index) => {
            const isSelected = themeMode === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  index < themeOptions.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                ]}
                onPress={() => setThemeMode(option.value)}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIcon, { backgroundColor: isSelected ? colors.primaryLight : colors.surfaceSecondary }]}>
                  <Text style={styles.iconText}>{option.icon}</Text>
                </View>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionLabel, { color: colors.text }]}>
                    {option.label}
                  </Text>
                  <Text style={[styles.optionDescription, { color: colors.textTertiary }]}>
                    {option.description}
                  </Text>
                </View>
                <View style={[
                  styles.radio,
                  { borderColor: isSelected ? colors.primary : colors.border },
                  isSelected && { backgroundColor: colors.primary }
                ]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textTertiary }]}>
          Contraction Timer v{Constants.expoConfig?.version ?? '1.0.0'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  optionGroup: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconText: {
    fontSize: 18,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionDescription: {
    fontSize: 13,
    marginTop: 1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 13,
  },
});

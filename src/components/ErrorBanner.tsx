import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ErrorBannerProps {
  error: Error | null;
  onDismiss: () => void;
}

export function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  const { colors } = useTheme();

  if (!error) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.danger }]}>
      <Text style={[styles.message, { color: colors.surface }]}>
        {error.message}
      </Text>
      <TouchableOpacity onPress={onDismiss} accessibilityLabel="Dismiss error" testID="error-dismiss-button">
        <Text style={[styles.dismiss, { color: colors.surface }]}>Dismiss</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    fontSize: 14,
  },
  dismiss: {
    fontWeight: '600',
    marginLeft: 12,
  },
});

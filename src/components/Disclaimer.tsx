import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export function Disclaimer() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.disclaimerBackground }]}>
      <View style={styles.content}>
        <Text style={styles.icon}>ℹ️</Text>
        <Text style={[styles.text, { color: colors.disclaimerText }]}>
          This app is a timing tool only. It does not provide medical advice.
          Always consult with your healthcare provider.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  icon: {
    fontSize: 16,
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
});

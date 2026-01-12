import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export function Disclaimer() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.disclaimerBackground, borderTopColor: colors.disclaimerBorder }]}>
      <Text style={[styles.text, { color: colors.disclaimerText }]}>
        This app is a timing tool only. It does not provide medical advice.
        Always consult with your healthcare provider about your specific situation.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

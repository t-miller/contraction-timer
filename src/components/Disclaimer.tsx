import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Disclaimer() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        This app is a timing tool only. It does not provide medical advice.
        Always consult with your healthcare provider about your specific situation.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF3E0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#FFE0B2',
  },
  text: {
    fontSize: 12,
    color: '#E65100',
    textAlign: 'center',
    lineHeight: 18,
  },
});

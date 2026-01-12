import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { TimerButton } from '../components/TimerButton';
import { Statistics } from '../components/Statistics';
import { ContractionList } from '../components/ContractionList';
import { Disclaimer } from '../components/Disclaimer';
import { useTheme } from '../context/ThemeContext';

export function HomeScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Contraction Timer</Text>
      </View>
      <TimerButton />
      <Statistics />
      <ContractionList />
      <Disclaimer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

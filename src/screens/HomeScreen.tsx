import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TimerButton } from '../components/TimerButton';
import { Statistics } from '../components/Statistics';
import { ContractionList } from '../components/ContractionList';
import { Instructions } from '../components/Instructions';
import { useTheme } from '../context/ThemeContext';

export function HomeScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={[styles.title, { color: colors.text }]}>Contraction Timer</Text>
              <Text style={[styles.subtitle, { color: colors.textTertiary }]}>Track and time your contractions</Text>
            </View>
            <Instructions />
          </View>
        </View>
        <TimerButton />
        <Statistics />
        <ContractionList />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
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
});

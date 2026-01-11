import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useContractions } from '../context/ContractionContext';
import { ContractionItem } from './ContractionItem';
import { Contraction } from '../types';

export function ContractionList() {
  const { state, clearHistory } = useContractions();

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all recorded contractions?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearHistory },
      ]
    );
  };

  const getIntervalFromPrevious = (index: number): number | null => {
    if (index >= state.contractions.length - 1) return null;
    const current = state.contractions[index];
    const previous = state.contractions[index + 1];
    return current.startTime - (previous.endTime || previous.startTime);
  };

  const renderItem = ({ item, index }: { item: Contraction; index: number }) => (
    <ContractionItem
      contraction={item}
      intervalFromPrevious={getIntervalFromPrevious(index)}
    />
  );

  if (state.contractions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No contractions recorded yet</Text>
        <Text style={styles.emptyHint}>Tap the button above to start timing</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>History</Text>
        <TouchableOpacity onPress={handleClearHistory}>
          <Text style={styles.clearButton}>Clear</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={state.contractions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    fontSize: 16,
    color: '#F44336',
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
  },
});

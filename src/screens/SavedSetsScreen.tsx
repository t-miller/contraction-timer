import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useContractions } from '../context/ContractionContext';
import { ContractionSet } from '../types';

export function SavedSetsScreen() {
  const navigation = useNavigation();
  const { state, loadSet, deleteSet } = useContractions();

  const handleLoadSet = (set: ContractionSet) => {
    const doLoad = () => {
      loadSet(set.id);
      navigation.navigate('Home' as never);
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Load "${set.name}"? This will replace your current contractions.`)) {
        doLoad();
      }
    } else {
      Alert.alert(
        'Load Set',
        `Load "${set.name}"? This will replace your current contractions.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Load', onPress: doLoad },
        ]
      );
    }
  };

  const handleDeleteSet = (set: ContractionSet) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Delete "${set.name}"? This cannot be undone.`)) {
        deleteSet(set.id);
      }
    } else {
      Alert.alert(
        'Delete Set',
        `Delete "${set.name}"? This cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteSet(set.id) },
        ]
      );
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }: { item: ContractionSet }) => (
    <View style={styles.setItem}>
      <TouchableOpacity style={styles.setInfo} onPress={() => handleLoadSet(item)}>
        <Text style={styles.setName}>{item.name}</Text>
        <Text style={styles.setDetails}>
          {item.contractions.length} contractions - {formatDate(item.createdAt)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteSet(item)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.title}>Saved Sets</Text>
      </View>

      {state.savedSets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved sets</Text>
          <Text style={styles.emptyHint}>Save your current contractions from the Home screen</Text>
        </View>
      ) : (
        <FlatList
          data={state.savedSets}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    flex: 1,
  },
  setItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  setInfo: {
    flex: 1,
  },
  setName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  setDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteButtonText: {
    fontSize: 14,
    color: '#F44336',
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
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

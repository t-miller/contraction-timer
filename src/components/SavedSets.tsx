import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { useContractions } from '../context/ContractionContext';
import { ContractionSet } from '../types';

export function SavedSets() {
  const { state, saveSet, loadSet, deleteSet } = useContractions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [setName, setSetName] = useState('');

  const handleSaveSet = () => {
    if (state.contractions.length === 0) {
      if (Platform.OS === 'web') {
        window.alert('Record some contractions before saving a set.');
      } else {
        Alert.alert('No Contractions', 'Record some contractions before saving a set.');
      }
      return;
    }
    setIsModalVisible(true);
  };

  const handleConfirmSave = () => {
    const name = setName.trim() || `Set ${state.savedSets.length + 1}`;
    saveSet(name);
    setSetName('');
    setIsModalVisible(false);
  };

  const handleLoadSet = (set: ContractionSet) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Load "${set.name}"? This will replace your current contractions.`)) {
        loadSet(set.id);
      }
    } else {
      Alert.alert(
        'Load Set',
        `Load "${set.name}"? This will replace your current contractions.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Load', onPress: () => loadSet(set.id) },
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Saved Sets</Text>
        <TouchableOpacity onPress={handleSaveSet}>
          <Text style={styles.saveButton}>Save Current</Text>
        </TouchableOpacity>
      </View>

      {state.savedSets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved sets</Text>
          <Text style={styles.emptyHint}>Save your current contractions to recall later</Text>
        </View>
      ) : (
        <FlatList
          data={state.savedSets}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save Set</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a name (optional)"
              value={setName}
              onChangeText={setSetName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setSetName('');
                  setIsModalVisible(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmSave}
              >
                <Text style={styles.confirmButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 200,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
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
  saveButton: {
    fontSize: 16,
    color: '#2196F3',
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
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  confirmButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

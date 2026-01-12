import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import { useContractions } from '../context/ContractionContext';
import { useTheme } from '../context/ThemeContext';
import { ContractionItem } from './ContractionItem';
import { Contraction } from '../types';

export function ContractionList() {
  const { state, clearHistory, saveSet } = useContractions();
  const { colors } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [setName, setSetName] = useState('');

  const handleClearHistory = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to clear all recorded contractions?')) {
        clearHistory();
      }
    } else {
      Alert.alert(
        'Clear History',
        'Are you sure you want to clear all recorded contractions?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: clearHistory },
        ]
      );
    }
  };

  const handleSaveSet = () => {
    setIsModalVisible(true);
  };

  const handleConfirmSave = () => {
    const name = setName.trim() || `Set ${state.savedSets.length + 1}`;
    saveSet(name);
    setSetName('');
    setIsModalVisible(false);
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
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No contractions recorded yet</Text>
        <Text style={[styles.emptyHint, { color: colors.textTertiary }]}>Tap the button above to start timing</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { backgroundColor: colors.surfaceSecondary, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerText, { color: colors.text }]}>History</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handleSaveSet}>
            <Text style={[styles.saveButton, { color: colors.primary }]}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClearHistory}>
            <Text style={[styles.clearButton, { color: colors.danger }]}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={state.contractions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Save Set</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, backgroundColor: colors.inputBackground, color: colors.text }]}
              placeholder="Enter a name (optional)"
              placeholderTextColor={colors.textTertiary}
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
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.primary }]}
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
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  saveButton: {
    fontSize: 16,
  },
  clearButton: {
    fontSize: 16,
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
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
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
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
